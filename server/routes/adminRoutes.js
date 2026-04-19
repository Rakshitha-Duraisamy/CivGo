const express = require('express');
const { getDashboardStats, getAllComplaints, updateComplaintStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

module.exports = router;
