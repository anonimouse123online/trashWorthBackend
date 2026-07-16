const express = require('express');
const router = express.Router();
const { login, logout, me } = require('../controllers/auth.controller');
const validateMiddleware = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { loginSchema } = require('../validators/auth.validator');

// POST /api/auth/login
router.post('/login', validateMiddleware(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me  (requires valid token)
router.get('/me', authMiddleware, me);

module.exports = router;
