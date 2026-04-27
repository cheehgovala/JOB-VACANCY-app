import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Briefcase, User, Building, Mail, Lock, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPhoneError } from '../../utils/validation.js';

export default function Register() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(() => {
    const roleParam = searchParams.get('role');
    return (roleParam === 'employer' || roleParam === 'seeker') ? roleParam : 'seeker';
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() ? '' : 'Name is required',
      email: getEmailError(formData.email),
      phone: getPhoneError(formData.phone),
      password: formData.password.length >= 6 ? '' : 'Password must be at least 6 characters'
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const result = registerUser({
      ...formData,
      role
    });

    if (result.success) {
      navigate('/subscription');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 cursor-pointer">
          <Briefcase className="h-10 w-10 text-primary-600" />
          <span className="font-bold text-3xl tracking-tight text-gray-900">
            Talent<span className="text-primary-600">Mw</span>
          </span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass px-4 py-8 sm:px-10 rounded-2xl">
          {/* Role Toggle */}
          <div className="flex p-1 space-x-1 bg-gray-100 rounded-xl mb-8">
            <button
              className={`flex-1 flex justify-center items-center py-2.5 text-sm font-semibold rounded-lg transition-all ${
                role === 'seeker' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole('seeker')}
              type="button"
            >
              <User className="w-4 h-4 mr-2" /> Job Seeker
            </button>
            <button
              className={`flex-1 flex justify-center items-center py-2.5 text-sm font-semibold rounded-lg transition-all ${
                role === 'employer' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setRole('employer')}
              type="button"
            >
              <Building className="w-4 h-4 mr-2" /> Employer
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            {role === 'employer' ? (