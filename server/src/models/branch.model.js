/**
 * models/Branch.js
 * 
 * Bu dosya, bir Customer'a ait mağaza veya şubeleri temsil eden Branch 
 * şemasını ve modelini tanımlar. İsteğe bağlı olarak, her şubenin bir bölge 
 * müdürü (User) ile ilişkilendirilmesi sağlanabilir.
 *
 * Örnek Kullanım:
 *   const Branch = require('./models/Branch')
 *   const branch = new Branch({
 *     customer: customerId,
 *     branchName: 'İstanbul Şubesi',
 *     address: 'Örnek Mah., Örnek Sok.',
 *     contactInfo: '0212 123 45 67'
 *   })
 *   branch.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const BranchSchema = new Schema({
  customerId: {
    type: String,
    ref: 'Customer',
    required: [true, 'Müşteri bilgisi gerekli']
  },
  regionManagerId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Şube adı gerekli'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    trim: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Branch', BranchSchema)
