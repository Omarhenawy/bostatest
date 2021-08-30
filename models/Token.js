const mongoose = require('mongoose')

const schema = {
  token: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiresAt: {
    type: Date,
    default: Date.now(),
    index: { expires: '3d' }
  }
}

const TokenSchema = new mongoose.Schema(schema, { timestamps: true })
const Token = mongoose.model('token', TokenSchema)

module.exports = Token
