import React, { useState, useRef } from 'react';
import { FLASHCARD_DECK } from '../data/mockData';
import { 
  Mic, 
  MicOff,
  Sparkles, 
  BookOpen, 
  FileText, 
  Smile, 
  RotateCw, 
  CheckCircle2, 
  Volume2, 
  Activity, 
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  AlertTriangle,
  Key
} from 'lucide-react';
import { 
  callPronunciationAssess, 
  callOcrGrade, 
  callSentimentAnalysis, 
  getStoredApiKey,
  getStoredModel
} from '../services/geminiService';

interface AdaptiveLearningProps {
  onOpenApiKeyModal?: () => void;
}

export const AdaptiveLearning: React.FC<AdaptiveLearningProps> = ({ onOpenApiKeyModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'speech' | 'spaced_rep' | 'ocr' | 'sentiment'>('speech');

  // Speech assessment states
  const [targetSentence, setTargetSentence] = useState('Language acquisition requires deliberate spaced practice and acoustic feedback.');
  const [spokenInput, setSpokenInput] = useState('Language acquisition requires deliberate space practice and acoustic feedback.');
  const [isEvaluatingSpeech, setIsEvaluatingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState<any>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const playTargetAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(targetSentence);
      utt.lang = 'en-US';
      utt.rate = 0.88;
      window.speechSynthesis.speak(utt);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      setAudioStatus(null);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ Web Speech API. Bạn có thể gõ trực tiếp câu bạn nói vào ô văn bản.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        setAudioStatus('Đang lắng nghe micro... Hãy phát âm to, rõ ràng.');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => (result as any)[0].transcript)
          .join('');
        setSpokenInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
        setAudioStatus(`Lỗi nhận diện: ${event.error}. Bạn vẫn có thể gõ trực tiếp.`);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setAudioStatus(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Cannot start speech recognition:', err);
      setIsRecording(false);
      setAudioStatus('Không thể mở micro. Vui lòng cấp quyền truy cập micro trong trình duyệt.');
    }
  };

  // Spaced Repetition Flashcards
  const [deck, setDeck] = useState(FLASHCARD_DECK);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [spacedFeedback, setSpacedFeedback] = useState<string | null>(null);

  // OCR Essay state
  const [essayText, setEssayText] = useState(
    `In contemporary society, global communication plays an essential role in economic growth. However, many learners struggle with language mastery because traditional classroom methods depend on the weather strongly and lack interactive personalization. In the other hand, adaptive AI ecosystems offer customized feedback and spaced repetition intervals, which accelerate linguistic fluency significantly.`
  );
  const [isGradingEssay, setIsGradingEssay] = useState(false);
  const [essayResult, setEssayResult] = useState<any>(null);
  const [essayError, setEssayError] = useState<string | null>(null);

  // Sentiment state
  const [feedbackInput, setFeedbackInput] = useState(
    'Em thấy bài tập Writing hơi nặng và phần phát âm chưa có nhiều thời gian tương tác 1-1 với thầy cô trên lớp, hy vọng trung tâm có thêm giờ phụ đạo Speaking.'
  );
  const [isAnalyzingSentiment, setIsAnalyzingSentiment] = useState(false);
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [sentimentError, setSentimentError] = useState<string | null>(null);

  // Handlers
  const handleAssessPronunciation = async () => {
    setIsEvaluatingSpeech(true);
    setSpeechResult(null);
    setSpeechError(null);

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const { data } = await callPronunciationAssess({
          targetSentence,
          userSpokenText: spokenInput,
        });
        setSpeechResult(data);
      } else {
        // Deterministic heuristic fallback when no key is set
        const targetWords = (targetSentence || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
        const spokenWords = (spokenInput || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/);
        let matched = 0;
        const phonemeFeedback = targetWords.map((word: string, i: number) => {
          const match = spokenWords[i] === word;
          if (match) matched++;
          return {
            word,
            status: match ? 'correct' : (spokenWords[i] ? 'warning' : 'incorrect'),
            phonetic: `/${word}/`,
            note: match ? 'Âm chuẩn xác' : (spokenWords[i] ? `Phát âm thành "${spokenWords[i]}", cần mở rộng khẩu hình` : 'Bị nuốt âm / bỏ sót'),
          };
        });

        const accuracyScore = Math.min(100, Math.max(65, Math.round((matched / Math.max(1, targetWords.length)) * 100)));
        setSpeechResult({
          accuracyScore,
          fluencyScore: Math.min(98, accuracyScore + 4),
          intonationScore: Math.min(95, accuracyScore - 2),
          overallScore: Math.round((accuracyScore * 0.5) + (accuracyScore + 4) * 0.3 + (accuracyScore - 2) * 0.2),
          phonemeFeedback,
          recommendations: 'Tập trung nhấn trọng âm âm tiết thứ hai và kéo dài nguyên âm đôi theo phương pháp Spaced Repetition (Chế độ mô phỏng offline).',
        });
      }
    } catch (err: any) {
      setSpeechError(err.message || String(err));
    } finally {
      setIsEvaluatingSpeech(false);
    }
  };

  const handleGradeEssay = async () => {
    setIsGradingEssay(true);
    setEssayResult(null);
    setEssayError(null);

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const { data } = await callOcrGrade({
          submissionText: essayText,
          rubric: 'IELTS Task 2',
        });
        setEssayResult(data);
      } else {
        setEssayResult({
          bandScore: 6.5,
          taskAchievement: 6.5,
          coherenceCohesion: 7.0,
          lexicalResource: 6.5,
          grammaticalRange: 6.0,
          detectedErrors: [
            { original: "depend on the weather strongly", correction: "heavily dependent on meteorological conditions", explanation: "Nâng cấp Collocation học thuật cấp C1" },
            { original: "in the other hand", correction: "on the other hand", explanation: "Sửa lỗi dùng giới từ cố định" },
          ],
          positiveHighlights: [
            "Bố cục 4 đoạn rõ ràng, có câu thesis statement chuẩn xác",
            "Sử dụng linh hoạt các liên từ chuyển tiếp (Furthermore, Conversely)",
          ],
          actionPlan: "Bổ sung 5 bài luyện câu ghép đảo ngữ và mở rộng vốn từ vựng chủ đề Sustainable Development (Chế độ mô phỏng offline).",
        });
      }
    } catch (err: any) {
      setEssayError(err.message || String(err));
    } finally {
      setIsGradingEssay(false);
    }
  };

  const handleAnalyzeSentiment = async () => {
    setIsAnalyzingSentiment(true);
    setSentimentResult(null);
    setSentimentError(null);

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const { data } = await callSentimentAnalysis({
          feedbackText: feedbackInput,
          attendanceRate: 85,
          homeworkCompletionRate: 80,
        });
        setSentimentResult(data);
      } else {
        setSentimentResult({
          sentiment: 'Positive',
          satisfactionScore: 84,
          churnRiskPercentage: 14,
          keyDrivers: ['Khối lượng bài tập tự học qua LMS', 'Tương tác thảo luận cùng trợ giảng AI'],
          interventionStrategy: 'Kích hoạt workflow RPA gửi lộ trình ôn tập cá nhân hóa & xếp lịch 1-on-1 với Academic Mentor (Chế độ mô phỏng offline).',
        });
      }
    } catch (err: any) {
      setSentimentError(err.message || String(err));
    } finally {
      setIsAnalyzingSentiment(false);
    }
  };

  const handleFlashcardRating = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    const card = deck[currentCardIndex];
    let nextInterval = card.intervalDays;

    if (quality === 'again') nextInterval = 1;
    else if (quality === 'hard') nextInterval = Math.max(1, Math.round(card.intervalDays * 1.2));
    else if (quality === 'good') nextInterval = Math.round(card.intervalDays * 2.1);
    else if (quality === 'easy') nextInterval = Math.round(card.intervalDays * 2.8);

    setSpacedFeedback(`Thuật toán SM-2: Lần ôn tập tiếp theo cho từ "${card.word}" sau ${nextInterval} ngày.`);
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % deck.length);
      setSpacedFeedback(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>AI-DRIVEN ADAPTIVE PEDAGOGICAL ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Hệ Sinh Thái Học Tập Thích Ứng (Adaptive Learning)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tích hợp AI vào từng điểm chạm học tập: Đánh giá âm vị học Speech-to-Text, thuật toán giãn cách SuperMemo SM-2, chấm bài OCR và phân tích cảm xúc học viên.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('speech')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'speech' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speech-to-Text</span>
          </button>
          <button
            onClick={() => setActiveSubTab('spaced_rep')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'spaced_rep' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Spaced Repetition (SM-2)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ocr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'ocr' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Chấm bài OCR & Rubric</span>
          </button>
          <button
            onClick={() => setActiveSubTab('sentiment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sentiment' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Sentiment Analysis</span>
          </button>
        </div>
      </div>

      {/* 1. Speech-to-Text Module */}
      {activeSubTab === 'speech' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">
                Đánh Giá Phát Âm & Ngữ Điệu Bằng Sóng Âm (Acoustic Phoneme)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mô hình so khớp âm vị học chi tiết từng từ theo thang điểm CEFR & IELTS Speaking
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Câu mẫu chuẩn cần phát âm:
                  </label>
                  <button
                    type="button"
                    onClick={playTargetAudio}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe giọng mẫu chuẩn (US)</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={targetSentence}
                  onChange={(e) => setTargetSentence(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Văn bản ghi nhận từ micro học viên (Speech-to-Text):
                  </label>
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isRecording
                        ? 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-cyan-300'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{isRecording ? 'Dừng ghi âm' : 'Bật Micro nói thử'}</span>
                  </button>
                </div>
                {audioStatus && (
                  <div className="text-[11px] font-mono text-cyan-400 mb-1 flex items-center gap-1.5 animate-in fade-in">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>{audioStatus}</span>
                  </div>
                )}
                <textarea
                  rows={3}
                  value={spokenInput}
                  onChange={(e) => setSpokenInput(e.target.value)}
                  placeholder="Bấm nút 'Bật Micro nói thử' để nói hoặc gõ câu của bạn vào đây..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {speechError && (
                <div className="p-3 bg-rose-950/60 border border-rose-600 rounded-lg text-xs text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-300">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Lỗi API Gemini (Nguyên văn):</span>
                  </div>
                  <div className="font-mono text-[11px] bg-rose-950/80 p-2 rounded border border-rose-800 break-all select-all">
                    {speechError}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Thuật toán CTC Loss & Dynamic Time Warping (DTW)
                </span>
                <button
                  onClick={handleAssessPronunciation}
                  disabled={isEvaluatingSpeech}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isEvaluatingSpeech ? 'Đang phân tích âm vị...' : 'Chấm Điểm Phát Âm AI'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Bảng Điểm Âm Vị Học</span>
              <span className="text-xs font-mono text-cyan-400">ACOUSTIC REPORT</span>
            </h4>

            {speechResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">ĐỘ CHÍNH XÁC</div>
                    <div className="text-xl font-bold text-cyan-400 mt-1 tabular-nums">
                      {speechResult.accuracyScore}%
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">ĐỘ LƯU LOÁT</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">
                      {speechResult.fluencyScore}%
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">NGỮ ĐIỆU</div>
                    <div className="text-xl font-bold text-indigo-400 mt-1 tabular-nums">
                      {speechResult.intonationScore}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-400 mb-2">Chi tiết từng từ (Phoneme Status):</div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {speechResult.phonemeFeedback?.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-950 rounded border border-slate-800/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{item.word}</span>
                          <span className="font-mono text-slate-500 text-[11px]">{item.phonetic}</span>
                        </div>
                        <span
                          className={`text-[11px] font-mono ${
                            item.status === 'correct'
                              ? 'text-emerald-400'
                              : item.status === 'warning'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 leading-relaxed">
                  <div className="font-semibold mb-0.5">Lời khuyên của AI Coach:</div>
                  {speechResult.recommendations}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Mic className="w-8 h-8 mx-auto text-slate-600" />
                <p>Nhấn "Chấm Điểm Phát Âm AI" để phân tích chi tiết độ chính xác và ngữ điệu.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Spaced Repetition (SM-2) */}
      {activeSubTab === 'spaced_rep' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">
                Thuật Toán Lặp Lại Ngắt Quãng (SuperMemo SM-2 Engine)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Tối ưu hóa đường cong lãng quên Ebbinghaus bằng việc tính toán khoảng thời gian ôn tập riêng cho từng học viên
              </p>
            </div>

            <div className="space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer bg-slate-950 border border-slate-800 rounded-xl p-8 text-center min-h-[220px] flex flex-col justify-center items-center hover:border-cyan-500/50 transition-all select-none"
              >
                {!isFlipped ? (
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                      MẶT TRƯỚC (FRONT) · NHẤN ĐỂ LẬT THẺ
                    </span>
                    <div className="text-3xl font-extrabold text-white tracking-wide">
                      {deck[currentCardIndex].word}
                    </div>
                    <div className="text-sm font-mono text-slate-400">
                      {deck[currentCardIndex].phonetic} · <span className="italic">{deck[currentCardIndex].partOfSpeech}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      MẶT SAU (BACK) · ĐỊNH NGHĨA & NGỮ CẢNH
                    </span>
                    <div className="text-lg font-bold text-emerald-300">
                      {deck[currentCardIndex].vietnamese}
                    </div>
                    <p className="text-xs text-slate-300 italic max-w-md">
                      "{deck[currentCardIndex].exampleSentence}"
                    </p>
                  </div>
                )}
              </div>

              {isFlipped && (
                <div className="grid grid-cols-4 gap-2 pt-1 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleFlashcardRating('again')}
                    className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium hover:bg-rose-900/60 cursor-pointer"
                  >
                    Quên (1 ngày)
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('hard')}
                    className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-medium hover:bg-amber-900/60 cursor-pointer"
                  >
                    Khó ({Math.max(1, Math.round(deck[currentCardIndex].intervalDays * 1.2))} ngày)
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('good')}
                    className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-medium hover:bg-cyan-900/60 cursor-pointer"
                  >
                    Tốt ({Math.round(deck[currentCardIndex].intervalDays * 2.1)} ngày)
                  </button>
                  <button
                    onClick={() => handleFlashcardRating('easy')}
                    className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-medium hover:bg-emerald-900/60 cursor-pointer"
                  >
                    Dễ ({Math.round(deck[currentCardIndex].intervalDays * 2.8)} ngày)
                  </button>
                </div>
              )}

              {spacedFeedback && (
                <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-800 text-xs text-cyan-300">
                  {spacedFeedback}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Nguyên Lý Giãn Cách SuperMemo SM-2
            </h4>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Thuật toán liên tục cập nhật hệ số dễ dàng (Ease Factor <span className="font-mono text-cyan-400">EF</span>) và số lần nhắc lại (<span className="font-mono text-cyan-400">n</span>) theo công thức toán học:
              </p>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300">
                EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
              </div>
              <p>
                Học viên chỉ cần dành 10 phút/ngày để giữ vững khả năng nhớ 95% vốn từ vựng C1/IELTS mà không bị quá tải nhận thức (Cognitive Overload).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. OCR Essay & Rubric Grader */}
      {activeSubTab === 'ocr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Chấm Bài Viết Học Thuật IELTS / Cambridge Bằng AI OCR
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhận dạng chữ viết tay hoặc bài gõ, phân tích 4 tiêu chí chấm điểm chuẩn quốc tế
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nội dung bài luận (Essay Submission):
              </label>
              <textarea
                rows={7}
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-serif leading-relaxed"
              />
            </div>

            {essayError && (
              <div className="p-3 bg-rose-950/60 border border-rose-600 rounded-lg text-xs text-rose-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Lỗi API Gemini (Nguyên văn):</span>
                </div>
                <div className="font-mono text-[11px] bg-rose-950/80 p-2 rounded border border-rose-800 break-all select-all">
                  {essayError}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Rubric: IELTS Academic Task 2 Bands 0-9
              </span>
              <button
                onClick={handleGradeEssay}
                disabled={isGradingEssay}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isGradingEssay ? 'Đang chấm điểm qua LLM...' : 'Chấm Bài Viết AI'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Báo Cáo Đánh Giá IELTS Writing</span>
              {essayResult && (
                <span className="text-sm font-bold font-mono text-cyan-400">
                  BAND {essayResult.bandScore}
                </span>
              )}
            </h4>

            {essayResult ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[9px] text-slate-400">TASK</div>
                    <div className="font-bold text-cyan-400 mt-0.5">{essayResult.taskAchievement}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[9px] text-slate-400">COHERENCE</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{essayResult.coherenceCohesion}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[9px] text-slate-400">LEXICAL</div>
                    <div className="font-bold text-indigo-400 mt-0.5">{essayResult.lexicalResource}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <div className="text-[9px] text-slate-400">GRAMMAR</div>
                    <div className="font-bold text-teal-400 mt-0.5">{essayResult.grammaticalRange}</div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-rose-300 mb-1">Lỗi phát hiện và đề xuất sửa:</div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {essayResult.detectedErrors?.map((err: any, i: number) => (
                      <div key={i} className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px]">
                        <span className="line-through text-rose-400">{err.original}</span>
                        {' ➔ '}
                        <span className="text-emerald-400 font-semibold">{err.correction}</span>
                        <div className="text-slate-400 text-[10px] mt-0.5">{err.explanation}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg text-cyan-200 text-[11px] leading-relaxed">
                  <div className="font-bold mb-0.5">Kế hoạch cải thiện cá nhân hóa:</div>
                  <p>{essayResult.actionPlan}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-600" />
                <p>Nhấn "Chấm Bài Viết AI" để nhận bản phân tích 4 tiêu chí IELTS và các điểm cần khắc phục.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Student Sentiment Analysis */}
      {activeSubTab === 'sentiment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Phân Tích Cảm Xúc & Nguy Cơ Churn Của Học Viên
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Xử lý ngôn ngữ tự nhiên (NLP) phân loại thái độ và kích hoạt can thiệp sớm
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phản hồi khảo sát / Tin nhắn của học viên:
              </label>
              <textarea
                rows={4}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
              />
            </div>

            {sentimentError && (
              <div className="p-3 bg-rose-950/60 border border-rose-600 rounded-lg text-xs text-rose-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Lỗi API Gemini (Nguyên văn):</span>
                </div>
                <div className="font-mono text-[11px] bg-rose-950/80 p-2 rounded border border-rose-800 break-all select-all">
                  {sentimentError}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-mono">
                Sentiment Engine: Gemini AI Natural Language
              </span>
              <button
                onClick={handleAnalyzeSentiment}
                disabled={isAnalyzingSentiment}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Smile className="w-3.5 h-3.5" />
                <span>{isAnalyzingSentiment ? 'Đang phân tích cảm xúc...' : 'Phân Tích Cảm Xúc AI'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Chỉ Số Tâm Lý & Nguy Cơ Rời Bỏ
            </h4>

            {sentimentResult ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">TRẠNG THÁI CẢM XÚC</div>
                    <div className="text-base font-bold text-cyan-400 mt-1">
                      {sentimentResult.sentiment}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400">NGUY CƠ CHURN</div>
                    <div className="text-base font-bold text-amber-400 mt-1 tabular-nums">
                      {sentimentResult.churnRiskPercentage}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-slate-300 mb-1">Yếu tố thúc đẩy chính:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                    {sentimentResult.keyDrivers?.map((d: string, i: number) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-[11px] leading-relaxed">
                  <div className="font-bold mb-0.5">Biện pháp can thiệp tự động (RPA):</div>
                  <p>{sentimentResult.interventionStrategy}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                <Smile className="w-8 h-8 mx-auto text-slate-600" />
                <p>Nhấn "Phân Tích Cảm Xúc AI" để dự báo sự hài lòng của học viên.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
