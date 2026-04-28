import { motion } from 'framer-motion';
import { CheckCircle, Clock, GripVertical, Plus, Settings, Trash2, X } from 'lucide-react';
import { useState } from 'react';

export default function AssessmentBuilder() {
  const [questions, setQuestions] = useState([
    { id: 1, type: 'mcq', text: 'Which hooks are built into React?', options: ['useState and useEffect', 'useFetch and useData', 'useReact and useComponent', 'useRouter and useHistory'], correct: 0 },
  ]);
  const [examName, setExamName] = useState('Frontend Engineering Exam');
  const [timeLimit, setTimeLimit] = useState(20);
  const [passScore, setPassScore] = useState(70);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const newExam = {
      id: Math.random().toString(36).substring(7),
      name: examName,
      timeLimit,
      passScore,
      questions
    };
    
    const existingExams = JSON.parse(localStorage.getItem('talent_mw_exams') || '[]');
    existingExams.push(newExam);
    localStorage.setItem('talent_mw_exams', JSON.stringify(existingExams));
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: 'mcq', text: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleTypeChange = (index, newType) => {
    const newQ = [...questions];
    newQ[index].type = newType;
    if (newType === 'bool') {
      newQ[index].options = ['True', 'False'];
      newQ[index].correct = 0;
    } else if (newType === 'mcq') {
      newQ[index].options = ['', '', '', ''];
      newQ[index].correct = 0;
    }
    setQuestions(newQ);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Assessment Builder</h1>
          <p className="text-gray-500 mt-1">Create engaging pre-employment exams to evaluate skills automatically.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            Preview
          </button>
          <button 
            onClick={handleSave}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold transition-all shadow-md ${isSaved ? 'bg-green-600 text-white' : 'bg-primary-600 hover:bg-primary-500 text-white'}`}
          >
            {isSaved ? 'Saved!' : 'Save Assessment'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {questions.map((q, index) => (
            <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5" />
              </div>
              <button 
                onClick={() => removeQuestion(q.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="pl-6 pr-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-lg text-sm">Q{index + 1}</span>
                  <select 
                    value={q.type}
                    onChange={(e) => handleTypeChange(index, e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2 font-medium outline-none"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="text">Short Answer</option>
                    <option value="bool">True / False</option>
                  </select>
                </div>
                
                <input 
                  type="text" 
                  value={q.text}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[index].text = e.target.value;
                    setQuestions(newQ);
                  }}
                  placeholder="Type your question here..." 
                  className="w-full text-lg font-semibold text-gray-900 mb-6 placeholder-gray-300 border-none px-0 focus:ring-0"
                />

                <div className="space-y-3">
                  {q.type === 'mcq' && q.options.map((opt, oIndex) => (
                    <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${q.correct === oIndex ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input 
                        type="radio" 
                        name={`correct-${q.id}`} 
                        checked={q.correct === oIndex}
                        onChange={() => {
                          const newQ = [...questions];
                          newQ[index].correct = oIndex;
                          setQuestions(newQ);
                        }}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500" 
                      />
                      <input 
                        type="text" 
                        value={opt}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[index].options[oIndex] = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400 p-0 text-sm outline-none" 
                        placeholder={`Option ${oIndex + 1}`}
                      />
                    </div>
                  ))}

                  {q.type === 'bool' && q.options.map((opt, oIndex) => (
                    <div 
                      key={oIndex} 
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${q.correct === oIndex ? 'border-primary-500 bg-primary-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => {
                        const newQ = [...questions];
                        newQ[index].correct = oIndex;
                        setQuestions(newQ);
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`correct-${q.id}`} 
                        checked={q.correct === oIndex}
                        readOnly
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer" 
                      />
                      <span className={`flex-1 font-bold ${q.correct === oIndex ? 'text-primary-700' : 'text-gray-700'}`}>{opt}</span>
                    </div>
                  ))}

                  {q.type === 'text' && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                      <p className="text-sm font-medium text-gray-500 mb-3">Short text answers will be manually reviewed by your team.</p>
                      <textarea 
                        disabled 
                        rows={3} 
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-400 resize-none cursor-not-allowed" 
                        placeholder="Candidate will type their answer here..."
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <button 
            onClick={addQuestion}
            className="w-full p-4 border-2 border-dashed border-primary-200 rounded-2xl text-primary-600 hover:bg-primary-50 font-bold flex justify-center items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Question
          </button>
        </div>

        {/* Sidebar Configuration */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" /> Exam Settings
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Assessment Name</label>
                <input 
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" 
                  placeholder="e.g. Frontend Basics Sandbox" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Time Limit (Minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="number" 
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Passing Score (%)</label>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="number" 
                    value={passScore}
                    onChange={(e) => setPassScore(Number(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500 outline-none text-sm" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Candidates scoring below this will be auto-flagged in your pipeline.</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                  <span className="text-sm font-semibold text-gray-700">Randomize Question Order</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md">
            <h3 className="font-bold mb-2">Anti-Cheat Enabled</h3>
            <p className="text-blue-100 text-sm leading-relaxed">Timer and submissions are strictly enforced server-side. Candidates cannot retake the exam once submitted.</p>
          </div>
        </div>
      </div>

      {/* Candidate Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="mb-8 pr-12">
              <h2 className="text-2xl font-bold text-gray-900">{examName || 'Assessment Preview'}</h2>
              <p className="text-gray-500 mt-1 font-medium">{timeLimit} Minutes • Pass Score: {passScore}%</p>
            </div>

            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id}>
                  <p className="text-lg font-bold text-gray-900 mb-4">{index + 1}. {q.text || 'Untitled Question'}</p>
                  
                  {q.type === 'mcq' && (
                    <div className="space-y-3">
                      {q.options.filter(opt => opt.trim() !== '').map((opt, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all font-medium">
                          <input type="radio" name={`preview-q-${q.id}`} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                          <span className="text-gray-700 text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'bool' && (
                    <div className="space-y-3">
                      {q.options.map((opt, oIndex) => (
                        <label key={oIndex} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all font-medium">
                          <input type="radio" name={`preview-q-${q.id}`} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                          <span className="text-gray-700 text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <textarea 
                      rows={4} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y" 
                      placeholder="Type your answer here..."
                    ></textarea>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
