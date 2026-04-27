import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                Talent<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">Mw</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
