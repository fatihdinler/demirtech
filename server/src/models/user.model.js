/**
 * models/User.js
 * 
 * Bu dosya, sistemdeki kullanıcıları temsil eden User şemasını ve modelini 
 * tanımlar. Her kullanıcı, bir Role (Role modeline referans) ile ilişkilendirilir. 
 * Bu sayede kullanıcıların yetkilendirme seviyeleri yönetilebilir.
 *
 * Örnek Kullanım:
 *   const User = require('./models/User')
 *   const user = new User({
 *     username: 'muhammet',
 *     passwordHash: 'hashlenmişşifre',
 *     email: 'muhammet@example.com',
 *     phoneNumber: '0555 123 4567',
 *     role: roleId,  // Role modelinden alınan ID
 *     isActive: false
 *   })
 *   user.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Kullanıcı adı gerekli'], 
    unique: true, 
    trim: true 
  },
  passwordHash: { 
    type: String, 
    required: [true, 'Şifre gerekli'] 
  },
  email: { 
    type: String, 
    trim: true, 
    lowercase: true 
  },
  phoneNumber: { 
    type: String, 
    trim: true 
  },
  role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: [true, 'Kullanıcı rolü gerekli'] 
  },
  isActive: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
