const mongoose = require('mongoose')

const schema = {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/media/default.png'
  },
  isVerified: {
    typeof: Boolean,
    default: false
  }
}

const UserSchema = new mongoose.Schema(schema, { timestamps: true })
const User = mongoose.model('user', UserSchema)

module.exports = User
