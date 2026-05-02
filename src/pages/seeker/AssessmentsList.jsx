import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle, Clock, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AssessmentsList() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Assessments</h1>
        <p className="text-gray-500 mt-1">Manage and complete your pre-employment exams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Assessment */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
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
            
            <h2 className="text-lg font-bold text-gray-900 mb-1">Frontend Basics Sandbox</h2>
            <p className="text-sm text-gray-500 mb-4">Required by National Bank of Malawi</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="flex items-center gap-1.5 font-medium"><Clock className="w-4 h-4 text-gray-400" /> 20 Mins</span>
              <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-gray-400" /> Proctored</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <Link to="/seeker/exam/1" className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20">
              Start Exam <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Completed Assessment */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col"
        >
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 text-gray-400 rounded-xl inline-flex">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-green-100">
                Completed
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-1">React Capability Test</h2>
            <p className="text-sm text-gray-500 mb-4">Tech Hub Lilongwe</p>
            
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
              <span className="text-gray-500">Score Achieved</span>
              <span className="font-bold text-green-600 text-lg">92%</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 text-center">
            <span className="text-sm font-semibold text-gray-500">Submitted on Oct 10, 2023</span>
          </div>
        </motion.div>
        
        {/* Failed Assessment */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden flex flex-col opacity-75"
        >
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 text-gray-400 rounded-xl inline-flex">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                Did Not Pass
              </span>
            </div>
            
            <h2 className="text-lg font-bold text-gray-900 mb-1">Logic & Routing</h2>
            <p className="text-sm text-gray-500 mb-4">Airtel Malawi</p>
            
            <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
              <span className="text-gray-500">Score Achieved</span>
              <span className="font-bold text-gray-500 text-lg">65%</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 text-center">
            <span className="text-sm font-semibold text-gray-500">Threshold was 70%</span>
          </div>
        </motion.div>
      </div>    
    </div>
  );
}
