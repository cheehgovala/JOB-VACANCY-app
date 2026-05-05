import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmailError } from '../../utils/validation.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mode, setMode] = useState('login'); // 'login', 'forgot', 'reset'
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { login, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const error = getEmailError(email);
    if (error) {
      setEmailError(error);
      return;
    }
    const result = await login(email, password);
    if (result.success) {
      if (!result.user.hasActiveSubscription) {
        navigate('/subscription');
      } else if (result.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/jobs');
      }
    } else {
      alert(result.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const error = getEmailError(email);
    if (error) {
      setEmailError(error);
      return;
    }
    const result = await forgotPassword(email);
    if (result.success) {
      setMode('reset');
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
       alert("Password must be at least 6 characters.");
       return;
    }
    const result = await resetPassword(email, resetOtp, newPassword);
    if (result.success) {
      alert(result.message);
      setMode('login');
      setPassword('');
      setResetOtp('');
      setNewPassword('');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-6 cursor-pointer">
          <Briefcase className="h-10 w-10 text-primary-600" />
          <span className="font-bold text-3xl tracking-tight text-gray-900">
            Talent<span className="text-primary-600">Mw</span>
          </span>
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? 'Sign in to your account' : mode === 'forgot' ? 'Reset your password' : 'Create new password'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              Or{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                create a new account
              </Link>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="font-medium text-primary-600 hover:text-primary-500 transition-colors bg-transparent border-none cursor-pointer">
              Back to sign in
            </button>
          )}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass px-4 py-8 sm:px-10 rounded-2xl">
          {mode === 'login' && (
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${emailError ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button type="button" onClick={() => setMode('forgot')} className="font-medium text-primary-600 hover:text-primary-500 transition-colors bg-transparent border-none cursor-pointer">
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98]"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <p className="text-sm text-gray-600 text-center">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border ${emailError ? 'border-red-500' : ''}`}
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all"
                >
                  Send OTP
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <p className="text-sm text-gray-600 text-center mb-4">
                Enter the OTP sent to <span className="font-bold">{email}</span> and your new password.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  One-Time Password (OTP)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    required
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border text-center text-lg font-bold tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-xl bg-white/50 border"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 rounded-full">
                    Demo info
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-gray-500">
                Register an account or use <span className="font-semibold text-gray-700">employer</span> or <span className="font-semibold text-gray-700">seeker</span> in email for quick testing.
              </div>
        </div>
      </motion.div>
    </div>
  );
}
