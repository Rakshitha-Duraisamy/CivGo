const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

const { analyzeComplaintText } = require('../utils/aiHelper');
const User = require('../models/User');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, locationCoords } = req.body;
    let imageUrl = '';

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // AI Detection
    const { category, priority } = analyzeComplaintText(title + ' ' + description);

    let locationObj = undefined;
    if (locationCoords) {
      try {
        const parsedCoords = JSON.parse(locationCoords);
        if (Array.isArray(parsedCoords) && parsedCoords.length === 2) {
          locationObj = {
            type: 'Point',
            coordinates: parsedCoords
          };
        }
      } catch (e) {
        console.error("Error parsing coords:", e);
      }
    }

    // Duplicate detection
    if (locationObj) {
      const existing = await Complaint.findOne({
        category,
        status: { $in: ['Pending', 'In Progress'] },
        location: {
          $near: {
            $geometry: locationObj,
            $maxDistance: 100 // 100 meters
          }
        }
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A similar complaint already exists nearby.',
          duplicateId: existing.trackingId
        });
      }
    }

    // Workload balancing
    const staffs = await User.find({ role: 'staff' });
    let assignedStaff = null;
    if (staffs.length > 0) {
      let minCount = Infinity;
      for (const staff of staffs) {
        const count = await Complaint.countDocuments({ assignedTo: staff._id, status: { $in: ['Pending', 'In Progress'] } });
        if (count < minCount) {
          minCount = count;
          assignedStaff = staff._id;
        }
      }
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      location: locationObj,
      imageUrl,
      user: req.user.id,
      assignedTo: assignedStaff
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message, error: error.toString() });
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

// @desc    Upvote complaint
// @route   POST /api/complaints/:id/upvote
// @access  Private
exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });

    complaint.upvotes = complaint.upvotes || [];
    if (complaint.upvotes.includes(req.user.id)) return res.status(400).json({ success: false, message: 'Already upvoted' });

    complaint.upvotes.push(req.user.id);
    await complaint.save();
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
