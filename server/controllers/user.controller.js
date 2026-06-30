const User = require('../models/User.model')
const bcrypt = require('bcryptjs')

// ─── Get User Profile ──────────────────────────────────────────
// GET /api/user/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update User Profile ───────────────────────────────────────
// PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body

    // Check if email is already taken by another user
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      })

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account',
        })
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update Password ───────────────────────────────────────────
// PUT /api/user/password
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user with password
    const user = await User.findById(req.user._id)

    // Check current password is correct
    const isMatch = await user.matchPassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    // Update password
    // pre('save') hook will automatically hash the new password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// ─── Update Reminder Settings ──────────────────────────────────
// PUT /api/user/reminder
const updateReminder = async (req, res) => {
  try {
    const { reminderEnabled } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { reminderEnabled },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: `Reminders ${reminderEnabled ? 'enabled' : 'disabled'}`,
      data: user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  updateReminder,
}