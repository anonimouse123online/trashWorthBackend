const express = require('express');
const router = express.Router();
const { getAll, getByHousehold, getBalance, create } = require('../controllers/incentive.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// GET /api/incentives  — full transaction log (admin/staff)
router.get('/', roleMiddleware('admin', 'staff'), getAll);

// GET /api/incentives/household/:householdId
router.get('/household/:householdId', getByHousehold);

// GET /api/incentives/balance/:householdId
router.get('/balance/:householdId', getBalance);

// POST /api/incentives  — manual adjustments (admin only)
router.post('/', roleMiddleware('admin'), create);

module.exports = router;
