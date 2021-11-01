const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrdenSchema = new Schema(
  {
    productos: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'productos',
    }],
    timestamp: {
      type: Number,
      required: true,
      default: Math.floor(Date.now() / 1000),
    },
    estado: {
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
  { collection: 'ordenes' }
);

module.exports = OrdenSchema;