import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const { deleteJob } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs/employer');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(jobId);
    const result = await deleteJob(jobId);
    if (result.success) {
      setJobs(jobs.filter(job => job._id !== jobId));
    } else {
      alert(result.message);
    }
    setIsDeleting(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Job Listings</h1>
          <p className="text-gray-500 mt-1">Manage and view the active jobs you've posted.</p>
        </div>
        <Link to="/employer/post-job" className="bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
          <Plus className="w-5 h-5" /> Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="text-center p-12 text-gray-500">Loading jobs...</div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <motion.div 
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1"></div>
                {new Date() > new Date(job.applicationDeadline) ? (
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full">Expired</span>
                ) : (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Active</span>
                )}
              </div>
              
              <h2 className="text-lg font-bold text-gray-900 mb-2">{job.title}</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400" /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <DollarSign className="w-4 h-4 text-gray-400" /> {job.salary}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" /> Posted on {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link to={`/employer/pipeline?jobId=${job._id}`} className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-xl text-sm font-bold transition-colors">
                  Pipeline
                </Link>
                <Link to={`/employer/edit-job/${job._id}`} className="px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(job._id)}
                  disabled={isDeleting === job._id}
                  className="px-3 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-dashed border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Jobs Posted Yet</h2>
          <p className="text-gray-500 mb-6">You haven't posted any jobs. Create your first listing to start recruiting.</p>
          <Link to="/employer/post-job" className="inline-flex bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">
            Create First Job
          </Link>
        </div>
      )}
    </div>
  );
}
