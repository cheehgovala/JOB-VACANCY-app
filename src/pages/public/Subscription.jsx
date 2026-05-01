import { motion } from 'framer-motion';
import { Check, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate(`/payment?plan=${plan}`);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const isEmployer = user.role === 'employer';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl relative z-10 text-center">
        <Shield className="mx-auto h-12 w-12 text-primary-600 mb-4" />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Unlock core features and get full access to the TalentMw platform.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {isEmployer ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-1 md:col-start-1 md:col-span-2 max-w-md mx-auto w-full glass p-8 rounded-3xl border-2 border-primary-500 relative"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">RECOMMENDED</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Employer Premium</h3>
              <p className="text-gray-500 text-sm mb-6">Full access for hiring talent</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">MWK 50,000</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 text-left">
                {[
                  'Unlimited Job Postings',
                  'Access to 10k+ verified CVs',
                  'AI Candidate Matching',
                  'Assessment Builder Tool',
                  'Dedicated Support'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan('employer_premium')}
                className="w-full py-4 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all active:scale-[0.98]"
              >
                Proceed to Payment
              </button>
            </motion.div>
          ) : (
             <>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 rounded-3xl border border-gray-200 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Seeker Basic</h3>
                <p className="text-gray-500 text-sm mb-6">Short-term access for active job hunters</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">MWK 2,500</span>
                  <span className="text-gray-500">/3 days</span>
                </div>
                <ul className="space-y-4 mb-8 text-left flex-1">
                  {[
                    'Apply to unlimited jobs',
                    'Basic CV Builder',
                    'Application Tracking'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan('seeker_basic')}
                  className="w-full py-4 px-6 border border-primary-600 rounded-xl shadow-sm text-sm font-bold text-primary-600 bg-transparent hover:bg-primary-50 transition-all active:scale-[0.98]"
                >
                  Select Basic
                </button>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-8 rounded-3xl border-2 border-primary-500 relative flex flex-col"
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">BEST VALUE</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Seeker Premium</h3>
                <p className="text-gray-500 text-sm mb-6">Long-term access with advanced tools</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">MWK 10,000</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 text-left flex-1">
                  {[
                    'Apply to unlimited jobs',
                    'Premium CV Builder Templates',
                    'Application Tracking',
                    'Skill Assessments & Badges',
                    'Priority Profile Listing'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan('seeker_premium')}
                  className="w-full py-4 px-6 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-all active:scale-[0.98]"
                >
                  Select Premium
                </button>
              </motion.div>
             </>
          )}
        </div>
        
        <div className="mt-8">
           <button onClick={() => {
              const { logout } = useAuth();
              logout();
           }} className="text-sm text-gray-500 hover:text-gray-700">
             Sign out instead
           </button>
        </div>
      </div>
    </div>
  );
}
