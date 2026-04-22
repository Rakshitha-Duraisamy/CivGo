/* eslint-disable */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { StatusBadge, PriorityBadge } from '../../components/Badges';
import { MapPin, Calendar, Building, User, ArrowLeft, Clock, CheckCircle, ThumbsUp } from 'lucide-react';

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  const handleUpvote = async () => {
    try {
      await api.post(`/complaints/${id}/upvote`);
      setComplaint(prev => ({
        ...prev,
        upvotes: [...(prev.upvotes || []), 'me']
      }));
      toast.success('Upvoted successfully!');
    } catch (error) {
      toast.error('Already upvoted or error occurred');
    }
  };

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const { data } = await api.get(`/complaints/${id}`);
        setComplaint(data.complaint);
        if (data.complaint.rating) {
          setRating(data.complaint.rating);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load complaint details');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleRate = async (star) => {
    if (complaint.rating || submittingRating) return;
    setSubmittingRating(true);
    try {
      await api.post(`/complaints/${id}/rate`, { rating: star, feedback: '' });
      setRating(star);
      setComplaint({ ...complaint, rating: star });
      toast.success('Thank you for your feedback!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!complaint) {
    return <div className="text-center py-12 text-gray-500">Complaint not found.</div>;
  }

  const timeline = complaint.timeline && complaint.timeline.length > 0 
    ? complaint.timeline.map((item) => ({
        status: item.status,
        date: new Date(item.date).toLocaleDateString(),
        desc: item.note || `Status updated to ${item.status}`,
        completed: true
      }))
    : [{ status: complaint.status, date: new Date(complaint.createdAt).toLocaleDateString(), desc: 'Current status', completed: true }];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/history" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Complaint Details <span className="text-sm font-mono text-gray-500 font-normal">#{(complaint.trackingId || complaint._id).slice(-6).toUpperCase()}</span>
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium border border-gray-200 dark:border-gray-700">
                {complaint.category}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{complaint.title}</h2>
              <button onClick={handleUpvote} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 flex items-center gap-2 transition-colors">
                <ThumbsUp className="w-4 h-4" /> 
                {complaint.upvotes?.length || 0} Upvotes
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              <p>{complaint.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 text-gray-400" /> Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Building className="h-4 w-4 text-gray-400" /> {complaint.category}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <User className="h-4 w-4 text-gray-400" /> Reported by You
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-gray-400" /> {complaint.location ? 'GPS Location Attached' : 'Address Attached'}
              </div>
            </div>
          </div>

          {/* Attached Images */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Evidence Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {complaint.imageUrl ? (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Before (Reported)</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 aspect-video relative group cursor-pointer">
                    <img src={`http://localhost:5000${complaint.imageUrl}`} alt="Issue Before" className="w-full h-full object-cover transition-transform duration-500" />
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No initial evidence attached.</div>
              )}
              
              {complaint.afterImage && (
                <div>
                  <p className="text-sm font-medium text-green-600 mb-2">After (Resolved)</p>
                  <div className="rounded-xl overflow-hidden border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 aspect-video relative group cursor-pointer">
                    <img src={`http://localhost:5000${complaint.afterImage}`} alt="Issue After" className="w-full h-full object-cover transition-transform duration-500" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Resolution Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${item.completed ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    {item.completed ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold text-sm ${item.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{item.status}</h4>
                      {item.completed && <span className="text-xs text-gray-500">{item.date}</span>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {complaint.status === 'Resolved' && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Rate Service</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">How satisfied are you with the resolution?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => !complaint.rating && setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={!!complaint.rating || submittingRating}
                    className={`transition-colors ${(rating || hoverRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </button>
                ))}
              </div>
              {complaint.rating && <p className="text-green-600 text-sm mt-3 font-medium">You rated this {complaint.rating} stars!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

