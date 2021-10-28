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
  const credential = await repo2.find({query:{key:'user',value:user}})
  return bcrypt.compareSync(password, credential.password);
};

exports.checkJWT = async (req, res, next) => {
  try {
    if (req.body.email) {
      const { email, password } = req.body;
      let usuario = await repo.find({query:{key:'email',value:email}});
      if (!usuario) {
        return res.json({ SUCCESS: false, fail: 'usuario no encontrado' });
      } else {
        const valid = await isValidPassword(usuario, password);
        if (!valid) {
          return res.status(401).json({
            SUCCESS: false,
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

          //let tokens = repo3.getModel();

          //const tokenAlready = await tokens.findOne({ email: email });

          let tokenAlready = repo3.find({query:{key:'email',value:email}});

          if (tokenAlready) {
            await repo3.updateById(tokenAlready._id || tokenAlready.id , {
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
    
    throw new Error('Error al realizar login de usuario');
  }
};
