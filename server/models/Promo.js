const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema(
  {
    promoCode: { type: String, required: true, unique: true },
    discountDetails: { type: String },
    expirationDate: { type: Date },
    descriptionTerms: { type: String },
    sourceEmail: {
      sender: String,
      subject: String,
      date: String,
    },
    status: { type: String, enum: ['active', 'expired'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promo', PromoSchema); 