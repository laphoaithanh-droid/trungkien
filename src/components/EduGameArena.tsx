import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_VOCAB_GAME_QUESTIONS, INITIAL_LEADERBOARD } from '../data/mockData';
import { VocabGameQuestion, LeaderboardEntry } from '../types';
import { 
  Gamepad2, 
  Trophy, 
  Zap, 
  Flame, 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Clock, 
  Award,
  Medal,
  ChevronRight,
  HelpCircle,
  Play
} from 'lucide-react';

export const EduGameArena: React.FC = () => {
  const [questions] = useState<VocabGameQuestion[]>(INITIAL_VOCAB_GAME_QUESTIONS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  
  // Game states
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQ = questions[currentIndex] || questions[0];

  // Synthesize Web Audio sound effects without external files
  const playSoundEffect = (type: 'correct' | 'wrong' | 'combo' | 'gameover') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'correct') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'combo') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(160, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'gameover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch {
      // Audio context error or blocked by autoplay
    }
  };

  // Text-to-speech for word pronunciation
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Setup options for current question
  useEffect(() => {
    if (!currentQ) return;
    const all = [currentQ.vietnameseMeaning, ...currentQ.distractors];
    // deterministic shuffle
    const shuffled = all.sort(() => Math.random() - 0.5);
    setAnswerOptions(shuffled);
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setShowHint(false);
    setTimeLeft(15);
  }, [currentIndex, questions]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || isAnswerChecked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswerChecked, currentIndex]);

  const handleStartGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
  };

  const handleTimeOut = () => {
    setIsAnswerChecked(true);
    setStreak(0);
    playSoundEffect('wrong');
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked || gameState !== 'playing') return;

    setSelectedAnswer(opt);
    setIsAnswerChecked(true);

    const isCorrect = opt === currentQ.vietnameseMeaning;
    if (isCorrect) {
      const streakBonus = streak * 50;
      const timeBonus = timeLeft * 10;
      const pointsWon = 200 + timeBonus + streakBonus;
      setScore((prev) => prev + pointsWon);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      if (newStreak >= 3) {
        playSoundEffect('combo');
      } else {
        playSoundEffect('correct');
      }
    } else {
      setStreak(0);
      playSoundEffect('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Game ended
      setGameState('ended');
      playSoundEffect('gameover');
      // Save highscore
      const newEntry: LeaderboardEntry = {
        rank: leaderboard.length + 1,
        studentName: 'Bạn (Phiên hiện tại)',
        studentCode: 'TK-USER-ACTIVE',
        score: score,
        streak: maxStreak,
        accuracy: Math.round((questions.filter((_, i) => i <= currentIndex).length / questions.length) * 100),
        badge: score > 2000 ? '🔥 Speed Master' : '⭐ Explorer',
      };
      setLeaderboard((prev) =>
        [...prev, newEntry].sort((a, b) => b.score - a.score).map((item, idx) => ({ ...item, rank: idx + 1 }))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>GAMIFIED PEDAGOGY · INTERACTIVE SPEED VOCAB ARENA</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Đấu Trí Từ Vựng & Minigame Giáo Dục (Edu Game Arena)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Ứng dụng phương pháp Gamification tăng cường tốc độ phản xạ ngôn ngữ: Thử thách đếm ngược thời gian, combo chuỗi điểm thưởng và bảng vinh danh học sinh xuất sắc Trung Kiên.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Âm thanh {soundEnabled ? 'Bật' : 'Tắt'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Game Stage (8 cols) & Leaderboard (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Game Stage */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl min-h-[480px] flex flex-col justify-between">
          {/* INTRO SCREEN */}
          {gameState === 'intro' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Flame className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-xl font-bold text-white">
                  IELTS & Academic Vocab Speed Sprint
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bạn có <strong>15 giây</strong> cho mỗi câu hỏi. Trả lời đúng liên tiếp để nhân hệ số Combo và giành vị trí Top 1 trên bảng vinh danh trung tâm!
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>15s / Câu</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Combo Multiplier x3</span>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 hover:scale-105"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Bắt Đầu Thử Thách Ngay</span>
              </button>
            </div>
          )}

          {/* PLAYING SCREEN */}
          {gameState === 'playing' && (
            <div className="space-y-6">
              {/* Top HUD */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                    Câu {currentIndex + 1} / {questions.length}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    Cấp độ {currentQ.cefrLevel}
                  </span>
                </div>

                <div className="flex items-center gap-4 font-mono">
                  {streak > 1 && (
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-700 animate-bounce">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>STREAK x{streak}</span>
                    </div>
                  )}

                  <div className="text-sm font-bold text-white">
                    Điểm: <span className="text-cyan-400 font-extrabold">{score}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Countdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Thời gian còn lại</span>
                  <span
                    className={`font-bold ${
                      timeLeft <= 4 ? 'text-rose-400 animate-ping' : 'text-cyan-400'
                    }`}
                  >
                    {timeLeft}s
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      timeLeft <= 4 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                    }`}
                    style={{ width: `${(timeLeft / 15) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Word Presentation Card */}
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center space-y-3 relative">
                <div className="inline-flex items-center gap-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {currentQ.word}
                  </h2>
                  <button
                    onClick={() => speakWord(currentQ.word)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-cyan-400 transition-colors cursor-pointer"
                    title="Nghe phát âm chuẩn"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-sm font-mono text-cyan-400 font-medium">
                  {currentQ.phonetic}
                </div>

                <p className="text-xs text-slate-400 italic max-w-lg mx-auto font-sans">
                  "{currentQ.exampleSentence}"
                </p>

                {showHint ? (
                  <div className="text-xs text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/80 max-w-md mx-auto animate-in fade-in">
                    <strong>Gợi ý:</strong> {currentQ.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-[11px] text-slate-500 hover:text-amber-400 flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Xem gợi ý (-50 điểm)</span>
                  </button>
                )}
              </div>

              {/* Options Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {answerOptions.map((opt, oIdx) => {
                  const isSelected = selectedAnswer === opt;
                  const isCorrect = opt === currentQ.vietnameseMeaning;

                  let style = 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-900';

                  if (isAnswerChecked) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold';
                    } else {
                      style = 'opacity-40 bg-slate-950 border-slate-900 text-slate-500';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-4 rounded-xl border text-sm text-left transition-all cursor-pointer flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswerChecked && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Next Question / Feedback Bar */}
              {isAnswerChecked && (
                <div className="pt-2 flex items-center justify-between animate-in fade-in">
                  <div className="text-xs">
                    {selectedAnswer === currentQ.vietnameseMeaning ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Chính xác! +200 điểm thưởng
                      </span>
                    ) : (
                      <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" />
                        Đáp án đúng: <strong>{currentQ.vietnameseMeaning}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Câu Tiếp Theo' : 'Xem Kết Quả Cuối'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* END GAME SCREEN */}
          {gameState === 'ended' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-white">
                  Hoàn Thành Vòng Đấu!
                </h3>
                <p className="text-xs text-slate-400">
                  Chúc mừng bạn đã hoàn thành bộ đề từ vựng học thuật Trung Kiên EdTech
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Tổng Điểm</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{score}</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Max Streak</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">x{maxStreak}</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="text-[11px] text-slate-400">Huy Hiệu</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1.5">Top Scholar</div>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi Lại Vòng Khác</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Leaderboard Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Bảng Vinh Danh Học Sinh</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              Live Ranking
            </span>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((user) => {
              const isTop3 = user.rank <= 3;
              let rankBadge = 'bg-slate-800 text-slate-400';
              if (user.rank === 1) rankBadge = 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
              if (user.rank === 2) rankBadge = 'bg-slate-400/20 text-slate-300 border border-slate-400/40';
              if (user.rank === 3) rankBadge = 'bg-amber-700/20 text-amber-500 border border-amber-700/40';

              return (
                <div
                  key={user.rank}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isTop3
                      ? 'bg-slate-950/80 border-slate-800'
                      : 'bg-slate-950/40 border-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md font-mono font-bold text-xs flex items-center justify-center shrink-0 ${rankBadge}`}
                    >
                      {user.rank}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{user.studentName}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {user.studentCode} · {user.badge}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-cyan-400">
                      {user.score.toLocaleString()}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      Streak x{user.streak}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Điểm số tự động đồng bộ vào Moodle LMS Gradebook
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
