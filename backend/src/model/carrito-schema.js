const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CarritoSchema = new Schema(
  {
    timestamp: {
      type: Number,
      required: true,
      default: Math.floor(Date.now() / 1000),
    },
    carrito_session: {
      type: String,
      required: true,
      default: '',
    },
    title: {
      type: String,
      required: true,
      default: '',
    },
    description: {
      type: String,
      required: true,
      default: '',
    },
    thumbail: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      default: '',
    },
    stock: {
      type: Number,
      required: true,
      default: '',
    },
    code: {
      type: String,
      required: true,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      default: '',
    },
  },
  { collection: 'carritos' }
);

module.exports = CarritoSchema;
