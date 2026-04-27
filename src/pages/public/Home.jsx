import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, FileText, CheckCircle, ShieldCheck, Users, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const freeJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Solutions Ltd",
    location: "Lilongwe",
    type: "Full-time",
    salary: "MWK 800,000 - 1,200,000",
    posted: "2 days ago",
    description: "We are looking for an experienced Frontend Developer to build modern web applications using React and Tailwind CSS. Must have 5+ years of experience."
  },
  {
    id: 2,
    title: "Marketing Manager",
    company: "Global Innovations",
    location: "Blantyre",
    type: "Contract",
    salary: "MWK 600,000 - 900,000",
    posted: "1 week ago",
    description: "Seeking a creative Marketing Manager to lead our digital campaigns and improve brand visibility across platforms. Proven track record required."
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Finance Corp",
    location: "Mzuzu (Remote)",
    type: "Full-time",
    salary: "MWK 700,000 - 1,000,000",
    posted: "3 days ago",
    description: "Analyze financial data to help drive strategic business decisions. Proficiency in SQL, Python, and modern BI tools required."
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % freeJobs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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

      {/* Free Jobs Overview Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Opportunities</h2>
            <p className="mt-4 text-lg text-gray-500">Explore some of the roles currently available on our platform.</p>
          </div>

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
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{freeJobs[currentIndex].title}</h3>
                      <p className="text-primary-600 font-semibold">{freeJobs[currentIndex].company}</p>
                    </div>