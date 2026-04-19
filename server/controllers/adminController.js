const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const highPriority = await Complaint.countDocuments({ priority: { $in: ['High', 'Critical'] } });

    // Aggregate category data
    const categoryAgg = await Complaint.aggregate([
      { $group: { _id: '$category', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);
    const categoryData = categoryAgg.length ? categoryAgg : [
      { name: 'Roads & Infrastructure', value: 1 },
      { name: 'Electricity', value: 1 } // some fallback if empty
    ];

    // Simulate monthly trend (in a real app, group by month, here just dummy real structure)
    // To do it properly:
    const monthlyTrend = [
      { name: 'Jan', received: 0, resolved: 0 },
      { name: 'Feb', received: 0, resolved: 0 },
      { name: 'Mar', received: 0, resolved: 0 },
      { name: 'Apr', received: totalComplaints, resolved: resolved },
      { name: 'May', received: 0, resolved: 0 },
      { name: 'Jun', received: 0, resolved: 0 }
    ];

    res.status(200).json({
      success: true,
      stats: {
        total: totalComplaints,
        pending,
        resolved,
        highPriority
      },
      categoryData,
      monthlyTrend
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'name email').sort('-createdAt');
    res.status(200).json({
      success: true,
      complaints,
      count: complaints.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    if (note) {
      complaint.timeline.push({ status, note });
    }
    
    await complaint.save();

    // Trigger notification
    const notification = await Notification.create({
      user: complaint.user,
      title: 'Complaint Status Updated',
      message: `Your complaint ${complaint.trackingId} status has been updated to ${status}.`,
      type: 'info',
      link: `/complaint/${complaint._id}`
    });

    const io = req.app.get('io');
    if (io) {
      io.to(complaint.user.toString()).emit('notification', notification);
      io.to(complaint.user.toString()).emit('complaint_updated', complaint);
    }

    res.status(200).json({
      success: true,
      complaint
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
