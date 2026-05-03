import { Building, Users, FileBarChart, Bell, Menu, X, CheckSquare } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function EmployerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'employer' && user?.hasActiveSubscription) {
      if (!user.postedJobs || user.postedJobs.length === 0) {
        if (location.pathname !== '/employer/post-job') {
          navigate('/employer/post-job');
        }
      }
    }
  }, [user, location.pathname, navigate]);

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 20);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex justify-center items-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              Employer<span className="text-primary-500">Hub</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400 hover:text-white" />
          </button>
        </div>
        