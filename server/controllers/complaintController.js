const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      location,
      imageUrl,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints/my
// @access  Private
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      complaints,
      count: complaints.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Make sure user owns complaint or is admin
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Rate service
// @route   POST /api/complaints/:id/rate
// @access  Private
exports.rateService = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ success: false, message: 'Can only rate resolved complaints' });
    }

    complaint.rating = rating;
    complaint.feedback = feedback;
    await complaint.save();

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
