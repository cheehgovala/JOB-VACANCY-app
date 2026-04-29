import { motion } from 'framer-motion';
import { ArrowUpRight, Briefcase, CheckCircle, FileText, Filter, GraduationCap, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import CandidateProfileModal from '../../components/CandidateProfileModal';

export default function Pipeline() {
  const [activeJob, setActiveJob] = useState('Frontend Developer');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Filter States
  const [minExamScore, setMinExamScore] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationDistrict, setLocationDistrict] = useState('');
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [qualificationLevel, setQualificationLevel] = useState('');
  const [dateRange, setDateRange] = useState('');

  // Rich mock data required by detailed cards
  const mockCandidates = [
    { 
      id: 1, 
      name: 'Kondwani Phiri', 
      photo: 'https://i.pravatar.cc/150?u=1',
      score: 95, 
      examScore: 88, 
      district: 'Blantyre',
      qualification: 'BSc Computer Science',
      experience: '5 Years',
      skills: ['React', 'Node.js', 'AWS'],
      applied: '2h ago' 
    },
    { 
      id: 2, 
      name: 'Sarah Mwanza', 
      photo: 'https://i.pravatar.cc/150?u=2',
      score: 92, 
      examScore: 94, 
      district: 'Lilongwe',
      qualification: 'MSc Eng',
      experience: '4 Years',
      skills: ['React', 'TypeScript', 'Figma'],
      applied: '1d ago' 
    },
    { 
      id: 3, 
      name: 'Chisomo Banda', 
      photo: 'https://i.pravatar.cc/150?u=3',
      score: 88, 
      examScore: null, 
      district: 'Mzuzu',
      qualification: 'BSc IT',
      experience: '3 Years',
      skills: ['Vue.js', 'PHP', 'MySQL'],
      applied: '1d ago' 
    },
    { 
      id: 4, 
      name: 'Grace Lungu', 
      photo: 'https://i.pravatar.cc/150?u=4',
      score: 76, 
      examScore: 65, 
      district: 'Zomba',
      qualification: 'Diploma in IT',
      experience: '1 Year',
      skills: ['HTML', 'CSS', 'JavaScript'],
      applied: '3d ago' 
    },
    { 
      id: 5, 
      name: 'David Nkhata', 
      photo: 'https://i.pravatar.cc/150?u=5',
      score: 85, 
      examScore: 82, 
      district: 'Blantyre',
      qualification: 'BSc Computer Science',
      experience: '2 Years',
      skills: ['React Native', 'Firebase', 'Redux'],
      applied: '4d ago' 
    },
  ];

  // Derive sorted & filtered list
  const filteredCandidates = useMemo(() => {
    return mockCandidates
      .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(c => (c.examScore || 0) >= minExamScore)
      .filter(c => locationDistrict ? c.district.toLowerCase() === locationDistrict.toLowerCase() : true)
      .filter(c => qualificationLevel ? c.qualification.toLowerCase().includes(qualificationLevel.toLowerCase()) : true)
      .filter(c => {
        if (!dateRange) return true;
        const isHours = c.applied.includes('h');
        const days = isHours ? 0 : parseInt(c.applied);
        if (dateRange === '24h') return days === 0;
        if (dateRange === '7d') return days <= 7;
        if (dateRange === '30d') return days <= 30;
        return true;
      })
      .filter(c => {
        if (experienceLevels.length === 0) return true;
        const yrs = parseInt(c.experience);
        return experienceLevels.some(level => {
          if (level.includes('Entry') && yrs <= 2) return true;
          if (level.includes('Mid') && yrs >= 3 && yrs <= 5) return true;
          if (level.includes('Senior') && yrs > 5) return true;
          return false;
        });
      })
      .sort((a, b) => {
        const totalA = a.score + (a.examScore || 0);
        const totalB = b.score + (b.examScore || 0);
        return totalB - totalA;
      });
  }, [searchQuery, minExamScore, locationDistrict, qualificationLevel, dateRange, experienceLevels]);

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ranked Shortlist</h1>
          <p className="text-gray-500 mt-1">Review top candidates sorted by their combined AI Match and Exam scores.</p>
        </div>
        
        <div className="flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-x divide-gray-100">
          <div className="px-6 py-4 text-center">
            <span className="block text-3xl font-black text-gray-900">120</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Received</span>
          </div>
          <div className="px-6 py-4 text-center bg-blue-50/30">
            <span className="block text-3xl font-black text-blue-600">45</span>
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Reviewed</span>
          </div>
          <div className="px-6 py-4 text-center bg-green-50/30">
            <span className="block text-3xl font-black text-green-600">15</span>
            <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Shortlisted</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-1 min-h-0">
        {/* Left Sidebar: Filters */}
        <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 h-full overflow-y-auto hidden lg:block">
          <div className="flex items-center gap-2 mb-6 text-gray-900 border-b border-gray-100 pb-4">
            <SlidersHorizontal className="w-5 h-5" />
            <h2 className="font-bold text-lg">Filters</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Search Name</label>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Kondwani..." 
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-primary-500 outline-none text-sm" 
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700">Min Exam Score</label>
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">{minExamScore}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" step="5"
                value={minExamScore}
                onChange={(e) => setMinExamScore(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location District</label>
              <select value={locationDistrict} onChange={(e) => setLocationDistrict(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-primary-500">
                <option value="">All Districts</option>
                <option value="blantyre">Blantyre</option>
                <option value="lilongwe">Lilongwe</option>
                <option value="mzuzu">Mzuzu</option>
                <option value="zomba">Zomba</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Qualification Level</label>
              <select value={qualificationLevel} onChange={(e) => setQualificationLevel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-primary-500">
                <option value="">Any Qualification</option>
                <option value="Diploma">Diploma</option>
                <option value="BSc">Bachelor's Degree</option>
                <option value="MSc">Master's Degree</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Application Date</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-700 outline-none focus:border-primary-500">
                <option value="">Any Time</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
              <div className="space-y-2">
                {['Entry Level (0-2 Yrs)', 'Mid Level (3-5 Yrs)', 'Senior (5+ Yrs)'].map(exp => (
                  <label key={exp} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4 border-gray-300"
                      checked={experienceLevels.includes(exp)}
                      onChange={(e) => {
                        if (e.target.checked) setExperienceLevels([...experienceLevels, exp]);
                        else setExperienceLevels(experienceLevels.filter(l => l !== exp));
                      }}
                    />
                    <span className="text-sm text-gray-600 font-medium">{exp}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => {
                setSearchQuery('');
                setMinExamScore(0);
                setLocationDistrict('');
                setExperienceLevels([]);
                setQualificationLevel('');
                setDateRange('');
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors mt-4"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Ranked List Area */}
        <div className="flex-1 bg-gray-50/50 rounded-2xl border border-gray-200 p-2 overflow-y-auto space-y-4">
          <div className="p-3">
             <div className="flex justify-between items-center">
                 <h3 className="font-bold text-gray-700">Showing {filteredCandidates.length} Result{filteredCandidates.length === 1 ? '' : 's'}</h3>
                 <span className="text-xs font-semibold text-gray-500">Sorted by combined match logic</span>
             </div>
          </div>

          {filteredCandidates.map((candidate, index) => (
            <motion.div 
              key={candidate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCandidate(candidate)}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden"
            >
              {/* Rank Badge */}
              <div className="absolute top-0 left-0 bg-primary-600 text-white text-xs font-black px-3 py-1 rounded-br-xl shadow-sm z-10">
                #{index + 1}
              </div>

              {/* Identity Col */}
              <div className="flex gap-4 items-center sm:w-1/3 pt-4 sm:pt-0">
                <img src={candidate.photo} alt={candidate.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors flex items-center gap-1">{candidate.name} <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary-500" /></h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 font-medium whitespace-nowrap">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.district}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{candidate.experience}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{candidate.qualification}</span>
                  </div>
                </div>
              </div>

              {/* Details Col */}
              <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                <div className="col-span-2 hidden md:block">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Top Skills (Match)</span>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0,3).map(s => (
                      <span key={s} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-bold">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="text-center bg-green-50/50 p-2 rounded-xl border border-green-100">
                  <span className="block text-[10px] font-bold text-green-700 uppercase tracking-wider mb-1 flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Match</span>
                  <span className="font-black text-green-700 text-lg">{candidate.score}%</span>
                </div>

                <div className={`text-center p-2 rounded-xl border ${candidate.examScore ? (candidate.examScore >= 70 ? 'bg-blue-50/50 border-blue-100' : 'bg-red-50/50 border-red-100') : 'bg-gray-50 border-gray-100'}`}>
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1 ${candidate.examScore ? (candidate.examScore >= 70 ? 'text-blue-700' : 'text-red-700') : 'text-gray-500'}`}><FileText className="w-3 h-3" /> Exam</span>
                  <div className={`font-black flex flex-col items-center leading-tight ${candidate.examScore ? (candidate.examScore >= 70 ? 'text-blue-700' : 'text-red-600') : 'text-gray-400'}`}>
                    {candidate.examScore ? (
                      <>
                         <span className="text-lg">{candidate.examScore}%</span>
                         <span className="text-[9px] uppercase">{candidate.examScore >= 70 ? 'PASS' : 'FAIL'}</span>
                      </>
                    ) : (
                      <span className="text-sm mt-1">Pending</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredCandidates.length === 0 && (
            <div className="text-center p-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 mt-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No matches found</h3>
              <p className="text-gray-500">Adjust your exam score slider or location filters to see more candidates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Render Full Profile Modal */}
      <CandidateProfileModal 
        isOpen={!!selectedCandidate} 
        onClose={() => setSelectedCandidate(null)} 
        candidate={selectedCandidate} 
      />
    </div>
  );
}
