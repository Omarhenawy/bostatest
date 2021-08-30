const jwt = require('jsonwebtoken')

module.exports = function Auth (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token')
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization denied.' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'supersecretkey')

    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token isn\'t valid.' })
  }
}
