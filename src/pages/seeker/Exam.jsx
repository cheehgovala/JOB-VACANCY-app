import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function Exam() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes default
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const navigate = useNavigate();
  const { id: applicationId } = useParams();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [examDetails, setExamDetails] = useState({
    name: "Assessment",
    passThreshold: 70,
    timeLimitMinutes: 20
  });

  const [violationWarning, setViolationWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [violationMessage, setViolationMessage] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  // --- ANTI-CHEATING: Environment Lockdown & Proctoring ---

  const logViolation = async (event) => {
    console.warn(`[Proctoring] Violation detected: ${event}`);
    const sessionId = localStorage.getItem(`exam_session_${applicationId}`);
    if (!sessionId) return;
    try {
      const { data } = await api.post('/assessments/log-violation', { sessionId, event });
      
      let eventMsg = "You left the exam environment.";
      if (event === 'TAB_SWITCHED') eventMsg = "You switched to another tab.";
      if (event === 'WINDOW_BLURRED') eventMsg = "You clicked outside the exam window.";
      if (event === 'EXITED_FULLSCREEN') eventMsg = "You exited full-screen mode.";

      if (data.isFlagged) {
        alert("Maximum violations reached. Your exam has been flagged and submitted automatically.");
        handleSubmit(true);
      } else {
        setViolationCount(data.violationCount || 0);
        setViolationMessage(eventMsg);
        setViolationWarning(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Disable right-click and copy
    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  useEffect(() => {
    if (!hasStarted || submitted) return;

    // Detect tab switching or minimizing
    const handleVisibilityChange = () => {
      if (document.hidden) logViolation('TAB_SWITCHED');
    };

    // Detect clicking outside the browser (blur)
    const handleBlur = () => {
      logViolation('WINDOW_BLURRED');
    };

    // Detect exiting fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) logViolation('EXITED_FULLSCREEN');
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [hasStarted, submitted]);

  useEffect(() => {
    if (!hasStarted || submitted) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      return;
    }

    // Start Webcam
    const startWebcam = async () => {
      try {
        if (!videoRef.current?.srcObject) {
           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
           if (videoRef.current) {
             videoRef.current.srcObject = stream;
           }
           setWebcamEnabled(true);
        }
      } catch (err) {
        console.error("Webcam access denied", err);
        alert("Webcam access is strictly required to prevent cheating. Please allow access and refresh the page.");
      }
    };
    startWebcam();

    // Take Snapshots every 60 seconds
    const snapshotInterval = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        const imageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.5); // Compressed JPEG
        
        const sessionId = localStorage.getItem(`exam_session_${applicationId}`);
        if (!sessionId) return;
        
        try {
          await api.post('/assessments/proctoring-snapshot', { sessionId, imageBase64 });
        } catch (err) {
          console.error("Failed to upload snapshot", err);
        }
      }
    }, 60000);

    return () => {
      clearInterval(snapshotInterval);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [hasStarted, submitted]);

  // Cheating Prevention: Session Tracking & Strict Limits
  useEffect(() => {
    // Check if the user already took this exam
    const previousScore = localStorage.getItem(`exam_score_${applicationId}`);
    if (previousScore !== null) {
      setScore(parseInt(previousScore, 10));
      setSubmitted(true);
      return;
    }

    // Check if there is an active session
    const activeStartTime = localStorage.getItem(`exam_start_${applicationId}`);
    if (activeStartTime) {
      setHasStarted(true);
      const limitStr = localStorage.getItem(`exam_limit_${applicationId}`) || '20';
      const titleStr = localStorage.getItem(`exam_title_${applicationId}`) || 'Assessment';
      const passStr = localStorage.getItem(`exam_pass_${applicationId}`) || '70';
      
      setExamDetails({
        name: titleStr,
        timeLimitMinutes: parseInt(limitStr, 10),
        passThreshold: parseInt(passStr, 10)
      });
      
      const elapsedSeconds = Math.floor((Date.now() - parseInt(activeStartTime, 10)) / 1000);
      const remainingSeconds = (parseInt(limitStr, 10) * 60) - elapsedSeconds;
      
      if (remainingSeconds <= 0) {
        // Time expired while away
        handleSubmit(true);
      } else {
        setTimeLeft(remainingSeconds);
        // Load shuffled questions from storage if available
        const savedQuestions = localStorage.getItem(`exam_questions_${applicationId}`);
        if (savedQuestions) setShuffledQuestions(JSON.parse(savedQuestions));
        
        // Load saved answers
        const savedAnswers = localStorage.getItem(`exam_answers_${applicationId}`);
        if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      }
    }
  }, []);

  useEffect(() => {
    if (submitted || !hasStarted) return;
    
    // Save answers to prevent data loss on refresh
    localStorage.setItem(`exam_answers_${applicationId}`, JSON.stringify(answers));

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // Auto-submit when time expires
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted, hasStarted, answers]);

  useEffect(() => {
    // Fetch real exam details before starting so instructions are accurate
    if (!hasStarted && !submitted) {
      const fetchDetails = async () => {
        try {
          const { data } = await api.get(`/assessments/details/${applicationId}`);
          setExamDetails({
            name: data.title,
            timeLimitMinutes: data.timeLimitMinutes,
            passThreshold: data.passThreshold,
            questionCount: data.questionCount
          });
        } catch (error) {
          console.error("Failed to fetch exam details", error);
        }
      };
      fetchDetails();
    }
  }, [hasStarted, submitted, applicationId]);

  const handleStartExam = async () => {
    // 1. Request Webcam Access First
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamEnabled(true);
    } catch (err) {
      console.error("Webcam access denied", err);
      alert("Webcam access is strictly required to prevent cheating. Please allow webcam access and try again.");
      return; // Stop execution
    }

    // 2. Request Fullscreen
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
      alert("Full-screen mode is required to take this exam. Please allow full-screen.");
      return; // Stop execution
    }

    try {
      const { data } = await api.post('/assessments/start', { applicationId });
      setExamDetails({
        name: data.title || "Assessment",
        timeLimitMinutes: data.timeLimitMinutes,
        passThreshold: data.passThreshold || 70
      });
      setShuffledQuestions(data.questions);
      
      localStorage.setItem(`exam_start_${applicationId}`, Date.now().toString());
      localStorage.setItem(`exam_limit_${applicationId}`, data.timeLimitMinutes.toString());
      localStorage.setItem(`exam_title_${applicationId}`, data.title || "Assessment");
      localStorage.setItem(`exam_pass_${applicationId}`, (data.passThreshold || 70).toString());
      localStorage.setItem(`exam_questions_${applicationId}`, JSON.stringify(data.questions));
      localStorage.setItem(`exam_session_${applicationId}`, data.sessionId);
      
      setHasStarted(true);
      setTimeLeft(data.timeLimitMinutes * 60);
    } catch (error) {
      console.error("Failed to start exam", error);
      alert("Error starting the exam: " + (error.response?.data?.error || error.message));
    }
  };

  const handleSelect = (idxOrText) => {
    setAnswers({ ...answers, [currentQuestion]: idxOrText });
  };

  const nextQuestion = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleReturnToExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setViolationWarning(false);
    } catch (err) {
      alert("You must allow full-screen to continue.");
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (auto = false) => {
    if (!auto && Object.keys(answers).length < shuffledQuestions.length) {
      if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }
    
    localStorage.setItem(`exam_end_${applicationId}`, Date.now().toString());
    const sessionId = localStorage.getItem(`exam_session_${applicationId}`);
    
    try {
       const answersPayload = {};
       shuffledQuestions.forEach((q, i) => {
          if (answers[i] !== undefined) {
             answersPayload[q._id] = answers[i];
          }
       });

       const { data } = await api.post('/assessments/submit', { sessionId, answers: answersPayload });
       setScore(data.score);
       localStorage.setItem(`exam_score_${applicationId}`, data.score.toString());
    } catch (error) {
       console.error("Failed to submit exam", error);
       alert("Error submitting the exam: " + (error.response?.data?.error || error.message));
    }
    
    localStorage.removeItem(`exam_start_${applicationId}`);
    localStorage.removeItem(`exam_limit_${applicationId}`);
    localStorage.removeItem(`exam_title_${applicationId}`);
    localStorage.removeItem(`exam_pass_${applicationId}`);
    localStorage.removeItem(`exam_questions_${applicationId}`);
    localStorage.removeItem(`exam_answers_${applicationId}`);
    localStorage.removeItem(`exam_session_${applicationId}`);
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.log(err));
    }
    
    setSubmitted(true);
  };

  if (submitted) {
    const passed = score >= examDetails.passThreshold;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100"
        >
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 mx-auto ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {passed ? <CheckCircle className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Submitted!</h1>
          <p className="text-gray-500 mb-8">Your results have been automatically attached to your application.</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Your Score</h2>
            <div className={`text-6xl font-black ${passed ? 'text-green-600' : 'text-red-600'}`}>
              {score}%
            </div>
            <p className={`mt-2 font-semibold ${passed ? 'text-green-700' : 'text-red-700'}`}>
              {passed ? "Congratulations! You passed the minimum threshold." : "Unfortunately, you did not meet the required threshold."}
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/seeker/dashboard')}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-md"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const isWarning = timeLeft <= 300; // Under 5 minutes

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-lg w-full border border-gray-100"
        >
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{examDetails.name}</h1>
          <p className="text-gray-500 mb-8">Please read the instructions carefully before starting.</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Questions</span>
              <span className="font-bold text-gray-900">
                {shuffledQuestions.length > 0 ? shuffledQuestions.length : (examDetails.questionCount || 'Various')}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Time Limit</span>
              <span className="font-bold text-gray-900">{examDetails.timeLimitMinutes} Minutes</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Passing Score</span>
              <span className="font-bold text-gray-900">{examDetails.passThreshold}%</span>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 flex gap-3 mb-8 border border-amber-100 text-amber-800">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">This exam can only be attempted once. Ensure you have a stable internet connection and enough time before starting.</p>
          </div>
          
          <button 
            onClick={handleStartExam}
            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-500/30 text-lg"
          >
            Start Exam
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col select-none">
      {/* Hidden Media Elements for Proctoring */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      {/* Violation Warning Overlay */}
      {violationWarning && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-red-500"
          >
            <AlertTriangle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-2">Proctoring Warning</h2>
            <p className="text-xl font-bold text-red-600 mb-4">{violationMessage}</p>
            <p className="text-gray-600 mb-6 font-medium">
              Leaving the exam environment, switching tabs, or exiting full-screen is strictly prohibited. 
              You have used <span className="font-bold text-red-600">{violationCount} of 2</span> allowed warnings. 
              Exceeding this limit will result in an automatic failure.
            </p>
            <button 
              onClick={handleReturnToExam}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg text-lg"
            >
              I Understand, Return to Exam
            </button>
          </motion.div>
        </div>
      )}

      {/* Exam Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <ShieldCheck className="w-6 h-6 text-primary-600" />
             <span className="font-bold text-gray-900">{examDetails.name}</span>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-mono text-lg border ${isWarning ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            <Clock className="w-5 h-5" /> {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="font-bold text-gray-700">Question {currentQuestion + 1} of {shuffledQuestions.length}</span>
          <div className="w-1/2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Area */}
        {shuffledQuestions.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-lg flex flex-col justify-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 leading-relaxed text-center">
                {shuffledQuestions[currentQuestion].text}
              </h2>
              
              <div className="space-y-4 max-w-2xl mx-auto w-full">
                {shuffledQuestions[currentQuestion].type === 'text' ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full p-4 border-2 border-gray-200 rounded-2xl resize-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                      rows={6}
                      placeholder="Type your answer here..."
                      maxLength={1000}
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleSelect(e.target.value)}
                    />
                    <div className="text-right text-sm text-gray-400 font-medium">
                      {(answers[currentQuestion] || "").length} / 1000 characters
                    </div>
                  </div>
                ) : (
                  shuffledQuestions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-semibold text-lg flex items-center gap-4 group ${
                      answers[currentQuestion] === idx 
                        ? 'border-primary-600 bg-primary-50 text-primary-900 shadow-sm' 
                        : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      answers[currentQuestion] === idx 
                        ? 'border-primary-600 border-8' 
                        : 'border-gray-300 group-hover:border-primary-400'
                    }`}></div>
                    {option}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        )}

        {/* Footer Navigation */}
        <footer className="mt-8 flex justify-end items-center">
          {currentQuestion < shuffledQuestions.length - 1 ? (
            <button 
              onClick={nextQuestion}
               className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg"
            >
              Next Question
            </button>
          ) : (
             <button 
              onClick={() => handleSubmit(false)}
               className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/30"
            >
              Submit Exam
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}
