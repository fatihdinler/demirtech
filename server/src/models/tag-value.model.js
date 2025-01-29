const mongoose = require('mongoose')

const TagValueSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  tagId: {
    type: String,
    required: true,
  },
  occurredTime: {
    type: Date,
    required: true,
  },
}, {
  timestamps: { createdAt: 'createdTime', updatedAt: 'updatedTime' },
})

module.exports = mongoose.model('TagValue', TagValueSchema)
