const express = require('express');
const router = express.Router();
const { getAll, getById, create, updateStatus } = require('../controllers/rewardRequest.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// GET /api/reward-requests
router.get('/', roleMiddleware('admin', 'staff'), getAll);

// GET /api/reward-requests/:id
router.get('/:id', getById);

// POST /api/reward-requests  — residents submit, staff/admin also can
router.post('/', create);

// PATCH /api/reward-requests/:id/status  — admin/staff approve, release, reject
router.patch('/:id/status', roleMiddleware('admin', 'staff'), updateStatus);

module.exports = router;
