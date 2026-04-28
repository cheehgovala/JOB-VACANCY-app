import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Info, MessageSquare, Video, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InterviewInvitationModal({ isOpen, onClose, application }) {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);

  if (!isOpen || !application) return null;

  const handleStartInterview = () => {
    // Navigate to respective interview type
    if (application.interviewType === 'A') navigate(`/seeker/interview/pre-recorded/${application.id}`);
    if (application.interviewType === 'B') {
      // In a real app we would save the selectedSlot to the DB here
      navigate(`/seeker/interview/live/${application.id}`);
    }
    if (application.interviewType === 'C') navigate(`/seeker/interview/text/${application.id}`);
    onClose();
  };

  const getInterviewDetails = () => {
    switch (application.interviewType) {
      case 'A':
        return {
          title: 'Pre-Recorded Video Interview',
          description: 'Record short video answers to pre-set questions at your convenience before the deadline.',
          icon: <Video className="w-8 h-8 text-indigo-600" />,
          bg: 'bg-indigo-50',
          border: 'border-indigo-100',
          deadline: 'Within 48 hours',
          duration: 'Approx. 15 mins'
        };
      case 'B':
        return {
          title: 'Live Video Interview',
          description: 'A scheduled face-to-face video call with the hiring manager. Please select your preferred time slot below.',
          icon: <Calendar className="w-8 h-8 text-blue-600" />,
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          deadline: 'Scheduled Date',
          duration: '45 mins',
          slots: [
            { id: 1, date: 'Mon, Oct 25', time: '10:00 AM CAT' },
            { id: 2, date: 'Tue, Oct 26', time: '02:00 PM CAT' },
            { id: 3, date: 'Wed, Oct 27', time: '11:00 AM CAT' }
          ]
        };
      case 'C':
        return {
          title: 'Structured Text Interview',
          description: 'A low-bandwidth chat interview where you type answers to questions within a time limit.',
          icon: <MessageSquare className="w-8 h-8 text-emerald-600" />,
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          deadline: 'Within 24 hours',
          duration: 'Approx. 20 mins'
        };
      default:
        return {
          title: 'Online Interview',
          description: 'Details pending.',
          icon: <Info className="w-8 h-8 text-gray-600" />,
          bg: 'bg-gray-50',
          border: 'border-gray-100',
          deadline: 'TBD',
          duration: 'TBD'
        };
    }
  };

  const details = getInterviewDetails();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interview Invitation</h2>
              <p className="text-sm text-gray-500 font-medium">{application.company}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-white hover:shadow-sm rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-extrabold text-gray-900">{application.job}</h3>
              <p className="text-gray-600">You have been invited to the next stage of the hiring process!</p>
            </div>

            <div className={`rounded-2xl border ${details.border} ${details.bg} p-6 flex flex-col items-center text-center space-y-4`}>
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                {details.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{details.title}</h4>
                <p className="text-sm text-gray-600 px-4">{details.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center">
                <Clock className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</span>
                <span className="font-semibold text-gray-900">{details.duration}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col items-center text-center">
                <Calendar className="w-5 h-5 text-gray-400 mb-2" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Deadline</span>
                <span className="font-semibold text-gray-900">{details.deadline}</span>
              </div>
            </div>

            {application.interviewType === 'B' && details.slots && (
              <div className="mt-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Select Preferred Slot</h4>
                <div className="space-y-2">
                  {details.slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id)}
                      className={`w-full flex items-center justify-between p-4 border-2 rounded-xl transition-all ${
                        selectedSlot === slot.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                          : 'border-gray-100 bg-white hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-bold">{slot.date}</span>
                        <span className="text-sm font-medium text-gray-500">{slot.time}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        selectedSlot === slot.id ? 'border-blue-600 border-8' : 'border-gray-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={handleStartInterview}
              disabled={application.interviewType === 'B' && !selectedSlot}
              className="flex-1 px-4 py-3 font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2 shadow-lg shadow-primary-500/30 disabled:shadow-none"
            >
              {application.interviewType === 'B' && !selectedSlot ? 'Select a Slot' : 'Confirm & Proceed'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
