const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Middleware
const errorMiddleware = require('./middleware/error.middleware');
const { successResponse } = require('./utils/apiResponse');

// Routes
const authRoutes         = require('./routes/auth.routes');
const profileRoutes      = require('./routes/profile.routes');
const householdRoutes    = require('./routes/household.routes');
const wasteTypeRoutes    = require('./routes/wasteType.routes');
const submissionRoutes   = require('./routes/submission.routes');
const incentiveRoutes    = require('./routes/incentive.routes');
const rewardRoutes       = require('./routes/reward.routes');
const rewardReqRoutes    = require('./routes/rewardRequest.routes');
const announcementRoutes = require('./routes/announcement.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------------------
// Health Check
// -------------------------------------------------------------------------
app.get('/', (req, res) => {
  return successResponse(res, 'Trash2Worth API is running', {
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// -------------------------------------------------------------------------
// API Routes
// -------------------------------------------------------------------------
app.use('/api/auth',           authRoutes);
app.use('/api/profiles',       profileRoutes);
app.use('/api/households',     householdRoutes);
app.use('/api/waste-types',    wasteTypeRoutes);
app.use('/api/submissions',    submissionRoutes);
app.use('/api/incentives',     incentiveRoutes);
app.use('/api/rewards',        rewardRoutes);
app.use('/api/reward-requests', rewardReqRoutes);
app.use('/api/announcements',  announcementRoutes);

// -------------------------------------------------------------------------
// 404 Handler
// -------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// -------------------------------------------------------------------------
// Global Error Handler
// -------------------------------------------------------------------------
app.use(errorMiddleware);

module.exports = app;
