import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import { Award, Briefcase, Check, ChevronRight, Code, Download, FileText, GraduationCap, Link, User, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MALAWI_DISTRICTS } from '../../utils/constants.js';
import { getEmailError, getPhoneError } from '../../utils/validation.js';
import api from '../../api/axios';

export default function CVBuilder() {
  const navigate = useNavigate();
  const { user, updateSeekerProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [copiedLink, setCopiedLink] = useState(false);

  const [uploadingState, setUploadingState] = useState({ type: null, index: null });
  const [personalErrors, setPersonalErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  const [formData, setFormData] = useState({
    personal: { fullName: '', email: '', phone: '', location: '', bio: '', nationalIdUrl: '' },
    experience: [{ title: '', company: '', duration: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    certifications: [{ name: '', organization: '', year: '', attachmentUrl: '' }],
    references: [{ name: '', role: '', contact: '' }],
    skills: ''
  });

  useEffect(() => {
    if (user?.seekerProfile) {
      const sp = user.seekerProfile;
      setFormData({
        personal: {
          fullName: sp.personal?.fullName || user.name || '',
          email: sp.personal?.email || user.email || '',
          phone: sp.personal?.phone || user.phone || '',
          location: sp.personal?.location || '',
          bio: sp.personal?.bio || '',
          nationalIdUrl: sp.personal?.nationalIdUrl || ''
        },
        experience: sp.experience?.length ? sp.experience.map(e => ({
          title: e.title || '',
          company: e.company || '',
          duration: e.duration || (e.startDate ? `${new Date(e.startDate).getFullYear()}` : ''),
          description: e.description || ''
        })) : [{ title: '', company: '', duration: '', description: '' }],
        education: sp.education?.length ? sp.education.map(e => ({
          degree: e.degree || '',
          institution: e.institution || '',
          year: e.year || ''
        })) : [{ degree: '', institution: '', year: '' }],
        certifications: sp.certifications?.length ? sp.certifications : [{ name: '', organization: '', year: '', attachmentUrl: '' }],
        references: sp.references?.length ? sp.references : [{ name: '', role: '', contact: '' }],
        skills: Array.isArray(sp.skills) ? sp.skills.join(', ') : (sp.skills || '')
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }
      }));
    }
  }, [user]);

  const uploadFile = async (file) => {
    const dataForm = new FormData();
    dataForm.append('image', file);
    try {
      const { data } = await api.post('/upload', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data.record?.url || '';
    } catch (error) {
      console.error('Upload failed:', error);
      return '';
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personal: { ...formData.personal, [name]: value }
    });
    // Clear error when user starts typing
    if (personalErrors[name]) {
      setPersonalErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePersonalInfo = () => {
    const newErrors = {
      fullName: formData.personal.fullName.trim() ? '' : 'Full name is required',
      email: getEmailError(formData.personal.email),
      phone: getPhoneError(formData.personal.phone),
      location: formData.personal.location.trim() ? '' : 'Location is required',
      bio: formData.personal.bio.trim() ? '' : 'Professional bio is required'
    };
    setPersonalErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleNext = () => {
    if (step === 1 && !validatePersonalInfo()) {
      return;
    }
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateCompleteness = () => {
    let score = 0;
    const { personal, experience, education, skills, certifications, references } = formData;
    if (personal.fullName && personal.email && personal.phone) score += 20;
    if (experience.length > 0 && experience[0].title && experience[0].company) score += 20;
    if (education.length > 0 && education[0].degree && education[0].institution) score += 20;
    if (skills.length > 5) score += 20;
    if ((certifications.length > 0 && certifications[0].name) || (references.length > 0 && references[0].name)) score += 20;
    return score;
  };

  const handleSaveProfile = async () => {
    const completeness = calculateCompleteness();
    if (updateSeekerProfile) {
      const skillsArray = typeof formData.skills === 'string' 
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) 
        : formData.skills;
        
      await updateSeekerProfile({ ...formData, skills: skillsArray }, completeness);
    }
    localStorage.setItem('cvCompleted', 'true');
    navigate('/seeker/jobs');
  };

  const handleCopyLink = () => {
    const mockLink = `https://talentmw.com/cv/u-${Math.floor(Math.random() * 1000000)}`;
    navigator.clipboard.writeText(mockLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let currentY = 30;

    const checkPageBreak = (spaceNeeded = 20) => {
      if (currentY + spaceNeeded > 280) {
        doc.addPage();
        currentY = 20;
      }
    };

    doc.setFontSize(22);
    doc.text(formData.personal.fullName || 'Your Name', 20, currentY);
    currentY += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`${formData.personal.email}  |  ${formData.personal.phone}  |  ${formData.personal.location}`, 20, currentY);
    currentY += 10;
    doc.setTextColor(0);
    
    if (formData.personal.bio) {
      const splitBio = doc.splitTextToSize(formData.personal.bio, 170);
      doc.text(splitBio, 20, currentY);
      currentY += (splitBio.length * 5) + 10;
    }
    
    checkPageBreak();
    doc.setFontSize(16);
    doc.setTextColor(40, 100, 200);
    doc.text('Experience', 20, currentY);
    currentY += 8;
    doc.setTextColor(0);
    doc.setFontSize(12);
    formData.experience.forEach((exp) => {
      if (exp.title) {
        checkPageBreak(30);
        doc.setFont(undefined, 'bold');
        doc.text(`${exp.title} at ${exp.company}`, 20, currentY);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`(${exp.duration})`, 150, currentY);
        doc.setTextColor(0);
        doc.setFontSize(12);
        currentY += 6;
        if (exp.description) {
          const splitDesc = doc.splitTextToSize(exp.description, 170);
          doc.text(splitDesc, 20, currentY);
          currentY += (splitDesc.length * 5) + 6;
        }
      }
    });

    currentY += 4;
    checkPageBreak(30);

    doc.setFontSize(16);
    doc.setTextColor(40, 100, 200);
    doc.text('Education', 20, currentY);
    currentY += 8;
    doc.setTextColor(0);
    doc.setFontSize(12);
    formData.education.forEach((edu) => {
      if (edu.degree) {
        checkPageBreak(15);
        doc.setFont(undefined, 'bold');
        doc.text(edu.degree, 20, currentY);
        doc.setFont(undefined, 'normal');
        currentY += 6;
        doc.text(`${edu.institution} - ${edu.year}`, 20, currentY);
        currentY += 8;
      }
    });

    currentY += 4;
    checkPageBreak(30);

    if (formData.certifications.some(c => c.name)) {
      doc.setFontSize(16);
      doc.setTextColor(40, 100, 200);
      doc.text('Certifications', 20, currentY);
      currentY += 8;
      doc.setTextColor(0);
      doc.setFontSize(12);
      formData.certifications.forEach((cert) => {
        if (cert.name) {
          checkPageBreak(10);
          doc.text(`\u2022 ${cert.name} - ${cert.organization} (${cert.year})`, 20, currentY);
          currentY += 8;
        }
      });
      currentY += 8;
      checkPageBreak(30);
    }

    if (formData.skills) {
      doc.setFontSize(16);
      doc.setTextColor(40, 100, 200);
      doc.text('Skills', 20, currentY);
      currentY += 8;
      doc.setTextColor(0);
      doc.setFontSize(12);
      const splitSkills = doc.splitTextToSize(formData.skills, 170);
      doc.text(splitSkills, 20, currentY);
      currentY += (splitSkills.length * 5) + 8;
      checkPageBreak(30);
    }

    if (formData.references.some(r => r.name)) {
      doc.setFontSize(16);
      doc.setTextColor(40, 100, 200);
      doc.text('References', 20, currentY);
      currentY += 8;
      doc.setTextColor(0);
      doc.setFontSize(12);
      formData.references.forEach((ref) => {
        if (ref.name) {
          checkPageBreak(15);
          doc.setFont(undefined, 'bold');
          doc.text(ref.name, 20, currentY);
          doc.setFont(undefined, 'normal');
          currentY += 6;
          doc.text(`${ref.role} | ${ref.contact}`, 20, currentY);
          currentY += 8;
        }
      });
    }

    doc.save('my-ats-cv.pdf');
  };

  const stepsList = [
    { id: 1, label: 'Personal', icon: User },
    { id: 2, label: 'Experience', icon: Briefcase },
    { id: 3, label: 'Education', icon: GraduationCap },
    { id: 4, label: 'Certifications', icon: Award },
    { id: 5, label: 'References', icon: Users },
    { id: 6, label: 'Export', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Digital CV Builder</h1>
        <p className="text-gray-500 mt-1">Create an ATS-friendly CV that stands out to employers.</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 overflow-x-auto pb-4">
        <div className="flex items-center justify-between relative min-w-[600px]">
          <div className="absolute left-0 top-1/2 -mt-px w-full h-1 bg-gray-200" />
          <div 
            className="absolute left-0 top-1/2 -mt-px h-1 bg-primary-600 transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
          {stepsList.map((s) => (
            <div key={s.id} className="relative flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white relative z-10 ${
                step > s.id 
                  ? 'border-primary-600 bg-primary-600 text-white' 
                  : step === s.id 
                    ? 'border-primary-600 text-primary-600' 
                    : 'border-gray-300 text-gray-400'
              }`}>
                {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={`mt-2 text-xs font-semibold ${step >= s.id ? 'text-primary-700' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 min-h-[400px]">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="fullName" value={formData.personal.fullName} onChange={handlePersonalChange} type="text" className={`w-full px-4 py-2 border ${personalErrors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary-500 focus:border-primary-500`} placeholder="e.g. Kondwani Phiri" />
                {personalErrors.fullName && <p className="mt-1 text-sm text-red-600">{personalErrors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" value={formData.personal.email} onChange={handlePersonalChange} type="email" className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 ${personalErrors.email ? 'border-red-500' : ''}`} placeholder="kondwani@example.com" />
                {personalErrors.email && <p className="mt-1 text-sm text-red-600">{personalErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input name="phone" value={formData.personal.phone} onChange={handlePersonalChange} type="tel" className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 ${personalErrors.phone ? 'border-red-500' : ''}`} placeholder="+265 88X XXX XXX" />
                {personalErrors.phone && <p className="mt-1 text-sm text-red-600">{personalErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select name="location" value={formData.personal.location} onChange={handlePersonalChange} className={`w-full px-4 py-2 border ${personalErrors.location ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-white appearance-none`}>
                  <option value="" disabled>Select a district</option>
                  {MALAWI_DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {personalErrors.location && <p className="mt-1 text-sm text-red-600">{personalErrors.location}</p>}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                <textarea name="bio" value={formData.personal.bio} onChange={handlePersonalChange} rows={4} className={`w-full px-4 py-2 border ${personalErrors.bio ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-primary-500 focus:border-primary-500`} placeholder="Briefly describe your professional background and goals..."></textarea>
                {personalErrors.bio && <p className="mt-1 text-sm text-red-600">{personalErrors.bio}</p>}
              </div>
              <div className="col-span-1 md:col-span-2 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID Attachment</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadingState({ type: 'nationalId', index: null });
                        const url = await uploadFile(e.target.files[0]);
                        if (url) {
                          setFormData({
                            ...formData,
                            personal: { ...formData.personal, nationalIdUrl: `http://localhost:5000${url}` }
                          });
                        }
                        setUploadingState({ type: null, index: null });
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" 
                  />
                  {uploadingState.type === 'nationalId' && <div className="text-sm font-medium text-blue-600 animate-pulse">Uploading file...</div>}
                  {formData.personal.nationalIdUrl && formData.personal.nationalIdUrl !== '' && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Check className="w-4 h-4"/> 
                      <span>Attached Successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
              <button onClick={() => setFormData({...formData, experience: [...formData.experience, {title: '', company: '', duration: '', description: ''}]})} className="text-sm font-medium text-primary-600 hover:text-primary-700">+ Add Another</button>
            </div>
            {formData.experience.map((exp, i) => (
              <div key={i} className="space-y-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input 
                      type="text" 
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[i].title = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                      placeholder="e.g. Sales Manager" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input 
                      type="text" 
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[i].company = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                      placeholder="e.g. Airtel Malawi" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input 
                      type="text" 
                      value={exp.duration}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[i].duration = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                      placeholder="Jan 2021 - Present" 
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows={3} 
                      value={exp.description}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[i].description = e.target.value;
                        setFormData({ ...formData, experience: newExp });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                      placeholder="Describe your responsibilities and achievements..."
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
              <button onClick={() => setFormData({...formData, education: [...formData.education, {degree: '', institution: '', year: ''}]})} className="text-sm font-medium text-primary-600 hover:text-primary-700">+ Add Another</button>
            </div>
            {formData.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50/50 mb-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree / Qualification</label>
                  <input 
                    type="text" 
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[i].degree = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. BSc Computer Science" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input 
                    type="text" 
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[i].institution = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. University of Malawi" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input 
                    type="text" 
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[i].year = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. 2023" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
              <button onClick={() => setFormData({...formData, certifications: [...formData.certifications, {name: '', organization: '', year: ''}]})} className="text-sm font-medium text-primary-600 hover:text-primary-700">+ Add Another</button>
            </div>
            {formData.certifications.map((cert, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50/50 mb-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input 
                    type="text" 
                    value={cert.name}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[i].name = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. AWS Certified Solutions Architect" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                  <input 
                    type="text" 
                    value={cert.organization}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[i].organization = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. Amazon Web Services" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input 
                    type="text" 
                    value={cert.year}
                    onChange={(e) => {
                      const newCerts = [...formData.certifications];
                      newCerts[i].year = e.target.value;
                      setFormData({ ...formData, certifications: newCerts });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. 2022" />
                </div>
                <div className="col-span-1 md:col-span-2 pt-2">
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">References</h2>
              <button onClick={() => setFormData({...formData, references: [...formData.references, {name: '', role: '', contact: ''}]})} className="text-sm font-medium text-primary-600 hover:text-primary-700">+ Add Another</button>
            </div>
            {formData.references.map((ref, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-100 rounded-xl bg-gray-50/50 mb-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Name</label>
                  <input 
                    type="text" 
                    value={ref.name}
                    onChange={(e) => {
                      const newRefs = [...formData.references];
                      newRefs[i].name = e.target.value;
                      setFormData({ ...formData, references: newRefs });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. Jane Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role & Company</label>
                  <input 
                    type="text" 
                    value={ref.role}
                    onChange={(e) => {
                      const newRefs = [...formData.references];
                      newRefs[i].role = e.target.value;
                      setFormData({ ...formData, references: newRefs });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. Senior Manager, TechCorp" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
                  <input 
                    type="text" 
                    value={ref.contact}
                    onChange={(e) => {
                      const newRefs = [...formData.references];
                      newRefs[i].contact = e.target.value;
                      setFormData({ ...formData, references: newRefs });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                    placeholder="e.g. jane@techcorp.com / +265 88X..." />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {step === 6 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Skills & Export</h2>
              <div className="bg-white px-4 py-2 border border-gray-200 rounded-xl shadow-sm flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">Completeness:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${calculateCompleteness()}%` }}></div>
                </div>
                <span className="text-sm font-bold text-green-600">{calculateCompleteness()}%</span>
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Core Skills (Comma separated)</label>
              <textarea 
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                placeholder="e.g. Project Management, ReactJS, Data Analysis..."
              ></textarea>
            </div>
            
            <div className="bg-primary-50 flex-col md:flex-row gap-6 rounded-xl p-6 border border-primary-100 flex items-center justify-between">
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">You are ready to go!</h3>
                <p className="text-gray-600 mb-0 text-sm max-w-sm">Your profile is complete. Download your ATS-friendly CV or get a shareable link.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition-all shadow-sm ${copiedLink ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                  {copiedLink ? <Check className="w-5 h-5" /> : <Link className="w-5 h-5" />}
                  {copiedLink ? 'Link Copied!' : 'Share Link'}
                </button>
                <button 
                  onClick={generatePDF}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-primary-500/20"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <button 
          onClick={handleBack}
          disabled={step === 1}
          className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${step === 1 ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 shadow-sm'}`}
        >
          Back
        </button>
        {step < totalSteps ? (
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
             onClick={handleSaveProfile}
             className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-sm"
          >
            Save Profile & Discover Jobs
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
