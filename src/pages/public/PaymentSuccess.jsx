import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PLAN_DAYS = {
  'employer_premium': 30,
  'seeker_basic': 3,
  'seeker_premium': 30
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'seeker_basic';
  const { user, updateSubscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only update if not already updated (basic mock logic)
    if (user && !user.hasActiveSubscription) {
      updateSubscription(planId, PLAN_DAYS[planId]);
    }

    const timer = setTimeout(() => {
      if (user?.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/seeker/cv-builder');
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [user, planId, updateSubscription, navigate]);

  const handleReturn = () => {
    if (user?.role === 'employer') {
      navigate('/employer/dashboard');
    } else {
      navigate('/seeker/cv-builder');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full"
      >
        <div className="glass px-4 py-8 sm:px-10 rounded-3xl text-center border-t-4 border-green-500">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mt-2">Welcome to Smart Hire Malawi Premium.</p>
          <p className="text-gray-500 mb-8">
            Your subscription is now active. You have full access to Smart Hire Malawi features.
          </p>

          <div className="bg-yellow-50 rounded-xl p-4 flex items-start text-left border border-yellow-200 mb-8">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-yellow-800">Automatic Renewal Enabled</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Your subscription will automatically renew at the end of the billing period to ensure uninterrupted access. 
                You will receive a reminder 24 hours before your card/mobile wallet is charged.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 font-medium mb-4 animate-pulse">
            Redirecting to your dashboard automatically...
          </p>

          <button
            onClick={handleReturn}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all active:scale-[0.98]"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
