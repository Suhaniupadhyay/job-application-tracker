const express = require('express')
const router = express.Router()
const {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
} = require('../controllers/interview.controller')
const { protect } = require('../middleware/auth.middleware')
const { body } = require('express-validator')
const { validate } = require('../middleware/validate.middleware')

// Validation rules
const interviewRules = [
  body('round')
    .notEmpty()
    .withMessage('Round number is required'),
  body('type')
    .notEmpty()
    .withMessage('Interview type is required'),
  body('date')
    .notEmpty()
    .withMessage('Interview date is required'),
]

// All routes are protected
router.use(protect)

// Routes
router.get('/:applicationId', getInterviews)
router.post('/:applicationId', interviewRules, validate, createInterview)
router.put('/:id', updateInterview)
router.delete('/:id', deleteInterview)

module.exports = router