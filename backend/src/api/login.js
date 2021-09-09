const config = require('../config/index');
const providerEmail1 = config.emails[0];
const bcrypt = require('bcrypt');
const logger = config.logger;
const EmailService = require('../services/emailservice');
const phoneUtil =
  require('google-libphonenumber').PhoneNumberUtil.getInstance();

const DownloadImage = require('../util/downloadimage');
const isImageURL = require('image-url-validator').default;

class LoginController {
  constructor(repo, repo2) {
    this.repo = repo;
    this.credential = repo2;
    logger.info('LoginController');
    this.service = new EmailService();
  }

  delete = async (req, res, next) => {
    if (req.body) {
      const { email } = req.body;
      let userModel = this.repo.getModel();

      const userExist = await userModel.findOne({ email: email });
      if (userExist) {
        const deleteUser = await this.repo.delete(userExist);
        if (deleteUser) {
          return res.json({ SUCCESS: 'Usuario eliminado', fail: null });
        }
      }
    }
    return res.json({
      SUCCESS: null,
      fail: 'No fue posible eliminar el usuario',
    });
  };

  signup = async (req, res, next) => {
    if (req.body) {
      const { email, direccion, avatar, tel, nombre, edad, password, pais } =
        req.body;

      let avatarValid = await isImageURL(avatar);
      if (!avatarValid) {
        return res.json({
          SUCCESS: null,
          fail: 'La imagen de usuario no es valida',
        });
      }

      if (!phoneUtil.isValidNumber(phoneUtil.parse(tel, pais), pais)) {
        return res.json({
          SUCCESS: null,
          fail: 'El telefono no es valido',
        });
      }

      let userModel = this.repo.getModel();

      const user = await userModel.findOne({ email: email });

      if (!user) {
        try {
          const userNew = await this.repo.save(req.body);

          const newPassword = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(11),
            null
          );
          await this.credential.save({
            user: userNew,
            password: newPassword,
          });

          if (avatar) {
            const download = new DownloadImage();
            download.downloadImage(avatar, nombre);
          }

          const fechaLogin = new Date().toISOString();
          this.service.initialize(providerEmail1);
          this.service.setFrom('Sistemas registro');
          this.service.send(
            'Se registro nuevo usuario',
            config.email_to,
            `
            <i>Usuario nuevo: </i>
            <br>
            <ul>
            
              <li>${email}</li><li>${direccion}</li><li>${nombre}</li><li>${edad}</li><li>${avatar}</li><li>${tel}</li><li>${pais}</li>
              </ul> 
            <b> 
              ${fechaLogin} 
              <hr>
            </b>
            `
          );
          logger.info(
            '##########Deberia enviar mail de registro al administrador##############'
          );

          return res.json({ SUCCESS: userNew, fail: null });
        } catch (error) {
          console.log(error);
          throw new Error('Error al generar un nuevo usuario');
        }
      } else {
        return res.json({
          SUCCESS: null,
          fail: 'La cuenta ya existe, por favor use otra cuenta',
        });
      }
    }
    return res.json({
      SUCCESS: null,
      fail: 'Falla al realizar registro de usuario',
    });
  };

  logout = async (req, res, next) => {
    let username = '';
    if (req.isAuthenticated()) {
      username = req.user.nombre;
      req.logout();
    }
    res.clearCookie('user');
    req.session.destroy();
    const fechaLogin = new Date().toISOString();
    this.service.initialize(providerEmail1);
    this.service.setFrom('Sistemas Logout');
    this.service.send(
      'Logout',
      config.email_to,
      '<i>Usuario logout: ' + username + '</i> <b>' + fechaLogin + '</b>'
    );
    logger.info('##########Deberia enviar mail##############');
    return res.json({ SUCCESS: true, fail: null });
  };

  login = async (req, res, next) => {
    logger.info('login paso');
    if (req.user) {
      res.cookie('user', req.user.nombre, { expire: 1000 * 60 });
      return res.json({ SUCCESS: true, token: req.user.token, fail: null });
    }
    return res.json({ SUCCESS: null, fail: 'Error al realizar post login' });
  };
}

module.exports = LoginController;
