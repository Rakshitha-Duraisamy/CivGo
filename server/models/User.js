const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    enum: ['en', 'ta', 'hi'],
    default: 'en'
  },
  role: {
    type: String,
    enum: ['citizen', 'staff', 'department_admin', 'super_admin', 'admin'],
    default: 'citizen'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
