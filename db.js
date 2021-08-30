const mongoose = require('mongoose')

module.exports = async function connectDB() {
  try {
    await mongoose.connect(
      'mongodb://localhost:27017', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    })
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error.message)

    process.exit(1)
  }
}
