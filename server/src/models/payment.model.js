/**
 * models/Payment.js
 * 
 * Bu dosya, bölge müdürlerinden alınan ödemeleri temsil eden Payment 
 * şemasını ve modelini tanımlar. Ödeme bilgileri, mobil uygulama erişimi 
 * kontrolü gibi süreçlerde kullanılır.
 *
 * Örnek Kullanım:
 *   const Payment = require('./models/Payment')
 *   const payment = new Payment({
 *     regionManager: userId,
 *     paymentPeriod: '2025-01',
 *     paymentAmount: 1000,
 *     paymentStatus: 'Pending'
 *   })
 *   payment.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const PaymentSchema = new Schema({
  regionManager: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'Bölge müdürü bilgisi gerekli'] 
  },
  paymentPeriod: { 
    type: String, 
    required: [true, 'Ödeme periyodu gerekli'],
    trim: true 
  },
  paymentAmount: { 
    type: Number, 
    required: [true, 'Ödeme miktarı gerekli'] 
  },
  paymentStatus: { 
    type: String, 
    enum: {
      values: ['Pending', 'Confirmed', 'Rejected'],
      message: 'Ödeme durumu "Pending", "Confirmed" veya "Rejected" olmalıdır'
    },
    default: 'Pending'
  },
  paymentDate: { 
    type: Date, 
    default: Date.now 
  },
  approvalDate: { 
    type: Date 
  },
  comments: { 
    type: String, 
    trim: true 
  }
}, { timestamps: true })

module.exports = mongoose.model('Payment', PaymentSchema)
