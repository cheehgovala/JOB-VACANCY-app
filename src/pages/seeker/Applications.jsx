import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Briefcase, Clock, DollarSign, MapPin, Search, Star, XCircle, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function Applications() {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showRecommended, setShowRecommended] = useState(false);

  const [recommendedJobs, setRecommendedJobs] = useState([]);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/my-applications');
        const formatted = data.map(app => ({
          id: app._id,
          job: app.jobId?.title || 'Unknown Role',
          company: app.jobId?.employerId?.employerProfile?.companyName || 'Unknown Company',
          date: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: app.status,
          score: app.matchScore ? `${app.matchScore}%` : '—'
        }));
        setApplications(formatted);

        // Fetch jobs for recommendations
        const jobsRes = await api.get('/jobs');
        const appliedJobIds = new Set(data.map(app => app.jobId?._id));
        const unappliedJobs = jobsRes.data.filter(j => !appliedJobIds.has(j._id)).slice(0, 3);
        const formattedJobs = unappliedJobs.map(j => ({
          id: j._id || j.id,
          title: j.title,
          company: j.employerId?.employerProfile?.companyName || 'Unknown Company',
          location: j.location,
          salary: j.salary
        }));
        setRecommendedJobs(formattedJobs);
      } catch (error) {
        console.error('Failed to fetch applications or jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Under Review':
        return <span className="bg-gray-100 text-gray-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1 w-max"><Clock className="w-3.5 h-3.5"/> Under Review</span>;
      case 'Shortlisted':
        return <span className="bg-amber-100 text-amber-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1 w-max"><Star className="w-3.5 h-3.5"/> Shortlisted</span>;

      case 'Not Selected':
        return <span className="bg-red-100 text-red-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1 w-max"><XCircle className="w-3.5 h-3.5"/> Not Selected</span>;
      case 'Pending Assessment':
        return (
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1 w-max">
              <FileText className="w-3.5 h-3.5"/> Action Required
            </span>
            <Link to="/seeker/assessments" className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">
              Take Assessment
            </Link>
          </div>
        );
      case 'Hired':
        return <span className="bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1 w-max"><Briefcase className="w-3.5 h-3.5"/> Hired</span>;
      default:
        return null;
    }
  };

  const hasNotSelected = applications.some(app => app.status === 'Not Selected');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Tracker</h1>
          <p className="text-gray-500 mt-1">Monitor the live status of all your job applications.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            className="w-full sm:w-64 pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Job Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Applied Date</th>
                <th className="px-6 py-4 text-center">Match Score</th>
                <th className="px-6 py-4">Status</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Loading your applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    You haven't applied to any jobs yet.
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <motion.tr 
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-bold text-gray-900">{app.job}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {app.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {app.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-bold text-gray-700">{app.score}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
  
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 1 to {applications.length} of {applications.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 hover:bg-white transition-colors" disabled>Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-500 hover:bg-white transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>

      {hasNotSelected && (
        <div className="mt-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-100 shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Keep your momentum going!</h3>
                <p className="text-gray-600 max-w-2xl">Based on your recent applications, we've found 3 similar open jobs that you might be a great match for. Don't give up, your next opportunity is just around the corner.</p>
              </div>
              <button 
                onClick={() => setShowRecommended(!showRecommended)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 whitespace-nowrap"
              >
                {showRecommended ? 'Hide Recommended Jobs' : 'View Recommended Jobs'} <ArrowRight className={`w-4 h-4 transition-transform ${showRecommended ? 'rotate-90' : ''}`} />
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showRecommended && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
                  {recommendedJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight mb-1">{job.title}</h4>
                      <p className="text-sm font-medium text-gray-500 mb-4">{job.company}</p>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 text-gray-400" /> {job.salary}
                        </div>
                      </div>
                      
                      <Link to="/seeker/jobs" className="block text-center w-full py-2.5 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 text-gray-700 font-semibold rounded-xl text-sm transition-colors border border-gray-100">
                        View Details
                      </Link>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}


    </div>
  );
}
