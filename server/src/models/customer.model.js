/**
 * models/Customer.js
 * 
 * Bu dosya, büyük firma zincirlerini (örneğin, Kredi, Şok, Bim, Carrefoursa) 
 * temsil eden Customer şemasını ve modelini tanımlar.
 *
 * Örnek Kullanım:
 *   const Customer = require('./models/Customer')
 *   const newCustomer = new Customer({ name: 'Bim', description: 'Perakende Zinciri' })
 *   newCustomer.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const CustomerSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Müşteri adı gerekli'], 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  }
}, { timestamps: true })

module.exports = mongoose.model('Customer', CustomerSchema)
