const config = require('../config/index');
const providerEmail1 = config.emails[0];
const logger = config.logger;
const EmailService = require('../services/emailservice');
const UserApi = require('../api/user-api');

class LoginController {
  constructor(repo, repo2) {
    this.api = new UserApi(repo,repo2);
    this.service = new EmailService();
  }

  list = async (req, res, next) => {
    if (req.body) {
      const userExist = await this.api.getAll();
      return res.status(200).json(userExist);
    };
  }

  delete = async (req, res, next) => {
    if (req.body) {
      const { email } = req.body;
      const userExist = await this.api.findOne(email);
      if (userExist) {
        const deleteUser = await this.api.deleteOne(userExist.id);
        if (deleteUser) {
          return res.json({ SUCCESS: 'Usuario eliminado', fail: false });
        }
      }
    }
    return res.json({
      SUCCESS: false,
      fail: 'No fue posible eliminar el usuario',
    });
  };

  signup = async (req, res, next) => {
    if (req.body) {
      
      const user = await this.api.add(req.body);
      if (user.SUCCESS) {
        try {
          const { email, direccion, avatar, tel, nombre, edad, password, pais } =
        req.body;
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
          logger.debug(
            '##########Deberia enviar mail de registro al administrador##############'
          );

          return res.status(200).json({ SUCCESS: user.SUCCESS, fail: false });
        } catch (error) {
          logger.debug(`Exception: ${error}`);
          return res.status(500).json({
            SUCCESS: false,
            fail: 'Exception al generar un nuevo usuario',
          });
        }
      } else {
        return res.status(200).json({
          SUCCESS: false,
          fail: user.fail,
        });
      }
    }
    return res.status(200).json({
      SUCCESS: false,
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
    //req.session.destroy();
    const fechaLogin = new Date().toISOString();
    this.service.initialize(providerEmail1);
    this.service.setFrom('Sistemas Logout');
    this.service.send(
      'Logout',
      config.email_to,
      '<i>Usuario logout: ' + username + '</i> <b>' + fechaLogin + '</b>'
    );
    logger.debug('##########Deberia enviar mail##############');
    return res.json({ SUCCESS: true, fail: false });
  };

  login = async (req, res, next) => {
    logger.debug('login paso');
    if (req.user) {
      res.cookie('user', req.user.nombre, { expire: 1000 * 60 });
      return res.json({ SUCCESS: true, token: req.user.token, fail: false });
    }
    return res.status(401).json({ SUCCESS: false, fail: 'Error al realizar post login' });
  };

}

module.exports = LoginController;
