const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProductoSchema = new Schema(
  {
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
  { collection: 'productos' }
);

module.exports = ProductoSchema;
