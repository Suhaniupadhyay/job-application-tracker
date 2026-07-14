const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { body, validationResult } = require('express-validator')

// Routes
router.post('/register',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  register
)

router.post('/login',
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  login
)

router.get('/me', protect, getMe)

module.exports = router