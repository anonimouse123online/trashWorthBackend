const express = require('express');
const router = express.Router();
const { getAll, getById, update } = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// All profile routes require authentication
router.use(authMiddleware);

// GET /api/profiles          — admin or staff only
router.get('/', roleMiddleware('admin', 'staff'), getAll);

// GET /api/profiles/:id
router.get('/:id', getById);

// PUT /api/profiles/:id      — admin only
router.put('/:id', roleMiddleware('admin'), update);

module.exports = router;
