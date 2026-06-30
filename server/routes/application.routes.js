const express = require('express')
const router = express.Router()
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getAnalytics,
} = require('../controllers/application.controller')
const { protect } = require('../middleware/auth.middleware')
const { body } = require('express-validator')
const { validate } = require('../middleware/validate.middleware')

// Validation rules
const applicationRules = [
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),
]

// All routes are protected — user must be logged in
router.use(protect)

// Routes
router.get('/analytics', getAnalytics)
router.get('/', getApplications)
router.get('/:id', getApplication)
router.post('/', applicationRules, validate, createApplication)
router.put('/:id', updateApplication)
router.put('/:id/status', updateStatus)
router.delete('/:id', deleteApplication)

module.exports = router