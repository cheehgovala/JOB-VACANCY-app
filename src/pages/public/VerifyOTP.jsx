import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOTP() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyOTP } = useAuth();

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character if user pastes or types quickly
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Clear error
    if (error) setError('');

    // Move to next input automatically
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.some(char => isNaN(char))) return;

    const newOtp = [...otp];
    pastedData.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    setOtp(newOtp);
    
    // Focus last filled input or next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOTP(email, otpCode);
    
    if (result.success) {
      navigate('/subscription');
    } else {
      setError(result.message);
      setIsSubmitting(false);
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
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary-100 rounded-full">
            <KeyRound className="h-8 w-8 text-primary-600" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 px-4">
          We sent a verification code to <span className="font-semibold text-gray-900">{email}</span>
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <div className="glass px-4 py-8 sm:px-10 rounded-2xl shadow-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-4">
                Enter 6-digit verification code
              </label>
              <div className="flex justify-between gap-2 sm:gap-4" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border ${
                      error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                    } bg-white/50 focus:border-primary-500 focus:outline-none focus:ring-2`}
                  />
                ))}
              </div>
              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-red-600 text-center">
                  {error}
                </motion.p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otp.join('').length !== 6}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all ${
                  isSubmitting || otp.join('').length !== 6 
                    ? 'bg-primary-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700 active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? 'Verifying...' : 'Verify Account'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            Didn't receive the code?{' '}
            <button className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
              Resend code
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
