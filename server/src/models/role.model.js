/**
 * models/Role.js
 * 
 * Bu dosya, kullanıcı rolleri (örneğin, Admin, RegionManager, Technician) 
 * için Role şemasını ve modelini tanımlar. Roller, kullanıcıların yetkilendirilmesi 
 * ve erişim kontrollerinin merkezi olarak yönetilmesini sağlar.
 *
 * Örnek Kullanım:
 *   const Role = require('./models/Role')
 *   Role.find({ roleName: 'Admin' }).then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const RoleSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Role adı gerekli'], 
    unique: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  }
}, { timestamps: true })

module.exports = mongoose.model('Role', RoleSchema)
