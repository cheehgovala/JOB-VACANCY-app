import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ListChecks, Clock, X, Building2, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { MALAWI_DISTRICTS, JOB_TYPES, JOB_DURATIONS, MALAWI_ORGANIZATIONS } from '../../utils/constants.js';
import api from '../../api/axios';

// Job types that do NOT require a duration field
const PERMANENT_TYPES = ['Full-time'];

export default function JobPosting() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const { id } = useParams();
  const isEditing = !!id;
  const [isLoadingJob, setIsLoadingJob] = useState(isEditing);

  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    jobType: 'Full-time',
    duration: '',
    location: '',
    rolePurpose: '',
    keyResponsibilities: '',
    qualifications: '',
    termsAndConditions: '',
    submissionEmail: '',
    deadline: '',
    department: 'Technology',
    experience: '0-1 Year',
    skills: []
  });
  const [currentSkill, setCurrentSkill] = useState('');

  const [attachAssessment, setAttachAssessment] = useState(false);
  const [strictRestriction, setStrictRestriction] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const { publishJob, updateJob, user } = useAuth();
  const navigate = useNavigate();

  // Whether the current job type requires a duration field
  const requiresDuration = !PERMANENT_TYPES.includes(formData.jobType);

  useEffect(() => {
    if (id) {
      api.get(`/jobs/${id}`).then(res => {
        const job = res.data;
        setFormData({
          title: job.title || '',
          institution: job.institution || job.company || '',
          jobType: job.jobType || 'Full-time',
          duration: job.duration || job.contractDuration || '',
          location: job.location || '',
          rolePurpose: job.rolePurpose || job.description || '',
          keyResponsibilities: job.keyResponsibilities || '',
          qualifications: job.qualifications || '',
          termsAndConditions: job.termsAndConditions || '',
          submissionEmail: job.submissionEmail || '',
          department: job.category || job.industry || 'Technology',
          deadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
          experience: job.experienceLevel || job.experience || '0-1 Year',
          skills: job.skills || job.requirements || []
        });
        setAttachAssessment(job.hasAssessment || false);
        setStrictRestriction(job.strictRestriction || false);
        setIsLoadingJob(false);
      }).catch(err => {
        console.error("Failed to fetch job", err);
        setIsLoadingJob(false);
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        institution: user?.employerProfile?.companyName || user?.employerProfile?.personal?.companyName || '',
        submissionEmail: user?.email || ''
      }));
    }
  }, [id, user]);

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skillToRemove) });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.title || !formData.institution || !formData.jobType || !formData.location) {
        alert("Please fill in all mandatory fields (marked with *) before proceeding.");
        return;
      }
      if (requiresDuration && !formData.duration) {
        alert("Please select a duration for the selected job type.");
        return;
      }
    } else if (step === 2) {
      if (!formData.rolePurpose || !formData.keyResponsibilities || !formData.qualifications || !formData.termsAndConditions) {
        alert("Please fill in all mandatory fields (marked with *) before proceeding.");
        return;
      }
    } else if (step === 3) {
      if (!formData.deadline) {
        alert("Please set an application deadline before proceeding.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    const jobData = {
      title: formData.title || 'New Job Listing',
      institution: formData.institution || 'Unknown Company',
      jobType: formData.jobType || 'Full-time',
      duration: requiresDuration ? (formData.duration || '') : '',
      rolePurpose: formData.rolePurpose || 'No role purpose provided.',
      keyResponsibilities: formData.keyResponsibilities || 'No responsibilities provided.',
      qualifications: formData.qualifications || 'No qualifications provided.',
      termsAndConditions: formData.termsAndConditions || 'No terms provided.',
      submissionEmail: formData.submissionEmail || '',
      location: formData.location || 'Remote',
      experienceLevel: formData.experience || '0-1 Year',
      category: formData.department || 'Technology',
      skills: formData.skills,
      applicationDeadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      hasAssessment: attachAssessment,
      strictRestriction: strictRestriction,
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

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1 flex items-center relative">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold z-10">1</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex-1 flex items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex-1 flex items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 4 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex items-center relative">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold z-10 ${step >= 4 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 min-h-[400px]">

        {/* ── STEP 1: Basic Details ── */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                <select
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                >
                  <option value="" disabled>Select Job Title</option>
                  <option>Software Engineer</option>
                  <option>Data Scientist</option>
                  <option>Project Manager</option>
                  <option>Accountant</option>
                  <option>HR Manager</option>
                  <option>Marketing Executive</option>
                  <option>Sales Representative</option>
                  <option>Nurse</option>
                  <option>Clinical Officer</option>
                  <option>Doctor / Medical Officer</option>
                  <option>Teacher</option>
                  <option>Lecturer</option>
                  <option>Administrator</option>
                  <option>Director</option>
                  <option>Executive Director</option>
                  <option>CEO / Managing Director</option>
                  <option>Consultant</option>
                  <option>Legal Officer</option>
                  <option>Finance Manager</option>
                  <option>Procurement Officer</option>
                  <option>Logistics Officer</option>
                  <option>Driver</option>
                  <option>Security Officer</option>
                  <option>Intern</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Institution / Organization */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Institution / Organization <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                  <select
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white appearance-none"
                  >
                    <option value="" disabled>Select Institution / Organization</option>
                    {/* Show employer's own company name first if available */}
                    {user?.employerProfile?.companyName && (
                      <option value={user.employerProfile.companyName}>{user.employerProfile.companyName}</option>
                    )}
                    {user?.employerProfile?.personal?.companyName &&
                      user.employerProfile.personal.companyName !== user?.employerProfile?.companyName && (
                        <option value={user.employerProfile.personal.companyName}>{user.employerProfile.personal.companyName}</option>
                      )}
                    {MALAWI_ORGANIZATIONS.map(org => (
                      <option key={org} value={org}>{org}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Type (renamed from Contract Type) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.jobType}
                  onChange={e => setFormData({ ...formData, jobType: e.target.value, duration: '' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {!requiresDuration && (
                  <p className="text-xs text-gray-400 mt-1">Duration is not required for Full-time positions.</p>
                )}
              </div>

              {/* Duration — only shown when NOT Full-time */}
              {requiresDuration && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    <select
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white appearance-none"
                    >
                      <option value="" disabled>Select Duration</option>
                      {JOB_DURATIONS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Location (District) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <select
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white appearance-none"
                  >
                    <option value="" disabled>Select a district</option>
                    <option value="Remote">Remote</option>
                    {MALAWI_DISTRICTS.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Job Details ── */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Job Details</h2>
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role Purpose <span className="text-red-500">*</span></label>
                <textarea rows={3} value={formData.rolePurpose} onChange={e => setFormData({ ...formData, rolePurpose: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none resize-y" placeholder="Provide a concise overview of the role, its importance, and how it contributes to the institution's mission." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities <span className="text-red-500">*</span></label>
                <textarea rows={5} value={formData.keyResponsibilities} onChange={e => setFormData({ ...formData, keyResponsibilities: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none resize-y" placeholder="List the main duties. Use bullet points or categories like 'Strategic Leadership', 'Financial Management', etc." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Required Qualifications and Experience <span className="text-red-500">*</span></label>
                <textarea rows={5} value={formData.qualifications} onChange={e => setFormData({ ...formData, qualifications: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none resize-y" placeholder="• Minimum academic qualifications&#10;• Required certifications&#10;• Years of experience..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Terms and Conditions of Service <span className="text-red-500">*</span></label>
                <textarea rows={4} value={formData.termsAndConditions} onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none resize-y" placeholder="Remuneration, benefits package, special conditions, etc." />
              </div>

            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Submission & Platform Settings ── */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Submission &amp; Platform Settings</h2>

            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Submission Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" value={formData.submissionEmail} onChange={e => setFormData({ ...formData, submissionEmail: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow focus:shadow-md" placeholder="Where candidates should email CVs" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Application Deadline <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="date" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider">Smart Match Settings</h3>
                <p className="text-xs text-blue-700 mb-6">These fields aren't shown in the description, but are used to match the best candidates to your listing.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Industry</label>
                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                      <option>Technology</option>
                      <option>Design</option>
                      <option>Finance</option>
                      <option>Telecommunications</option>
                      <option>Health</option>
                      <option>Education</option>
                      <option>Agriculture</option>
                      <option>NGO / Development</option>
                      <option>Government</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Minimum Years of Experience</label>
                    <select value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none bg-white">
                      <option>0-1 Year</option>
                      <option>2 Years</option>
                      <option>3-4 Years</option>
                      <option>5+ Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Required Skill Tags (Critical for Match Algorithm)</label>
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={e => setCurrentSkill(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
                          setFormData({ ...formData, skills: [...formData.skills, currentSkill.trim()] });
                          setCurrentSkill('');
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-base"
                    placeholder="Type a skill and press Enter to add (e.g. ReactJS, B2B Sales, Accounting)"
                  />
                  <div className="flex flex-wrap gap-2 mt-3 p-4 bg-white rounded-xl border border-blue-100 empty:hidden">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 border border-blue-200">
                        {skill}
                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-500 ml-1"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assessment Exam Toggle */}
              <div className={`border rounded-2xl transition-all ${attachAssessment ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200 bg-white'}`}>
                <div className="p-6 flex items-start justify-between cursor-pointer" onClick={() => setAttachAssessment(!attachAssessment)}>
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl shadow-sm text-white flex-shrink-0 transition-colors ${attachAssessment ? 'bg-primary-600' : 'bg-gray-300'}`}>
                      <ListChecks className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Attach Assessment Exam</h3>
                      <p className="text-sm text-gray-600">Automatically test candidates to gauge their exact skill level before review.</p>
                    </div>
                  </div>
                  <div className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${attachAssessment ? 'bg-primary-600' : 'bg-gray-300'}`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${attachAssessment ? 'translate-x-7' : ''}`}></div>
                  </div>
                </div>

                {attachAssessment && (
                  <div className="px-6 pb-6 pt-2 border-t border-primary-100">
                    <p className="text-sm font-semibold text-gray-700 mb-4">You will be redirected to the Assessment Builder to create your custom exam immediately after publishing this job.</p>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                      <input type="checkbox" className="w-5 h-5 mt-0.5 text-amber-600 rounded border-amber-300" id="strict" checked={strictRestriction} onChange={(e) => setStrictRestriction(e.target.checked)} />
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

        {/* ── STEP 4: Preview ── */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Preview Your Listing</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{formData.title || 'Untitled Job'}</h3>
                <p className="text-primary-600 font-semibold mb-4">{formData.institution || 'Unknown Institution'}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {formData.location || 'Remote'}</span>
                  <span className="flex items-center gap-1.5">{formData.jobType}</span>
                  {requiresDuration && formData.duration && (
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formData.duration}</span>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Role Purpose</h4>
                    <p className="text-gray-600 whitespace-pre-line">{formData.rolePurpose || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Key Responsibilities</h4>
                    <p className="text-gray-600 whitespace-pre-line">{formData.keyResponsibilities || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Qualifications &amp; Experience</h4>
                    <p className="text-gray-600 whitespace-pre-line">{formData.qualifications || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2">Terms &amp; Conditions</h4>
                    <p className="text-gray-600 whitespace-pre-line">{formData.termsAndConditions || 'Not provided'}</p>
                  </div>
                  {formData.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((s, i) => (
                          <span key={i} className="bg-primary-50 text-primary-700 px-2 py-1 rounded-md text-xs font-semibold border border-primary-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => step > 1 && setStep(step - 1)}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
        >
          Previous
        </button>
        {step < totalSteps ? (
          <button
            onClick={handleNext}
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
