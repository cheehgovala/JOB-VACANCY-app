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
