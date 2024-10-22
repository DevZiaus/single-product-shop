const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);