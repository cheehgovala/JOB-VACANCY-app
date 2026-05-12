import { motion } from 'framer-motion';
import { XCircle, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function PaymentFailed() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/subscription');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleRetry = () => {
    navigate('/subscription');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full"
      >
        <div className="glass px-4 py-8 sm:px-10 rounded-3xl text-center border-t-4 border-red-500">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6"
          >
            <XCircle className="h-10 w-10 text-red-600" />
          </motion.div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-500 mb-6">
            Unfortunately, we could not process your payment at this time. Please try again or use a different payment method.
          </p>

          <p className="text-sm text-gray-500 font-medium mb-8 animate-pulse">
            Redirecting you automatically...
          </p>

          <button
            onClick={handleRetry}
            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all active:scale-[0.98]"
          >
            <RefreshCcw className="h-5 w-5 mr-2" />
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
