const express = require('express')
const router = express.Router()
const { register, login, getMe } = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { body } = require('express-validator')
const { validate } = require('../middleware/validate.middleware')

// Validation rules
const registerRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
]

const loginRules = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
]

// Routes
router.post('/register', registerRules, validate, register)
router.post('/login', loginRules, validate, login)
router.get('/me', protect, getMe)

module.exports = router