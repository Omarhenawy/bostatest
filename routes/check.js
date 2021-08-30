const router = require('express').Router()
const User = require('../models/User')
const { check, validationResult } = require('express-validator')
const auth = require('../middlewares/auth')
const Check = require('../models/Check')

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ errors: errors.array() })
  }

  User.findById()
})

// @route   GET api/check
// @desc    Create a check to monitor a certain url
// @access  Private
router.post(
  '/',
  auth,
  [
    // check('url', 'Please enter a valid url to monitor').isURL(),
    check('protocol').isIn(['https', 'http', 'tcp']),
    check('name').notEmpty(),
    check('port').optional().isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { url, protocol, name, port } = req.body
    const userId = req.user.id

    try {
      const check = Check({
        owner: userId,
        url,
        protocol,
        port,
        name
      })

      await check.save()

      return res.json(check)
    } catch (error) {
      console.error(error.message)
      res.status(500)
    }
  }
)

module.exports = router
