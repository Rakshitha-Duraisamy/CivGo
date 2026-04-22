const express = require('express');
const { createComplaint, getMyComplaints, getComplaintById, rateService } = require('../controllers/complaintController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), createComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/:id', protect, getComplaintById);
router.post('/:id/rate', protect, rateService);
router.post('/:id/upvote', protect, require('../controllers/complaintController').upvoteComplaint);

module.exports = router;
