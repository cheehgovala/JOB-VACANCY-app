import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, FileText, CheckCircle, ShieldCheck, Users, MapPin, Briefcase, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

// Simple in-memory cache so we don't re-fetch on every visit
let jobsCache = null;
let jobsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestJobs, setLatestJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Fetch real latest jobs from backend
  useEffect(() => {
    const fetchLatestJobs = async () => {
      // Use cache if fresh
      if (jobsCache && Date.now() - jobsCacheTime < CACHE_TTL) {
        setLatestJobs(jobsCache);
        setJobsLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/jobs');
        const sorted = (data || [])
          .filter(j => !j.applicationDeadline || new Date() <= new Date(j.applicationDeadline))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        jobsCache = sorted;
        jobsCacheTime = Date.now();
        setLatestJobs(sorted);
      } catch (e) {
        console.error('Failed to fetch latest jobs', e);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchLatestJobs();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (latestJobs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % latestJobs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [latestJobs]);

  const formatPosted = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 14) return '1 week ago';
    return `${Math.floor(days / 7)} weeks ago`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-primary-50 to-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
          initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6"
          >
            The Smarter Way to <br className="hidden md:block" />
            <span className="text-primary-600">Hire and Get Hired</span> in Malawi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            A premium recruitment marketplace connecting serious employers with verified talent. Smart matching, digital CVs, and pre-employment assessments—all in one platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link to="/register?role=seeker" className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
              Find a Job <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/register?role=employer" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-full font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
              Post a Vacancy <Users className="w-5 h-5 text-gray-500" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Platform Features</h2>
            <p className="mt-4 text-lg text-gray-500">Built specifically to solve Malawi's recruitment challenges.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Online Assessments</h3>
              <p className="text-gray-600">Employers can build and attach timed exams to job listings. Filter your shortlist by immediate test results.</p>
            </div>

            <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-secondary-100 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Candidate Matching</h3>
              <p className="text-gray-600">Our algorithm scores applicants by skill compatibility, reducing manual CV screening time by over 80%.</p>
            </div>

            <div className="glass p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Digital CV Builder</h3>
              <p className="text-gray-600">Job seekers use step-by-step guidance to automatically generate ATS-friendly, professional PDF CVs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Opportunities Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Opportunities</h2>
            <p className="mt-4 text-lg text-gray-500">The most recently posted roles available on our platform.</p>
          </div>

          {jobsLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : latestJobs.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No open positions at the moment.</p>
              <p className="text-sm mt-1">Check back soon — new jobs are posted regularly.</p>
            </div>
          ) : (
            <>
              <div className="relative h-[480px] sm:h-[420px] w-full max-w-2xl mx-auto" style={{ perspective: '1200px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ transformOrigin: "center center" }}
                    className="absolute inset-0 bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{latestJobs[currentIndex].title}</h3>
                          <p className="text-primary-600 font-semibold">{latestJobs[currentIndex].institution || latestJobs[currentIndex].company}</p>
                        </div>
                        <span className="px-4 py-1.5 bg-primary-50 text-primary-700 text-sm font-bold rounded-full flex-shrink-0">
                          {latestJobs[currentIndex].jobType || latestJobs[currentIndex].type || 'Full-time'}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-8 text-base leading-relaxed line-clamp-3">
                        {latestJobs[currentIndex].rolePurpose || latestJobs[currentIndex].description || 'Click to view full details for this role.'}
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center text-base text-gray-500">
                          <MapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                          {latestJobs[currentIndex].location}
                        </div>
                        <div className="flex items-center text-base text-gray-500">
                          <Clock className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                          {formatPosted(latestJobs[currentIndex].createdAt)}
                        </div>
                        {latestJobs[currentIndex].experienceLevel && (
                          <div className="flex items-center text-base text-gray-500">
                            <Briefcase className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                            Years of Experience Required: {latestJobs[currentIndex].experienceLevel}
                          </div>
                        )}
                        {latestJobs[currentIndex].applicationDeadline && (
                          <div className="flex items-center text-base text-gray-500">
                            <CheckCircle className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
                            Deadline: {new Date(latestJobs[currentIndex].applicationDeadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/login"
                      className="w-full text-center px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all text-sm"
                    >
                      Login to Apply
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-2 mt-8">
                {latestJobs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary-600 w-8' : 'bg-gray-300 w-2.5'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Stop sifting through hundreds of unqualified emails.</h2>
          <p className="text-xl text-gray-400 mb-10">Join the only platform with built-in credential verification and a subscription paywall that ensures only serious candidates apply.</p>
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
            <li className="flex items-center gap-2"><CheckCircle className="text-primary-500 w-5 h-5" /> Verify Skills Online</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-primary-500 w-5 h-5" /> Track Application Status</li>
            <li className="flex items-center gap-2"><CheckCircle className="text-primary-500 w-5 h-5" /> Fast Local Payments</li>
          </ul>
          <Link to="/register?role=employer" className="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary-500/20">
            Start Recruiting Now
          </Link>
        </div>
      </section>
    </div>
  );
}
