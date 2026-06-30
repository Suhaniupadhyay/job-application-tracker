const Application = require('../models/Application.model')

// ─── Get All Applications ──────────────────────────────────────
// GET /api/applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Get Single Application ────────────────────────────────────
// GET /api/applications/:id
const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    res.status(200).json({
      success: true,
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Create Application ────────────────────────────────────────
// POST /api/applications
const createApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      jobLink,
      location,
      package: pkg,
      deadline,
      notes,
    } = req.body

    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      status,
      jobLink,
      location,
      package: pkg,
      deadline,
      notes,
    })

    res.status(201).json({
      success: true,
      message: 'Application added successfully',
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update Application ────────────────────────────────────────
// PUT /api/applications/:id
const updateApplication = async (req, res) => {
  try {
    let application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Delete Application ────────────────────────────────────────
// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    await application.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update Application Status ─────────────────────────────────
// PUT /api/applications/:id/status
// This is specifically for Kanban drag and drop
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true, runValidators: true }
    )

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Get Analytics Data ────────────────────────────────────────
// GET /api/applications/analytics
const getAnalytics = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })

    // Count by status
    const statusCount = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    }

    applications.forEach((app) => {
      if (statusCount[app.status] !== undefined) {
        statusCount[app.status]++
      }
    })

    // Count by month
    const monthlyData = {}
    applications.forEach((app) => {
      const month = new Date(app.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      })
      monthlyData[month] = (monthlyData[month] || 0) + 1
    })

    // Calculate rates
    const total = applications.length
    const responseRate = total
      ? (((total - statusCount.Applied) / total) * 100).toFixed(1)
      : 0
    const offerRate = total
      ? ((statusCount.Offer / total) * 100).toFixed(1)
      : 0

    res.status(200).json({
      success: true,
      data: {
        total,
        statusCount,
        monthlyData,
        responseRate,
        offerRate,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  updateStatus,
  getAnalytics,
}