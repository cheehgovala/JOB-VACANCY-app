import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, CheckCircle, Clock, Plus, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EmployerDashboard() {
  const { mockApplications } = useAuth();
  const stats = [
    { name: 'Active Jobs', value: '3', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Applications', value: '142', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Shortlisted Candidates', value: '28', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Assessments', value: '12', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-100' },
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