const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  note: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const complaintSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  imageUrl: {
    type: String
  },
  location: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  timeline: [timelineSchema]
}, { timestamps: true });

// Pre-save hook to generate trackingId
complaintSchema.pre('save', function() {
  if (!this.trackingId) {
    const year = new Date().getFullYear();
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.trackingId = `CMP-${year}-${randomChars}`;
  }
  
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({ status: 'Pending', note: 'Complaint submitted' });
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
