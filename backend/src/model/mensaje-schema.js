const mongoose = require('mongoose');

const MensajeSchema = new mongoose.Schema(
  {
    msg: {
      type: String,
      required: true,
      default: '',
    },
    user: {
      type: String,
      required: true,
      default: '',
    },
    tiempo: {
      type: String,
      required: true,
      default: 0,
    },
  },
  { collection: 'mensajes' }
);

module.exports = MensajeSchema;
