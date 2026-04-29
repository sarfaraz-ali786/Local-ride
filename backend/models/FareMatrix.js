const mongoose = require('mongoose');

const FareMatrixSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FareMatrix', FareMatrixSchema);