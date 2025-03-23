const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuid,
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['super', 'client'],
    required: true
  },
  isTempPassword: {
    type: Boolean,
    default: false
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
