exports.analyzeComplaintText = (text) => {
  const t = text.toLowerCase();
  
  let category = 'Other';
  let priority = 'Low';

  // Category heuristics
  if (t.includes('road') || t.includes('pothole') || t.includes('street')) {
    category = 'Roads';
  } else if (t.includes('water') || t.includes('pipe') || t.includes('leak') || t.includes('drain')) {
    category = 'Water';
  } else if (t.includes('electric') || t.includes('power') || t.includes('light') || t.includes('wire')) {
    category = 'Electricity';
  } else if (t.includes('garbage') || t.includes('waste') || t.includes('trash') || t.includes('sanitation')) {
    category = 'Sanitation';
  }

  // Priority heuristics
  if (t.includes('accident') || t.includes('blood') || t.includes('fire') || t.includes('emergency') || t.includes('danger')) {
    priority = 'Critical';
  } else if (t.includes('urgent') || t.includes('immediately') || t.includes('block') || t.includes('severe')) {
    priority = 'High';
  } else if (category !== 'Other') {
    priority = 'Medium';
  }

  return { category, priority };
};
