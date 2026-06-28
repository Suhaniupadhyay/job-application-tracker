const mongoose = require('mongoose')

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    round: {
      type: Number,
      required: [true, 'Round number is required'],
    },
    type: {
      type: String,
      enum: [
        'Resume Shortlisting',
        'Online Assessment',
        'Technical',
        'HR',
        'Managerial',
        'Group Discussion',
        'Other',
      ],
      required: [true, 'Interview type is required'],
    },
    date: {
      type: Date,
      required: [true, 'Interview date is required'],
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
    },
    outcome: {
      type: String,
      enum: ['Pass', 'Fail', 'Waiting', 'NA'],
      default: 'NA',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Interview', interviewSchema)