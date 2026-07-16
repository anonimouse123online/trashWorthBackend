const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove, regenerateQr } = require('../controllers/household.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// GET /api/households
router.get('/', roleMiddleware('admin', 'staff'), getAll);

// GET /api/households/:id
router.get('/:id', getById);

// POST /api/households
router.post('/', roleMiddleware('admin', 'staff'), create);

// PUT /api/households/:id
router.put('/:id', roleMiddleware('admin', 'staff'), update);

// DELETE /api/households/:id
router.delete('/:id', roleMiddleware('admin'), remove);

// GET /api/households/:id/qr  — regenerate QR token
router.get('/:id/qr', roleMiddleware('admin', 'staff'), regenerateQr);

module.exports = router;
