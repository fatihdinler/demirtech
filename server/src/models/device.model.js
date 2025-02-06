/**
 * models/Device.js
 * 
 * Bu dosya, hem klima içerisinde çalışan hem de bağımsız olarak takılan 
 * cihazları (örneğin, sensörler, kontrol üniteleri) temsil eden Device 
 * şemasını ve modelini tanımlar.
 *
 * Örnek Kullanım:
 *   const Device = require('./models/Device')
 *   const device = new Device({
 *     branch: branchId,
 *     deviceName: 'Sensör 1',
 *     deviceType: 'Independent',
 *     status: 'Active',
 *     installationDate: new Date()
 *   })
 *   device.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const DeviceSchema = new Schema({
  branch: { 
    type: Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: [true, 'Şube bilgisi gerekli'] 
  },
  climate: { 
    type: Schema.Types.ObjectId, 
    ref: 'Climate', 
    default: null 
  },
  deviceName: { 
    type: String, 
    required: [true, 'Cihaz adı gerekli'], 
    trim: true 
  },
  deviceType: { 
    type: String, 
    enum: {
      values: ['Inside', 'Independent'],
      message: 'deviceType değeri "Inside" veya "Independent" olmalıdır'
    },
    required: [true, 'Cihaz tipi gerekli']
  },
  status: { 
    type: String, 
    trim: true 
  },
  installationDate: { 
    type: Date 
  }
}, { timestamps: true })

module.exports = mongoose.model('Device', DeviceSchema)
