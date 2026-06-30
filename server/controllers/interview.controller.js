const Interview = require('../models/Interview.model')
const Application = require('../models/Application.model')

// ─── Get All Interviews for an Application ─────────────────────
// GET /api/interviews/:applicationId
const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({
      application: req.params.applicationId,
      user: req.user._id,
    }).sort({ round: 1 })

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Create Interview Round ────────────────────────────────────
// POST /api/interviews/:applicationId
const createInterview = async (req, res) => {
  try {
    // Check if application exists and belongs to user
    const application = await Application.findOne({
      _id: req.params.applicationId,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    const { round, type, date, status, notes, outcome } = req.body

    const interview = await Interview.create({
      application: req.params.applicationId,
      user: req.user._id,
      round,
      type,
      date,
      status,
      notes,
      outcome,
    })

    res.status(201).json({
      success: true,
      message: 'Interview round added successfully',
      data: interview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update Interview Round ────────────────────────────────────
// PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: interview,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Delete Interview Round ────────────────────────────────────
// DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found',
      })
    }

    await interview.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Interview round deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
}