'use strict';

/**
 * [PassportLocalCustom wrapper para manipular datos necesarios para post-passport-login]
 */
class PassportLocalCustom {
  constructor(repo) {
    this.repo = repo;
  }

  deserializeUserLocal = async (req, res, next) => {
    if (req.isAuthenticated()) {
      let user = req.user || req.passport.user;
      if (user.username) {
        user = user.username;
      }
      req.session.user = user;
      next();
    }
  };

  serializerUserLocal = async (req, res, next) => {
    if (req.isAuthenticated()) {
      req.session.user = { username: req.user.username };
      next();
    }
  };
}

module.exports = PassportLocalCustom;
