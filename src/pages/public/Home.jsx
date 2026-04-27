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