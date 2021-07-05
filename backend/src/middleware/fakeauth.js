const fakeDB = require('../util/fakeuser');

// code share https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff11
// Fake simulate
exports.fakeAuth = async (request, _response, next) => {
  const apiToken = request.headers['x-api-custom'];

  request.user = await fakeDB.fakeUser(apiToken);

  // always continue to next middleware
  next();
};
