const mongoose = require('mongoose');
const { v4: uuid } = require('uuid');

const OTPSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Otomatik silme (TTL) ayarı: expiresAt alanına göre silinecek
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);
