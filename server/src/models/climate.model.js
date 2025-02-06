/**
 * models/Climate.js
 * 
 * Bu dosya, bir şubedeki klima sistemlerini temsil eden Climate şemasını 
 * ve modelini tanımlar.
 *
 * Örnek Kullanım:
 *   const Climate = require('./models/Climate')
 *   const climate = new Climate({
 *     branch: branchId,
 *     model: 'LG XYZ',
 *     installationDate: new Date()
 *   })
 *   climate.save().then(...)
 */

const mongoose = require('mongoose')
const { Schema } = mongoose

const ClimateSchema = new Schema({
  branch: { 
    type: Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: [true, 'Şube bilgisi gerekli'] 
  },
  model: { 
    type: String, 
    required: [true, 'Klima modeli gerekli'], 
    trim: true 
  },
  installationDate: { 
    type: Date 
  }
}, { timestamps: true })

module.exports = mongoose.model('Climate', ClimateSchema)
