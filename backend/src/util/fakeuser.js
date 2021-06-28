exports.fakeUser = async (token) => {
  if (token) {
    return { role: 'admin' };
  }
  return { role: 'user' };
};
