const mongoose = require('mongoose')

const schema = {
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  protocol: {
    type: String,
    required: true
  },
  port: {
    type: Number
  },
  data: [
    {
      state: String,
      date: Date
    }
  ]
}

const CheckSchema = new mongoose.Schema(schema, { timestamps: true })
const Check = mongoose.model('check', CheckSchema)

module.exports = Check
