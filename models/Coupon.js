const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);