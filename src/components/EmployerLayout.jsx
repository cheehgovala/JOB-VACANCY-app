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
        
        <nav className="p-4 space-y-2 mt-4">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recruitment</p>
          <Link to="/employer/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-white bg-gray-800 border border-gray-700 shadow-sm">
            <FileBarChart className="w-5 h-5 text-primary-400" /> Dashboard
          </Link>
          <Link to="/employer/jobs" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <Building className="w-5 h-5" /> Job Listings
          </Link>
          <Link to="/employer/pipeline" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <Users className="w-5 h-5" /> Candidate Pipeline
          </Link>
          <Link to="/employer/assessments" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
            <CheckSquare className="w-5 h-5 text-blue-400" /> Exam Builder
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-800 bg-gray-900/90">
          <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Plan</p>
            <p className="text-sm font-semibold text-white mb-1">Premium Employer</p>
            <p className="text-xs text-gray-400">12 days remaining</p>
            <button className="w-full mt-3 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold py-2 rounded-lg transition-colors">
              Renew Subscription
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            {/* Command Pallete placeholder */}
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 font-bold overflow-hidden">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    "AC"
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">Acme Corp</p>
                  <p className="text-xs text-primary-600 font-medium">Blantyre, MW</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded border border-transparent hover:border-red-200 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
