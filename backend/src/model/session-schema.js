const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    session: {},
  },
  { collection: 'sessions' },
  { strict: false }
);

module.exports = SessionSchema;
