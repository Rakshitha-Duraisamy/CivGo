import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function SubmitComplaint() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('priority', priority);
      formData.append('description', description);
      formData.append('location', location);
      if (image) {
        formData.append('image', image);
      }

      await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Complaint submitted successfully!');
      navigate('/history');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report an Issue</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Please provide accurate details to help us resolve the issue faster.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Complaint Title <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g., Deep pothole on Main Street" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
                <select required value={category} onChange={(e) => setCategory(e.target.value)} className="input-field cursor-pointer">
                  <option value="">Select Category</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Sanitation & Waste">Sanitation & Waste</option>
                  <option value="Public Nuisance">Public Nuisance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-field cursor-pointer">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="input-field resize-none" placeholder="Provide detailed information about the issue..."></textarea>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" /> Location Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Street Address <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="Full address" />
                  <button type="button" onClick={() => setLocation('123 Auto Detected Street, City')} className="btn-secondary whitespace-nowrap flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Auto Detect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-500" /> Media Attachments
            </h3>
            
            <label className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files[0])} />
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                {image ? image.name : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 10MB)</p>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[120px] flex justify-center items-center">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
