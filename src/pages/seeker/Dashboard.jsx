import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeekerDashboard() {
  const cvCompleted = localStorage.getItem('cvCompleted') === 'true';

  if (!cvCompleted) {
    return null;
  }

  const stats = [
    { name: 'Active Applications', value: '4', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Profile Views', value: '12', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Pending Assessments', value: '1', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Profile Completeness', value: '85%', icon: CheckCircle, color: 'text-primary-600', bg: 'bg-primary-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John! 👋</h1>
          <p className="text-gray-500 mt-1">Here is what is happening with your job search today.</p>
        </div>
        <Link to="/seeker/jobs" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm">
          Browse Jobs
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
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10 max-w-xl">
            <h2 className="text-2xl font-bold mb-2">Action Required</h2>
            <p className="text-primary-100 text-base mb-6 md:mb-0">You have a pending pre-employment assessment for "Backend Engineer" at National Bank.</p>
          </div>
          <Link to="/seeker/exam/1" className="block text-center w-full md:w-auto px-8 bg-white text-primary-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors relative z-10 shrink-0">
            Take Assessment Now
          </Link>
        </div>
      </div>
    </div>
  );
}
