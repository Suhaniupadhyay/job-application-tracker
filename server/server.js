const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const startReminderJob = require('./jobs/reminder.job')
const { errorHandler } = require('./middleware/error.middleware')

// Load environment variables first
dotenv.config()

// Connect to MongoDB
connectDB()
//for reminder job  Start cron jobs
startReminderJob()

// Create express app
const app = express()

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/applications', require('./routes/application.routes'))
app.use('/api/interviews', require('./routes/interview.routes'))
app.use('/api/user', require('./routes/user.routes'))

// ─── Test Route ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Job Tracker API is running'
  })
})

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

// ─── Error Handler ────────────────────────────────────────────
// Must be last — after all routes
app.use(errorHandler)

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})