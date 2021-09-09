const config = require('../config/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserDAO = require('../dao/user-dao');
const CredentialDAO = require('../dao/credential-dao');
const TokenDAO = require('../dao/token-dao');
const repo = new UserDAO(config.db);
const repo2 = new CredentialDAO(config.db);
const repo3 = new TokenDAO(config.db);

isValidPassword = async (user, password) => {
  const userCredential = repo2.getModel();
  const credential = await userCredential.findOne({ user: user });
  return bcrypt.compareSync(password, credential.password);
};

exports.checkJWT = async (req, res, next) => {
  try {
    if (req.body.email) {
      const { email, password } = req.body;

      let user = repo.getModel();

      let usuario = await user.findOne({ email: email });

      if (!usuario) {
        return res.json({ SUCCESS: null, fail: 'usuario no encontrado' });
      } else {
        const valid = await isValidPassword(usuario, password);
        if (!valid) {
          return res.json({
            SUCCESS: null,
            fail: 'usuario o password invalida',
          });
        } else {
          const token = jwt.sign(
            {
              email: usuario.email,
              role: usuario.role,
              nombre: usuario.nombre,
            },
            config.secret,
            {
              expiresIn: '2h',
            }
          );

          let tokens = repo3.getModel();

          const tokenAlready = await tokens.findOne({ email: email });

          if (tokenAlready) {
            await repo3.updateById(tokenAlready._id, {
              token: token,
              email: email,
            });
          } else {
            await repo3.save({
              token: token,
              email: email,
            });
          }

          req.user = usuario;
          req.user.token = token;
          next();
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw new Error('Error al realizar login de usuario');
  }
};
