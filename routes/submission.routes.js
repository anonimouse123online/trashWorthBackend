const express = require('express');
const router = express.Router();
const { getAll, getById, getByHousehold, create, update } = require('../controllers/submission.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.use(authMiddleware);

// GET /api/submissions
router.get('/', roleMiddleware('admin', 'staff'), getAll);

// GET /api/submissions/household/:householdId
router.get('/household/:householdId', getByHousehold);

// GET /api/submissions/:id
router.get('/:id', getById);

// POST /api/submissions  — staff records waste submission
router.post('/', roleMiddleware('admin', 'staff'), create);

// PUT /api/submissions/:id
router.put('/:id', roleMiddleware('admin', 'staff'), update);

module.exports = router;
