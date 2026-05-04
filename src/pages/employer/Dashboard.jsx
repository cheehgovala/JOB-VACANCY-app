import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, CheckCircle, Clock, Plus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [statsData, setStatsData] = useState({
    activeJobs: 0,
    totalApps: 0,
    shortlisted: 0,
    pending: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appRes, jobsRes] = await Promise.all([
          api.get('/applications/employer-all'),
          api.get('/jobs/employer')
        ]);
        const apps = appRes.data;
        const activeJobsCount = jobsRes.data.length;
        
        setApplications(apps);
        
        // Calculate basic stats
        const totalApps = apps.length;
        const shortlisted = apps.filter(a => a.status === 'Shortlisted').length;
        const pending = apps.filter(a => a.status === 'Pending').length;
        
        setStatsData(prev => ({
          ...prev,
          activeJobs: activeJobsCount,
          totalApps,
          shortlisted,
          pending
        }));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchDashboardData();
  }, []);
  const stats = [
    { name: 'Active Jobs', value: statsData.activeJobs.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Applications', value: statsData.totalApps.toString(), icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Shortlisted Candidates', value: statsData.shortlisted.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Assessments', value: statsData.pending.toString(), icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Overview 📊</h1>
          <p className="text-gray-500 mt-1">Here's what's happening in your recruitment pipeline.</p>
        </div>
        <Link to="/employer/post-job" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2">
          <Plus className="w-5 h-5" /> Post New Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-24 h-24" />
            </div>
            
            <div className="flex flex-col relative z-10">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex justify-center items-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Job Listings / Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
              <Link to="/employer/pipeline" className="text-sm font-bold text-primary-600 hover:text-primary-700">View Pipeline</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-500 uppercase font-semibold border-b border-gray-100">
                  <tr>
                    <th className="pb-3 pr-4">Applicant & Role</th>
                    <th className="pb-3 px-4 text-center">Completeness</th>
                    <th className="pb-3 px-4 text-center">Date</th>
                    <th className="pb-3 pl-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications && applications.length > 0 ? applications.map((app, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-gray-900">{app.applicantId?.name || app.applicantName || 'Applicant'}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5"/> Applied for: {app.jobId?.title || app.jobTitle}</p>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                          {app.applicantId?.seekerProfile?.completeness || app.applicantProfile?.completeness || 0}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-sm font-medium text-gray-600">
                        {new Date(app.appliedAt || app.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 pl-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">No applications received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="relative z-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <BarChart2 className="w-8 h-8 text-primary-400" />
                <h2 className="text-lg font-bold">Analytics Insight</h2>
              </div>
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">Your jobs with attached <span className="text-primary-400 font-bold">pre-employment exams</span> receive 40% higher quality candidates. Consider adding an examination to your open "Frontend Developer" role.</p>
              <Link to="/employer/assessments" className="block text-center w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded-xl transition-colors">
                Create Assessment
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" /> Recent Top Matches
            </h2>
            <div className="space-y-4">
              {applications.length > 0 ? (
                [...applications]
                  .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
                  .slice(0, 3)
                  .map((app, i) => {
                    const name = app.applicantId?.name || app.applicantName || 'Candidate';
                    const role = app.jobId?.title || app.jobTitle || 'Applicant';
                    const score = app.matchScore || 0;
                    
                    return (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-sm">
                            {name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">{name}</h3>
                            <p className="text-xs text-gray-500">{role}</p>
                          </div>
                        </div>
                        <span className="font-bold text-green-600 text-sm">{score}% Match</span>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center p-4 text-sm text-gray-500">No matches available yet.</div>
              )}
            </div>
            <Link to="/employer/pipeline" className="block text-center w-full mt-4 py-2 border border-gray-200 text-sm font-bold rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
              Review Pipeline
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
