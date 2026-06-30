const express = require('express')
const router = express.Router()
const {
  getProfile,
  updateProfile,
  updatePassword,
  updateReminder,
} = require('../controllers/user.controller')
const { protect } = require('../middleware/auth.middleware')

// All routes are protected
router.use(protect)

// Routes
router.get('/profile', getProfile)
router.put('/profile', updateProfile)
router.put('/password', updatePassword)
router.put('/reminder', updateReminder)

module.exports = router