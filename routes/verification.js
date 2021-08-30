const router = require('express').Router()
const Token = require('../models/Token')
const User = require('../models/User')


router.get('/:email/:token', async (req, res) => {
  const { email, token } = req.params
  token = await Token.findOne({ token })

  if (!token) {
    return res.status(401).json({
      msg: 'Your verification url may have been expired. Request another one.'
    })
  }

  user = await User.findOne({ email })

  if (user.isVerified) {
    return res.json({
      msg: 'You have been already verified.'
    })
  }

  user.isVerified = true
  await user.save()

  return res.json({
    msg: 'Your account has been successfully verified'
  })
})

router.get('/', async (req, res) => {
  
})

module.exports = router
