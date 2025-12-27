
import React, { useState, useEffect } from 'react';
import { generateDailyQuestion } from '../services/geminiService';
import { Trophy, CheckCircle, XCircle, Brain, ArrowLeft, Loader2 } from 'lucide-react';
import { playSoundEffect } from '../utils/sound';

interface DailyChallengeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: (success: boolean) => void;
  onBack: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ difficulty, onComplete, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{question: string, options: string[], answer: string, explanation: string} | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    setLoading(true);
    const q = await generateDailyQuestion(difficulty);
    setData(q);
    setLoading(false);
  };

  const handleOptionClick = (option: string) => {
    if (isAnswered || !data) return;
    
    setSelectedOption(option);
    const correct = option === data.answer;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      playSoundEffect('correct');
    } else {
      playSoundEffect('wrong');
    }
  };

  const handleFinish = () => {
    playSoundEffect('click');
    onComplete(isCorrect);
  };

  return (
    <div className="max-w-2xl mx-auto min-h-[60vh] flex flex-col">
      <button 
        onClick={() => { playSoundEffect('click'); onBack(); }}
        className="self-start flex items-center gap-2 text-gray-400 font-bold hover:text-kid-primary transition-colors mb-6"
      >
        <ArrowLeft size={24} /> Back
      </button>

      <div className={`bg-gray-800 rounded-[2.5rem] p-8 shadow-2xl border-4 flex-1 flex flex-col relative overflow-hidden transition-colors duration-300 ${isAnswered ? (isCorrect ? 'border-green-500' : 'border-red-500 bg-red-950/10') : 'border-kid-purple'}`}>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-4 rounded-2xl text-white shadow-lg animate-bounce-slow ${isAnswered ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-kid-purple'}`}>
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Daily Challenge</h2>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                difficulty === 'easy' ? 'bg-green-900/40 text-green-400' :
                difficulty === 'medium' ? 'bg-yellow-900/40 text-yellow-400' :
                'bg-red-900/40 text-red-400'
              }`}>
                {difficulty} Mode
              </span>
              <span className="text-gray-400 text-sm font-bold">Win a Badge!</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-kid-purple mb-4" size={48} />
            <p className="font-bold text-gray-500">Preparing your question...</p>
          </div>
        ) : data ? (
          <div className="flex-1 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-8 leading-relaxed">
              {data.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {data.options.map((opt, idx) => {
                let btnStyle = "bg-gray-700 hover:bg-gray-600 text-gray-200 border-2 border-transparent";
                
                if (isAnswered) {
                  if (opt === data.answer) {
                    btnStyle = "bg-green-600 text-white ring-4 ring-green-500/50 scale-105 z-10 shadow-lg border-green-300";
                  } else if (opt === selectedOption) {
                    btnStyle = "bg-red-600 text-white animate-shake border-red-300";
                  } else {
                    btnStyle = "opacity-40 bg-gray-700 text-gray-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(opt)}
                    disabled={isAnswered}
                    className={`
                      p-6 rounded-2xl font-black text-xl text-left transition-all transform duration-200
                      ${!isAnswered && 'hover:scale-[1.02] active:scale-95 shadow-md hover:bg-gray-600'}
                      ${btnStyle}
                    `}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="mt-auto animate-fade-in-up">
                <div className={`p-6 rounded-2xl mb-6 flex items-start gap-4 border-2 ${isCorrect ? 'bg-green-900/30 border-green-500/50 text-green-100' : 'bg-red-900/30 border-red-500/50 text-red-100'}`}>
                  {isCorrect ? <CheckCircle className="text-green-400 shrink-0" size={32} /> : <XCircle className="text-red-400 shrink-0" size={32} />}
                  <div>
                    <h4 className={`font-black text-xl mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? "Correct! Amazing job!" : "Oops! Not quite right."}
                    </h4>
                    <p className="font-medium text-lg leading-snug">{data.explanation}</p>
                  </div>
                </div>

                <button 
                  onClick={handleFinish}
                  className={`w-full ${isCorrect ? 'bg-kid-primary animate-bounce-slow' : 'bg-gray-600'} text-white font-black py-5 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 text-xl`}
                >
                  {isCorrect ? 'Claim Reward!' : 'Try Another Task'} <Trophy size={24} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center flex-1 flex flex-col justify-center">
             <p className="text-white font-bold mb-4">Error loading question.</p>
             <button onClick={onBack} className="bg-kid-primary px-8 py-3 rounded-full font-bold">Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};
