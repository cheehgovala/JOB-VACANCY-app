import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Calendar, CheckSquare, Plus, Video, ListChecks, Clock, Trash2, Eye, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { MALAWI_DISTRICTS } from '../../utils/constants.js';
import api from '../../api/axios';

export default function JobPosting() {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const { id } = useParams();
  const isEditing = !!id;
  const [isLoadingJob, setIsLoadingJob] = useState(isEditing);

  // New states for dynamic fields
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    minSalary: '',
    maxSalary: '',
    deadline: '',
    minQualifications: 'No minimum',
    experience: '0 (Entry Level)',
    description: '',
    skills: []
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const [isSalaryNegotiable, setIsSalaryNegotiable] = useState(false);
  const [attachAssessment, setAttachAssessment] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { publishJob, updateJob, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
       api.get(`/jobs/${id}`).then(res => {
           const job = res.data;
           let minS = '';
           let maxS = '';
           let isNeg = false;
           
           if (job.salary === 'Negotiable') {
             isNeg = true;
           } else if (job.salary && job.salary.includes('MWK')) {
             const match = job.salary.match(/MWK (.*) - (.*)/);
             if (match) {
               minS = match[1];
               maxS = match[2];
             }
           }

           setFormData({
              title: job.title || '',
              department: job.industry || '',
              location: job.location || '',
              type: job.type || 'Full-time',
              minSalary: minS,
              maxSalary: maxS,
              deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
              minQualifications: 'No minimum',
              experience: job.experience || '0 (Entry Level)',
              description: job.description || '',
              skills: job.skills || []
           });
           setAttachAssessment(job.hasAssessment || false);
           setIsSalaryNegotiable(isNeg);
           setIsLoadingJob(false);
       }).catch(err => {
           console.error("Failed to fetch job", err);
           setIsLoadingJob(false);
       });
    }
  }, [id]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    let finalSalary = 'Competitive';
    if (!isSalaryNegotiable && formData.minSalary && formData.maxSalary) {
      const minS = parseInt(formData.minSalary.replace(/,/g, ''), 10);
      if (isNaN(minS) || minS < 90000) {
        alert("Minimum salary must be at least 90,000 MWK.");
        setIsPublishing(false);
        return;
      }
      finalSalary = `MWK ${formData.minSalary} - ${formData.maxSalary}`;
    } else if (isSalaryNegotiable) {
      finalSalary = 'Negotiable';
    }

    const jobData = {
      title: formData.title || 'New Job Listing',
      company: user?.employerProfile?.companyName || user?.employerProfile?.personal?.companyName || 'Unknown Company',
      location: formData.location || 'Remote',
      type: formData.type || 'Full-time',
      salary: finalSalary,
      posted: 'Just now',
      experience: formData.experience,
      industry: formData.department || 'Technology',
      description: formData.description || 'No description provided.',
      skills: formData.skills,
      hasAssessment: attachAssessment,
      isPremium: true,
      match: Math.floor(Math.random() * 21) + 80,
      date: isEditing ? undefined : new Date().toISOString()
    };

    let result;
    if (isEditing) {
      result = await updateJob(id, jobData);
    } else {
      result = await publishJob(jobData);
    }
    setIsPublishing(false);
    
    if (result.success && result.job) {
       if (attachAssessment) {
          navigate(`/employer/assessments?jobId=${result.job._id}`);
       } else {
          navigate('/employer/dashboard');
       }
    } else {
       alert(result.message || 'Failed to publish job');
    }
  };

  if (isLoadingJob) {
    return <div className="text-center p-12 text-gray-500">Loading job details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Job Listing' : 'Post a New Vacancy'}</h1>
        <p className="text-gray-500 mt-1">{isEditing ? 'Update the details of your job listing.' : 'Create a comprehensive job listing to attract the best talent.'}</p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 flex items-center relative">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold z-10">1</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex-1 flex items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[400px]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow focus:shadow-md" placeholder="e.g. Senior Regional Manager" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Department <span className="text-gray-400 font-normal">(Optional)</span></label>
                <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow focus:shadow-md" placeholder="e.g. Engineering, Sales" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location (District)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white appearance-none">
                    <option value="" disabled>Select a district</option>
                    {MALAWI_DISTRICTS.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Remote</option>
                  <option>Internship</option>
                </select>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-gray-700">Salary Range (MWK)</label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      checked={isSalaryNegotiable}
                      onChange={(e) => setIsSalaryNegotiable(e.target.checked)}
                    />
                    <span className="text-sm font-medium text-gray-700">Negotiable</span>
                  </label>
                </div>
                
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isSalaryNegotiable ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" value={formData.minSalary} onChange={e => setFormData({...formData, minSalary: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Min (e.g. 500,000)" disabled={isSalaryNegotiable} />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" value={formData.maxSalary} onChange={e => setFormData({...formData, maxSalary: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Max (e.g. 1,000,000)" disabled={isSalaryNegotiable} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Application Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Requirements & Description</h2>
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Qualifications</label>
                  <select value={formData.minQualifications} onChange={e => setFormData({...formData, minQualifications: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                    <option>No minimum</option>
                    <option>MSCE</option>
                    <option>Diploma</option>
                    <option>Degree</option>
                    <option>Masters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Years of Experience</label>
                  <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                    <option>0 (Entry Level)</option>
                    <option>1-2 Years</option>
                    <option>3-5 Years</option>
                    <option>5-10 Years</option>
                    <option>10+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description <span className="text-gray-400 font-normal">(Full-text Editor)</span></label>
                <textarea rows={8} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none resize-y" placeholder="Detail the responsibilities, specific requirements, culture, and any other notes to candidates..."></textarea>
                <p className="text-xs text-gray-500 mt-2">Use clear headings or bullet points if necessary.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Required Skill Tags (Critical for Match Algorithm)</label>
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input type="text" value={currentSkill} onChange={e => setCurrentSkill(e.target.value)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Search from the standard skill library (e.g. ReactJS, B2B Sales)" />
                  <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl transition-colors font-bold"><Plus className="w-5 h-5" /></button>
                </form>
                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 empty:hidden">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 border border-primary-100">
                      {skill} 
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 ml-1">&times;</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Features & Automation</h2>
            
            <div className="space-y-6">
              
              {/* Assessment Exam Toggle */}
              <div className={`border rounded-2xl transition-all ${attachAssessment ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-white'}`}>
                <div className="p-6 flex items-start justify-between cursor-pointer" onClick={() => setAttachAssessment(!attachAssessment)}>
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl shadow-sm text-white flex-shrink-0 transition-colors ${attachAssessment ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <ListChecks className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Attach Assessment Exam</h3>
                      <p className="text-sm text-gray-600">Automatically test candidates to gauge their exact skill level before review.</p>
                    </div>
                  </div>
                  <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${attachAssessment ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${attachAssessment ? 'translate-x-7' : ''}`}></div>
                  </div>
                </div>
                
                {attachAssessment && (
                  <div className="px-6 pb-6 pt-2 border-t border-blue-100">
                    <p className="text-sm font-semibold text-gray-700 mb-4">You will be redirected to the Assessment Builder to create your custom exam immediately after publishing this job.</p>
                    
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                      <input type="checkbox" className="w-5 h-5 mt-0.5 text-amber-600 rounded border-amber-300" id="strict" />
                      <label htmlFor="strict" className="text-sm text-amber-800 font-medium cursor-pointer">
                        Strict Matching: Only show candidates who pass this assessment.
                      </label>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button 
          onClick={() => step > 1 && setStep(step - 1)}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        {step < totalSteps ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
          >
            Next Step
          </button>
        ) : (
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-primary-500/30 disabled:opacity-50"
          >
            {isPublishing ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Update Job Listing' : 'Publish Job Listing')}
          </button>
        )}
      </div>


    </div>
  );
}

