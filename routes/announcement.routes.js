const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/announcement.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

// GET — any authenticated user
router.get('/', authMiddleware, getAll);
router.get('/:id', authMiddleware, getById);

// Write — admin/staff only
router.post('/', authMiddleware, roleMiddleware('admin', 'staff'), create);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'staff'), update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), remove);

module.exports = router;
