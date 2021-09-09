'use strict';

const passport = require('passport');

const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config/index');
const providerEmail1 = config.emails[0];
const EmailService = require('../services/emailservice');
const { logger } = require('../config/index');
/**
 * [WPassport wrapper para tener una estrategia de multi-auth]
 */
class WPassport {
  constructor(repo, repo2) {
    this.repo = repo;
    this.support = config.passportLogin;
    this.enableLogin = {};
    this.service = new EmailService();
    this.credential = repo2;
  }

  isValidPassword = async (user, password) => {
    const credential = await this.credential.findOne({ _id: user._id });
    return bcrypt.compareSync(password, credential.password);
  };

  createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(11), null);
  };

  // checkLogin = async (req, email, password, done) => {
  //   let userModel = this.repo.getModel();

  //   let user = await userModel.findOne({ email: email });

  //   if (!user) {
  //     return done(null, false, console.log('mensaje', 'usuario no encontrado'));
  //   } else {
  //     if (!this.isValidPassword(user, password)) {
  //       return done(null, false, console.log('mensaje', 'contraseña invalida'));
  //     } else {
  //       return done(null, user);
  //     }
  //   }
  // };

  checkJWT = async (jwt_payload, done) => {
    try {
      let user = this.repo.getModel();
      let usuario = await user.findOne({ email: jwt_payload.email });
      if (!usuario) {
        logger.info('mensaje', 'usuario no encontrado');
        return done(null, false);
      } else {
        return done(null, usuario);
      }
    } catch (error) {
      return error, false;
    }
  };

  deserializeUserLocal = async (user, done) => {
    //Only refresh
    return done(null, user);
  };

  serializerLocal = async (user, done) => {
    //Only by login
    return done(null, user);
  };

  checkLoginFacebook = async (accessToken, refreshToken, profile, done) => {
    let user = profile;
    return done(null, user);
  };

  generateStructureLogin = async () => {
    this.support.forEach((item) => {
      switch (item) {
        case 'facebook':
          //Remember use secret for this
          passport.use(
            'facebook',
            new FacebookStrategy(
              {
                clientID: config.facebookid || '',
                clientSecret: config.facebooksecret || '',
                callbackURL: config.facebookcallback || '',
                profileFields: ['id', 'displayName', 'photos', 'emails'],
                scope: ['email'],
              },
              this.checkLoginFacebook
            )
          );

          this.enableLogin[item] = true;

          break;
      }
    });

    //Always local
    // passport.use(
    //   'login',
    //   new LocalStrategy(
    //     {
    //       passReqToCallback: true,
    //     },
    //     this.checkLogin
    //   )
    // );

    passport.use(
      'jwt',
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
          jsonWebTokenOptions: {
            ignoreExpiration: false,
          },
          secretOrKey: config.secret,
          algorithms: ['HS256'],
        },
        this.checkJWT
      )
    );

    passport.serializeUser(this.serializerLocal);

    passport.deserializeUser(this.deserializeUserLocal);
  };

  initAsync = async () => {
    await this.generateStructureLogin();
  };

  init = () => {
    //Wrapper async
    const inicio = async () => {
      await this.initAsync();
    };
    inicio();
  };
}

module.exports = WPassport;
