import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building2, CheckCircle, ChevronRight, Filter, MapPin, Search, Star, X } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { MALAWI_DISTRICTS } from '../../utils/constants.js';

export default function JobSearch() {
  const { user, saveJob, applyToJob } = useAuth();
  const rawSkills = user?.seekerProfile?.skills;
  const seekerSkills = useMemo(() => {
    if (Array.isArray(rawSkills)) return rawSkills.map(s => s.toLowerCase());
    if (typeof rawSkills === 'string') return rawSkills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    return [];
  }, [rawSkills]);
  const savedJobIds = (user?.savedJobs || []).map(j => typeof j === 'string' ? j : (j._id || j.id));
  const appliedJobIds = user?.appliedJobs || [];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);

  const [filters, setFilters] = useState({
    location: [],
    type: [],
    experience: [],
    industry: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [apiJobs, setApiJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        const mappedJobs = (data || []).map(j => ({
          ...j,
          id: j._id || j.id,
          type: j.jobType || j.type || 'Full-time',
          experience: j.experienceLevel || j.experience || 'Entry Level',
          industry: j.category || j.industry || 'Technology',
          skills: j.skills || j.requirements || [],
          match: j.match || 0,
        }));
        setApiJobs(mappedJobs);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      }
    };
    fetchJobs();
  }, []);



  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const handleSaveBtn = async () => {
    if (selectedJob) {
      await saveJob(selectedJob.id);
      alert('Job saved successfully!');
    }
  };

  const handleApplyBtn = async () => {
    if (selectedJob) {
      const res = await applyToJob(selectedJob);
      if (!res.success) {
        alert(res.message);
      } else {
        alert('Application submitted successfully! It is now visible to the employer.');
        navigate('/seeker/applications');
      }
    }
  };

  const allJobs = useMemo(() => {
    return apiJobs.map(job => {
      let score = 0;
      const jobSkills = job.skills || [];
      if (jobSkills.length > 0 && seekerSkills.length > 0) {
        const matched = jobSkills.filter(req => seekerSkills.some(sk => sk.includes(req.toLowerCase()) || req.toLowerCase().includes(sk)));
        score += (matched.length / jobSkills.length) * 60;
      } else {
        score += 30; // Base score if no specific skills required
      }

      const userExpCount = user?.seekerProfile?.experience?.length || 0;
      const expLevel = job.experience || '0-1 Year';
      if (expLevel.includes('5+') && userExpCount >= 5) score += 40;
      else if (expLevel.includes('3-4') && userExpCount >= 3) score += 40;
      else if (expLevel.includes('2') && userExpCount >= 2) score += 40;
      else if (expLevel.includes('0-1') || expLevel === 'Entry Level') score += 40;
      else score += 20;

      return { ...job, match: Math.min(100, Math.round(score)) };
    });
  }, [apiJobs, seekerSkills, user]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter(job => {
      // Free text search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = job.title?.toLowerCase().includes(query) || false;
        const companyMatch = job.company?.toLowerCase().includes(query) || false;
        if (!titleMatch && !companyMatch) return false;
      }
      if (searchLocation && !job.location?.toLowerCase().includes(searchLocation.toLowerCase())) return false;

      // Sidebar filters
      if (filters.location.length > 0 && !filters.location.some(f => f.toLowerCase() === job.location?.toLowerCase())) return false;
      if (filters.type.length > 0 && !filters.type.some(f => f.toLowerCase() === job.type?.toLowerCase())) return false;
      if (filters.experience.length > 0 && !filters.experience.some(f => f.toLowerCase() === job.experience?.toLowerCase())) return false;
      if (filters.industry.length > 0 && !filters.industry.some(f => f.toLowerCase() === job.industry?.toLowerCase())) return false;

      // Removed the 10-day old filter. We now rely on backend TTL and application deadline.

      // Tabs Logic
      if (activeTab === 'recommended') {
        return job.match >= 70;
      }
      if (activeTab === 'saved') {
        return savedJobIds.includes(job.id);
      }

      return true;
    });
  }, [allJobs, filters, activeTab, searchQuery, searchLocation, seekerSkills, savedJobIds]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary-600" /> Filters
          </h2>

          <div className="space-y-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Job Type</h3>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={filters.type.includes(type)} onChange={() => handleFilterChange('type', type)} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Experience Level</h3>
              <div className="space-y-2">
                {['0-1 Year', '2 Years', '3-4 Years', '5+ Years'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={filters.experience.includes(level)} onChange={() => handleFilterChange('experience', level)} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Industry</h3>
              <div className="space-y-2">
                {['Technology', 'Design', 'Finance', 'Telecommunications', 'Other'].map((ind) => (
                  <label key={ind} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={filters.industry.includes(ind)} onChange={() => handleFilterChange('industry', ind)} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                    <span className="text-sm text-gray-600 group-hover:text-primary-600 transition-colors">{ind}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-2 sm:p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Job title, keywords, or company"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all outline-none"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="">All Districts</option>
                <option value="Remote">Remote</option>
                {MALAWI_DISTRICTS.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 pb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'all' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'recommended' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Smart Matches
            <span className="ml-2 bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs">New</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${activeTab === 'saved' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Saved Jobs
          </button>
        </div>

        {/* Job Listings Layout */}
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
              No jobs match your criteria. Try loosening your filters.
            </div>
          ) : (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedJob(job)}
                className={`bg-white border text-left rounded-xl p-5 hover:shadow-md cursor-pointer transition-all flex flex-col gap-3 relative ${job.isPremium ? 'border-primary-200 bg-blue-50/10' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {activeTab === 'recommended' && <div className="absolute top-0 left-0 w-1 h-full bg-green-500 rounded-l-xl"></div>}

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 hover:underline">{job.title}</h3>
                    <p className="text-gray-800 text-sm mt-1 font-medium">{job.institution || job.company || 'Unknown Company'}</p>
                    <p className="text-gray-600 text-sm">{job.location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-700 mt-1">
                  <span className="bg-gray-100 px-2.5 py-1 rounded-md font-semibold">{job.type}</span>
                </div>

                <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {job.rolePurpose || job.description || 'Click to view details for this role.'}
                </div>

                <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span>{job.posted}</span>
                    {job.hasAssessment && (
                      <>
                        <span>•</span>
                        <span className="text-primary-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Assessment Required
                        </span>
                      </>
                    )}
                    {activeTab === 'recommended' && job.match && (
                      <>
                        <span>•</span>
                        <span className="text-green-700 font-bold">
                          {job.match}% Match
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )))}
        </div>
      </div>

      {/* Job Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className={`p-6 border-b ${selectedJob.isPremium ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100'} flex justify-between items-start relative`}>
                {selectedJob.isPremium && <div className="absolute top-0 right-6 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-b-lg flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-900" /> FEATURED</div>}
                <div className="flex gap-4 items-center mt-4 sm:mt-0">
                  <div className={`w-16 h-16 rounded-xl border flex items-center justify-center bg-white shadow-sm flex-shrink-0 ${selectedJob.isPremium ? 'border-yellow-200' : 'border-gray-100'}`}>
                    {selectedJob.isPremium ? <Building2 className="w-8 h-8 text-yellow-600" /> : <Briefcase className="w-8 h-8 text-primary-600" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight pr-8">{selectedJob.title}</h2>
                    <p className="text-primary-600 font-medium">{selectedJob.institution || selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto hidden-scrollbar flex-1">
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium"><Briefcase className="w-4 h-4" /> {selectedJob.type}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">{selectedJob.experience}</span>
                  <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">{selectedJob.industry}</span>
                </div>

                {selectedJob.rolePurpose && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Role Purpose</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.rolePurpose}</p>
                  </div>
                )}

                {selectedJob.keyResponsibilities && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Key Responsibilities</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.keyResponsibilities}</p>
                  </div>
                )}

                {selectedJob.qualifications && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Required Qualifications and Experience</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.qualifications}</p>
                  </div>
                )}

                {selectedJob.termsAndConditions && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Terms and Conditions of Service</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.termsAndConditions}</p>
                  </div>
                )}

                {/* Fallback for old jobs */}
                {!selectedJob.rolePurpose && selectedJob.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Job Description</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.skills || []).map((skill, idx) => (
                      <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-medium border border-primary-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                <button
                  onClick={handleSaveBtn}
                  disabled={savedJobIds.includes(selectedJob.id)}
                  className={`flex-1 font-bold py-3 px-6 rounded-xl shadow-sm transition-colors border ${savedJobIds.includes(selectedJob.id) ? 'bg-green-50 text-green-700 border-green-200 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                >
                  {savedJobIds.includes(selectedJob.id) ? 'Saved' : 'Save for Later'}
                </button>
                <button
                  onClick={handleApplyBtn}
                  disabled={appliedJobIds.includes(selectedJob.id) || (selectedJob.applicationDeadline && new Date() > new Date(selectedJob.applicationDeadline))}
                  className={`flex-1 font-bold py-3 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${appliedJobIds.includes(selectedJob.id) || (selectedJob.applicationDeadline && new Date() > new Date(selectedJob.applicationDeadline)) ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                >
                  {(selectedJob.applicationDeadline && new Date() > new Date(selectedJob.applicationDeadline)) ? "You can't apply, due is over" : appliedJobIds.includes(selectedJob.id) ? 'Applied' : 'Apply Now'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
