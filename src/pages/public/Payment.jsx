import { motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios.js';

const PAYMENT_METHODS = [
  { id: 'tnm_mpamba', name: 'TNM Mpamba / PayChangu', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50' }
];

const PLAN_DETAILS = {
  'employer_premium': { price: 'MWK 50,000', name: 'Employer Premium (Monthly)' },
  'seeker_basic': { price: 'MWK 2,500', name: 'Seeker Basic (3 Days)' },
  'seeker_premium': { price: 'MWK 10,000', name: 'Seeker Premium (Monthly)' }
};

export default function Payment() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'seeker_basic';
  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS['seeker_basic'];
  
  const [method, setMethod] = useState(PAYMENT_METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const response = await api.post('/payments/init', { planId });
      if (response.data.success && response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert(response.data.message || 'Failed to initialize payment');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert(error.response?.data?.message || 'An error occurred while initializing payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 w-full">
        <div className="mb-6 flex items-center">
          <Link to="/subscription" className="text-gray-500 hover:text-gray-900 transition-colors mr-2">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Payment Method
          </h2>
        </div>

        <div className="glass px-4 py-8 sm:px-10 rounded-2xl">
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Selected Plan</p>
              <p className="font-semibold text-gray-900">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Amount to pay</p>
              <p className="text-xl font-bold text-primary-600">{plan.price}</p>
            </div>
          </div>

          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Select Provider</label>
              {PAYMENT_METHODS.map((m) => (
                <label 
                  key={m.id} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                    method === m.id ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => setMethod(m.id)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${m.bg} mr-4`}>
                    <m.icon className={`h-6 w-6 ${m.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{m.name}</p>
                  </div>
                  {method === m.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle className="text-primary-600 h-6 w-6" />
                    </motion.div>
                  )}
                </label>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800">
              <p>You will be securely redirected to PayChangu to complete your TNM Mpamba payment.</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all active:scale-[0.98] ${
                isProcessing ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                `Pay ${plan.price}`
              )}
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payments powered by PayChangu
            </p>

            {/* Developer Bypass */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(`/payment-success?plan=${planId}`)}
                className="w-full flex justify-center py-3 px-4 border border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]"
              >
                Simulate Success (Dev Mode)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
