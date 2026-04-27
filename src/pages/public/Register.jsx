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
                   <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border" placeholder="Acme Corp Malawi" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${errors.name ? 'border-red-500' : ''}`} placeholder="John Doe" />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${errors.email ? 'border-red-500' : ''}`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number (Airtel/TNM)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${errors.phone ? 'border-red-500' : ''}`} placeholder="+265 88X XXX XXX" />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${errors.password ? 'border-red-500' : ''}`} placeholder="••••••••" />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              By registering, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>. OTP verification will be required on the next step.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}     