import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle, Clock, FileText, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

export default function AssessmentsList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/my-applications');
        setApplications(data);
      } catch (error) {
        console.error('Failed to fetch assessments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const pendingAssessments = applications.filter(app => app.status === 'Pending Assessment');
  const completedAssessments = applications.filter(app => app.assessmentSessionId?.isCompleted);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Assessments</h1>
        <p className="text-gray-500 mt-1">Manage and complete your pre-employment exams.</p>
      </div>

      {loading ? (
        <div className="text-center p-12 text-gray-500">Loading your assessments...</div>
      ) : applications.length === 0 ? (
        <div className="text-center p-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">You do not have any assessments assigned yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingAssessments.map((app, index) => (
            <motion.div 
              key={app._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border-2 border-primary-200 shadow-lg relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100 rounded-full mix-blend-multiply opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl inline-flex">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-red-100">
                    Action Required
                  </span>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-1">{app.jobId?.title} Assessment</h2>
                <p className="text-sm text-gray-500 mb-4">Required by {app.jobId?.employerId?.employerProfile?.companyName || 'Unknown Company'}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-gray-400" /> 20 Mins</span>
                  <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-gray-400" /> Proctored</span>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <Link to={`/seeker/exam/${app._id}`} className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20">
                  Start Exam <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}

          {completedAssessments.map((app, index) => {
            const passed = app.assessmentSessionId.score >= 70; // Hardcoded fallback passing score for display
            return (
              <motion.div 
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col ${!passed ? 'opacity-75' : ''}`}
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-xl inline-flex">
                      {passed ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border ${passed ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {passed ? 'Completed' : 'Did Not Pass'}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{app.jobId?.title} Assessment</h2>
                  <p className="text-sm text-gray-500 mb-4">{app.jobId?.employerId?.employerProfile?.companyName || 'Unknown Company'}</p>
                  
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
                    <span className="text-gray-500">Score Achieved</span>
                    <span className={`font-bold text-lg ${passed ? 'text-green-600' : 'text-red-600'}`}>{app.assessmentSessionId.score}%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>    
      )}
    </div>
  );
}
