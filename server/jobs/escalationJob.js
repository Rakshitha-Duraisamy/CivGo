const cron = require('node-cron');
const Complaint = require('../models/Complaint');

// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running daily escalation job...');
    
    // Find complaints pending for more than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const complaints = await Complaint.find({
      status: 'Pending',
      createdAt: { $lt: threeDaysAgo },
      escalationLevel: 0
    });

    for (const complaint of complaints) {
      complaint.escalationLevel += 1;
      complaint.priority = 'High'; // escalate priority
      complaint.timeline.push({ status: 'Escalated', note: 'Auto-escalated due to delay' });
      await complaint.save();
      console.log(`Escalated complaint ${complaint.trackingId}`);
    }

    console.log(`Escalation job completed. Escalated ${complaints.length} complaints.`);
  } catch (error) {
    console.error('Error in escalation job:', error);
  }
});
