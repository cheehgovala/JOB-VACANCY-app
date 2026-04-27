import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4 col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl tracking-tight text-white">
                Talent<span className="text-primary-500">Mw</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400">
              The premier job platform connecting top talent with serious employers in Malawi.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Job Seekers</h3>
            <ul className="space-y-3">
              <li><span className="text-sm font-medium text-gray-300">Browse Jobs</span></li>
              <li><span className="text-sm font-medium text-gray-300">CV Builder</span></li>
              <li><span className="text-sm font-medium text-gray-300">Create Profile</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Employers</h3>
            <ul className="space-y-3">
              <li><span className="text-sm font-medium text-gray-300">Post a Job</span></li>
              <li><span className="text-sm font-medium text-gray-300">Pricing</span></li>
              <li><span className="text-sm font-medium text-gray-300">Recruit Now</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm font-medium hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm font-medium hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm font-medium hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} TalentMw. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
