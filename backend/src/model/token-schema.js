const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      default: '',
    },
  },
  { collection: 'tokens' }
);

module.exports = TokenSchema;
