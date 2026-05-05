import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, CheckCircle, Clock, Search, Bell, Menu, X, Star, Calendar, LogOut } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUtils';
import api from '../api/axios';

export default function SeekerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout, updateProfilePicture } = useAuth();
  const fileInputRef = useRef(null);

  const cvCompleted = localStorage.getItem('cvCompleted') === 'true';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 20);
  };

  // Force redirect to CV Builder if not completed
  useEffect(() => {
    if (!cvCompleted) {
      navigate('/seeker/cv-builder');
    }
  }, [cvCompleted, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const getNotificationStyle = (type) => {
    switch(type) {
      case 'success': return { icon: <CheckCircle className="w-4 h-4 text-green-600" />, bg: 'bg-green-100' };
      case 'error': return { icon: <X className="w-4 h-4 text-red-600" />, bg: 'bg-red-100' };
      case 'warning': return { icon: <Star className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-100' };
      default: return { icon: <Bell className="w-4 h-4 text-blue-600" />, bg: 'bg-blue-100' };
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Talent<span className="text-primary-600">Mw</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {(!cvCompleted) ? (
            <div className="p-6 text-center bg-primary-50 rounded-xl border border-primary-100 mt-4">
              <FileText className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <p className="text-sm text-primary-800 font-medium">Please complete your CV profile to unlock all features.</p>
            </div>
          ) : (
            <>
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
              <Link to="/seeker/dashboard" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/seeker/dashboard' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'}`}>
                <Briefcase className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="/seeker/cv-builder" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname === '/seeker/cv-builder' ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'}`}>
                <FileText className="w-5 h-5" /> Build Profile
              </Link>
              <Link to="/seeker/jobs" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/seeker/jobs') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'}`}>
                <Search className="w-5 h-5" /> Find Jobs
              </Link>
              <Link to="/seeker/applications" className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/seeker/applications') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'}`}>
                <Clock className="w-5 h-5" /> Applications
              </Link>
              <Link to="/seeker/assessments" className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors ${location.pathname.includes('/seeker/assessments') ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-700 hover:bg-primary-50'}`}>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" /> Assessments
                </div>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span>
              </Link>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">No notifications yet.</div>
                      ) : notifications.map((notif) => {
                        const style = getNotificationStyle(notif.type);
                        return (
                          <div 
                            key={notif._id} 
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                              {style.icon}
                            </div>
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                                  {notif.title}
                                </h4>
                                <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">{formatTime(notif.createdAt)}</span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {notifications.length > 0 && unreadCount > 0 && (
                      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <button onClick={markAllAsRead} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold overflow-hidden cursor-pointer relative group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {user?.profilePicture ? (
                    <img src={getImageUrl(user.profilePicture)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    (user?.seekerProfile?.personal?.fullName || user?.name || 'Seeker').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-[10px] rounded-full">
                    Upload
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.seekerProfile?.personal?.fullName || user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.hasActiveSubscription ? 'Premium Member' : 'Standard Member'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200 shadow-sm flex items-center gap-2 group"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                Sign Out
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
