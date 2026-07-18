const cron = require('node-cron')
const Application = require('../models/Application.model')
const User = require('../models/User.model')
const sendEmail = require('../utils/sendEmail')

const startReminderJob = () => {
  // Runs every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running deadline reminder job...')

    try {
      // Get tomorrow's date
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const dayAfter = new Date(tomorrow)
      dayAfter.setDate(dayAfter.getDate() + 1)

      // Find applications with deadline tomorrow
      // that haven't had a reminder sent yet
      const applications = await Application.find({
        deadline: { $gte: tomorrow, $lt: dayAfter },
        reminderSent: false,
      }).populate('user')

      console.log(`Found ${applications.length} applications with deadline tomorrow`)

      for (const application of applications) {
        const user = application.user

        // Skip if user has reminders disabled
        if (!user.reminderEnabled) continue

        // Send reminder email
        await sendEmail({
          to: user.email,
          subject: `Reminder: ${application.company} deadline is tomorrow!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4F46E5;">Job Application Reminder</h2>
              <p>Hi ${user.name},</p>
              <p>This is a reminder that your application deadline is <strong>tomorrow</strong>.</p>
              <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Company:</strong> ${application.company}</p>
                <p><strong>Role:</strong> ${application.role}</p>
                <p><strong>Status:</strong> ${application.status}</p>
                <p><strong>Deadline:</strong> ${new Date(application.deadline).toDateString()}</p>
              </div>
              <p>Good luck with your application!</p>
              <p>— Job Tracker</p>
            </div>
          `,
        })

        // Mark reminder as sent
        await Application.findByIdAndUpdate(application._id, {
          reminderSent: true,
        })

        console.log(`Reminder sent to ${user.email} for ${application.company}`)
      }
    } catch (error) {
      console.error('Reminder job error:', error.message)
    }
  })

  console.log('Reminder job scheduled — runs daily at 9:00 AM')
}

module.exports = startReminderJob