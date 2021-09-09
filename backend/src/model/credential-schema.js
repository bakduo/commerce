const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CredentialSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    password: {
      type: String,
      required: true,
      default: '',
    },
  },
  { collection: 'credentials' }
);

module.exports = CredentialSchema;
