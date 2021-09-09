const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      default: '',
    },
    email: {
      type: String,
      required: false,
      default: '',
    },
    direccion: {
      type: String,
      required: true,
      default: '',
    },
    edad: {
      type: Number,
      required: true,
      default: '',
    },
    tel: {
      type: String,
      required: true,
      default: '',
    },
    avatar: {
      type: String,
      required: true,
      default: '',
    },
    role: {
      type: String,
      required: false,
      default: 'user',
    },
  },
  { collection: 'users' }
);

module.exports = UserSchema;
