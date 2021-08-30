const router = require('express').Router()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const Token = require('../models/Token')

function sendVerificationEmail({ name, email, token, host }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
      user: 'username',
      pass: 'password'
    }
  })
  const mailOptions = {
    from: 'no-reply@bosta-assignment.com',
    to: email,
    subject: 'Account Verification Link',
    text:
      'Hello ' +
      name +
      ',\n\n' +
      'Please verify your account by clicking the link: \nhttp://' +
      host +
      '/confirmation/' +
      email +
      '/' +
      token +
      '\n\nThank You!\n'
  }

  return transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).send({
        msg: 'Error happened while sneding your verfication mail, please request another one'
      })
    }

    return res
      .status(200)
      .send(
        'A verification email has been sent to ' +
          email +
          '. It will be expire after 3 days.'
      )
  })
}

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('email', 'Please enter a valid email').isEmail().trim(),
    check('password', 'Please enter a valid password').isLength({ min: 8 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body

    try {
      // See if user exist
      let user = await User.findOne({ email })
      if (user)
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })

      user = new User({ name, email, password })

      // Encrypt password
      const salt = await bcrypt.genSalt()
      user.password = await bcrypt.hash(password, salt)

      const userSavePromise = user.save()

      const token = new Token({
        token: crypto.randomBytes(16).toString('hex'),
        user: user.id
      })

      const tokenSavePromise = token.save()

      await Promise.all([userSavePromise, tokenSavePromise])

      // return sendVerificationEmail({
      //   name,
      //   email,
      //   token: token.token,
      //   host: req.headers.host
      // })

      // const payload = {
      //   user: {
      //     id: user.id
      //   }
      // }

      // jwt.sign(payload, 'supersecretkey', { expiresIn: '1h' }, (err, token) => {
      //   if (err) throw err
      //   res.json({ token })
      // })

      // Return jsonwebtoken
      res.send(`User ${user.id} is registered successfully.`)
    } catch (error) {
      console.error(error.message)
      res.status(500)
    }
  }
)

module.exports = router
