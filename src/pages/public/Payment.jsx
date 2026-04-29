import { motion } from 'framer-motion';
import { CheckCircle, ChevronLeft, CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const PAYMENT_METHODS = [
  { id: 'airtel_money', name: 'Airtel Money', icon: Smartphone, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'tnm_mpamba', name: 'TNM Mpamba', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'nbm_bank', name: 'NBM Bank Transfer', icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50' }
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
  const [account, setAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment delay
    setTimeout(() => {
      setIsProcessing(false);
      navigate(`/payment-success?plan=${planId}`);
    }, 2000);
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
