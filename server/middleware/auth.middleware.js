const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const protect = async (req, res, next) => {
  try {
    let token

    // Check if token exists in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer eyJhbG..."
      token = req.headers.authorization.split(' ')[1]
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database using ID from token
    req.user = await User.findById(decoded.id).select('-password')

    // Move to next middleware or controller
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
    })
  }
}

module.exports = { protect }