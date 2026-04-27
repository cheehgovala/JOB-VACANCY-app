import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, FileText, CheckCircle, Clock, Search, Bell, Menu, X, Star, Calendar } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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

  const notifications = [
    {
      id: 1,
      title: 'Hired!',
      message: 'Congratulations! Tech Hub Lilongwe has selected you for the position of Frontend Developer. They will contact you shortly.',
      time: '2 hours ago',