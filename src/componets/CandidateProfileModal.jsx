import { AnimatePresence, motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { Award, Briefcase, CheckCircle, Download, FileText, GraduationCap, MapPin, Target, X } from 'lucide-react';

export default function CandidateProfileModal({ isOpen, onClose, candidate }) {
  if (!isOpen || !candidate) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(candidate.name, 20, 30);
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`${candidate.district} | ${candidate.experience} Experience`, 20, 40);
    doc.setTextColor(0);
    doc.setFontSize(16);
    doc.text('Match & Assessment Scores', 20, 60);
    doc.setFontSize(12);
    doc.text(`AI Match Score: ${candidate.score}%`, 20, 70);
    doc.text(`Exam Score: ${candidate.examScore ? candidate.examScore + '%' : 'Not taken'}`, 20, 80);
    doc.text(`Qualification: ${candidate.qualification}`, 20, 90);
    doc.save(`${candidate.name.replace(/\s+/g, '_')}_ATS_CV.pdf`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]"
        >
          {/* Header */}
          <div className="bg-white px-6 py-6 border-b border-gray-100 flex items-start justify-between shrink-0">
            <div className="flex gap-5 items-center">
              <img src={candidate.photo} alt={candidate.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-gray-100" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {candidate.district}</span>
                  <span className="flex items-center gap-1"><Briefcase className="w-4 h-4 text-gray-400" /> {candidate.experience} Exp.</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-gray-400" /> {candidate.qualification}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadPDF}
                className="bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors border border-primary-200"
              >
                <Download className="w-4 h-4" /> Download PDF CV
              </button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Grid Layout Boddddd */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Scores & Cover Note */}
              <div className="space-y-6 lg:col-span-1">
                {/* Score Cards */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-700 font-bold">
                      <Target className="w-5 h-5 text-green-500" /> Match Score
                    </div>
                    <span className="text-2xl font-extrabold text-green-600">{candidate.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${candidate.score}%` }}></div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-700 font-bold">
                        <FileText className="w-5 h-5 text-blue-500" /> Exam Score
                      </div>
                      <span className="text-xl font-extrabold text-blue-600">
                        {candidate.examScore ? `${candidate.examScore}%` : 'N/A'}
                      </span>
                    </div>
                    
                    {candidate.examScore && (
                      <div className="space-y-2 mt-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Attempt Count:</span>
                          <span className="font-semibold text-gray-900">1 of 1</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Time Taken:</span>
                          <span className="font-semibold text-gray-900">24m 15s</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Score Breakdown:</span>
                          <span className="font-semibold text-gray-900">{Math.round(candidate.examScore * 0.4)} / 40 pts</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-semibold px-3 py-2 bg-gray-50 rounded-lg mt-2 border border-gray-200">
                          <span className="text-gray-600 tracking-wide uppercase">Final Status</span>
                          <span className={`px-2 py-1 rounded-md text-white shadow-sm ${candidate.examScore >= 70 ? 'bg-green-500' : 'bg-red-500'}`}>
                            {candidate.examScore >= 70 ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary-500" /> Top Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, idx) => (
                      <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-semibold border border-primary-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cover Note */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Cover Note</h3>
                  <p className="text-gray-600 text-sm leading-relaxed italic border-l-4 border-gray-200 pl-3">
                    "I am highly motivated to join your engineering team. I have spent the last 3 years specializing in React and Node.js architectures, driving a 40% reduction in load times at my previous company..."
                  </p>
                </div>
              </div>

              {/* Right Column: Experience & Education */}
              <div className="space-y-6 lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6 text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" /> Work History
                  </h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {[1, 2].map((i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-gray-900">{i === 1 ? 'Senior Developer' : 'Software Engineer'}</div>
                            <time className="font-mono text-xs font-semibold text-gray-500">{i === 1 ? '2022 - Present' : '2019 - 2022'}</time>
                          </div>
                          <div className="text-sm font-medium text-primary-600 mb-2">{i === 1 ? 'Tech Innovation Ltd' : 'Digital Malawi'}</div>
                          <div className="text-gray-600 text-sm">Spearheaded the migration to microservices, improving uptime by 99.9%. Mentored junior developers.</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-gray-500" /> Education & Qualifications
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <h4 className="font-bold text-gray-900">BSc Computer Science</h4>
                      <p className="text-sm text-gray-600 mb-2">University of Malawi • 2015 - 2019</p>
                      <button className="text-sm text-blue-600 font-semibold hover:text-blue-800 underline">View Certificate (PDF)</button>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <h4 className="font-bold text-gray-900">AWS Certified Solutions Architect</h4>
                      <p className="text-sm text-gray-600 mb-2">Amazon Web Services • 2021</p>
                      <button className="text-sm text-blue-600 font-semibold hover:text-blue-800 underline">View Certificate (PDF)</button>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
