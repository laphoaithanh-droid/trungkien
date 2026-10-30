import React, { useState } from 'react';
import { INITIAL_EXAM_PAPER, INITIAL_LESSON_SLIDES } from '../data/mockData';
import { ExamPaper, ExamQuestion, LessonSlide } from '../types';
import { 
  FileText, 
  Presentation, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Clock, 
  AlertCircle,
  Copy,
  Check,
  Share2,
  RefreshCw,
  FolderDown,
  Printer
} from 'lucide-react';
import { 
  callGenerateExamPaper, 
  callGenerateLessonSlides, 
  getStoredApiKey,
  getStoredModel 
} from '../services/geminiService';

interface ExamStudioProps {
  onOpenApiKeyModal?: () => void;
}

export const ExamStudio: React.FC<ExamStudioProps> = ({ onOpenApiKeyModal }) => {
  const [activeTab, setActiveTab] = useState<'exam' | 'slides'>('exam');
  const [examPaper, setExamPaper] = useState<ExamPaper>(INITIAL_EXAM_PAPER);
  const [lessonSlides, setLessonSlides] = useState<LessonSlide[]>(INITIAL_LESSON_SLIDES);

  // Form states for Exam Generator
  const [course, setCourse] = useState('IELTS Intensive Band 7.5+');
  const [level, setLevel] = useState('C1 - Advanced');
  const [topic, setTopic] = useState('Climate Change & Sustainable Technologies');
  const [questionCount, setQuestionCount] = useState(5);
  const [isGeneratingExam, setIsGeneratingExam] = useState(false);
  const [showTeacherAnswers, setShowTeacherAnswers] = useState(true);

  // Form states for Slide Generator
  const [slideTopic, setSlideTopic] = useState('Inversion Structures & Academic Collocations');
  const [slideDuration, setSlideDuration] = useState(45);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);

  // Notifications
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Interactive student test state
  const [studentAnswers, setStudentAnswers] = useState<Record<number, number>>({});
  const [submittedTest, setSubmittedTest] = useState(false);

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (submittedTest) return;
    setStudentAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    examPaper.questions.forEach((q) => {
      if (studentAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: examPaper.questions.length,
      percentage: Math.round((correct / examPaper.questions.length) * 100),
      grade: ((correct / examPaper.questions.length) * 10).toFixed(1),
    };
  };

  const handleGenerateExam = async () => {
    setIsGeneratingExam(true);
    setApiError(null);
    setSubmittedTest(false);
    setStudentAnswers({});

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const { data } = await callGenerateExamPaper({
          course,
          level,
          topic,
          questionCount,
        });

        if (data && data.questions && Array.isArray(data.questions)) {
          setExamPaper(data);
        } else {
          throw new Error('Dữ liệu trả về từ Gemini không đúng cấu trúc đề thi.');
        }
      } else {
        // High quality offline fallback with topic variations
        const generated: ExamPaper = {
          title: `Đề Thi Khảo Sát ${course} - Chủ Đề: ${topic}`,
          course,
          level,
          durationMinutes: questionCount * 3,
          totalPoints: 10,
          matrix: {
            grammarCount: Math.ceil(questionCount * 0.4),
            vocabCount: Math.floor(questionCount * 0.4),
            readingCount: questionCount - Math.ceil(questionCount * 0.4) - Math.floor(questionCount * 0.4),
          },
          questions: Array.from({ length: questionCount }, (_, idx) => ({
            id: idx + 1,
            question: `[${topic}] Question ${idx + 1}: The environmental committee emphasized that unless actionable policies are implemented, the consequences ________ irreversible by 2030.`,
            options: [
              'A. will become',
              'B. would have become',
              'C. became',
              'D. has become'
            ],
            correctAnswer: 0,
            explanation: 'Mệnh đề trạng ngữ chỉ điều kiện với "unless" (loại 1 diễn tả tương lai có thật): unless + S + V(hiện tại), S + will + V-bare.',
            difficulty: idx % 2 === 0 ? 'medium' : 'hard',
            topic: topic
          }))
        };
        setExamPaper(generated);
      }
    } catch (err: any) {
      setApiError(err.message || 'Lỗi khi tạo đề thi.');
    } finally {
      setIsGeneratingExam(false);
    }
  };

  const handleGenerateSlides = async () => {
    setIsGeneratingSlides(true);
    setApiError(null);

    try {
      const apiKey = getStoredApiKey();
      if (apiKey) {
        const { data } = await callGenerateLessonSlides({
          topic: slideTopic,
          level,
          durationMins: slideDuration,
        });

        if (Array.isArray(data) && data.length > 0) {
          setLessonSlides(data);
        }
      } else {
        // Offline slides fallback
        setLessonSlides([
          {
            slideNumber: 1,
            title: `${slideTopic} - Overview & Objectives`,
            type: 'intro',
            bullets: [
              `Mục tiêu: Đạt chuẩn đầu ra ${level} trong ${slideDuration} phút`,
              'Nắm vững 3 cấu trúc trọng tâm và từ vựng chuyên ngành',
              'Thực hành tương tác trực tiếp với giáo viên bản ngữ'
            ],
            teacherNotes: 'Chiếu slide mở đầu và khơi gợi chủ đề qua hình ảnh thực tế.',
            visualRecommendation: 'Infographic phong cách tối giản công nghệ cao.'
          },
          {
            slideNumber: 2,
            title: 'Foundational Grammar & Syntax Patterns',
            type: 'grammar',
            bullets: [
              'Quy tắc ngữ pháp nâng cao theo khung CEFR',
              'Cách tránh các lỗi sai điển hình của học viên Việt Nam',
              'Ví dụ đối chiếu giữa câu phổ thông và câu học thuật'
            ],
            teacherNotes: 'Dành 12 phút giải thích và gọi 2 học sinh đặt câu mẫu.',
            visualRecommendation: 'Bảng so sánh đối xứng 2 cột trực quan.'
          },
          {
            slideNumber: 3,
            title: 'Core Collocations & Lexical Resource',
            type: 'vocabulary',
            bullets: [
              '10 Collocations điểm cao cho bài kiểm tra quốc tế',
              'Phương pháp ghi nhớ bằng Spaced Repetition',
              'Sắc thái ngữ nghĩa trong văn cảnh trang trọng'
            ],
            teacherNotes: 'Cho học viên luyện phát âm theo cặp trong 5 phút.',
            visualRecommendation: 'Word cloud từ vựng và phiên âm IPA.'
          },
          {
            slideNumber: 4,
            title: 'Collaborative Group Practice & Mini-Quiz',
            type: 'practice',
            bullets: [
              'Làm việc theo nhóm 3 người: Giải quyết tình huống thực tế',
              'Ứng dụng ngay từ vựng và ngữ pháp vừa học',
              'Gửi câu trả lời lên hệ thống để AI chấm điểm tức thì'
            ],
            teacherNotes: 'Giảng viên đi vòng quanh các nhóm hỗ trợ giải đáp.',
            visualRecommendation: 'Đồng hồ đếm ngược 15 phút với âm báo nhẹ nhàng.'
          },
          {
            slideNumber: 5,
            title: 'Wrap-up & Actionable Homework Assignment',
            type: 'summary',
            bullets: [
              'Tổng kết các điểm then chốt cần ghi nhớ',
              'Bài tập về nhà trên Moodle LMS và ứng dụng di động',
              'Chuẩn bị cho bài học chuyên sâu tiếp theo'
            ],
            teacherNotes: 'Xác nhận toàn bộ học sinh đã điểm danh FaceID và nhận đề.',
            visualRecommendation: 'Checklist tổng kết với con dấu Trung Kiên EdTech.'
          }
        ]);
      }
    } catch (err: any) {
      setApiError(err.message || 'Lỗi khi tạo dàn ý bài giảng.');
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  // SKILL: docx-official - Export to official Word document (.doc compatible HTML)
  const handleExportWordDoc = () => {
    const questionsHtml = examPaper.questions
      .map(
        (q, idx) => `
      <div style="margin-bottom: 18px; page-break-inside: avoid;">
        <p style="font-weight: bold; margin-bottom: 6px;">Câu ${idx + 1}: ${q.question}</p>
        <div style="margin-left: 20px; line-height: 1.6;">
          ${q.options.map((opt) => `<div>${opt}</div>`).join('')}
        </div>
        ${
          showTeacherAnswers
            ? `
          <div style="margin-top: 6px; padding: 8px 12px; background-color: #f1f5f9; border-left: 3px solid #0284c7; font-size: 11pt; color: #0f172a;">
            <strong>Đáp án đúng:</strong> ${q.options[q.correctAnswer]}<br/>
            <strong>Lời giải chi tiết:</strong> ${q.explanation}
          </div>`
            : ''
        }
      </div>`
      )
      .join('');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${examPaper.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; color: #111; line-height: 1.4; padding: 40px; }
          .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin: 10px 0; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          .meta-table td { padding: 5px; font-size: 11pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <p style="margin: 0; font-size: 11pt; text-transform: uppercase; font-weight: bold;">HỆ THỐNG TRUNG TÂM NGOẠI NGỮ TRUNG KIÊN - SMART EDTECH</p>
          <p style="margin: 3px 0; font-size: 10pt; font-style: italic;">Hệ sinh thái Giáo dục Thông minh · Microservices & AI-driven</p>
          <div class="title">${examPaper.title}</div>
          <p style="margin: 0; font-size: 11pt;">Khóa học: <strong>${examPaper.course}</strong> · Trình độ: <strong>${examPaper.level}</strong></p>
        </div>

        <table class="meta-table" border="1" style="border-color: #cbd5e1;">
          <tr>
            <td style="width: 50%;"><strong>Họ và tên học viên:</strong> ....................................................</td>
            <td style="width: 50%;"><strong>Mã học viên:</strong> .................................</td>
          </tr>
          <tr>
            <td><strong>Thời gian làm bài:</strong> ${examPaper.durationMinutes} phút</td>
            <td><strong>Điểm số:</strong> ............. / ${examPaper.totalPoints} điểm</td>
          </tr>
        </table>

        <div class="content">
          ${questionsHtml}
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 10pt; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 15px;">
          Đề thi được phát hành tự động bởi Trung Kiên Smart EdTech Engine · Bản quyền © 2026 Trung Kiên
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `De_thi_Trung_Kien_${examPaper.level.replace(/[^a-zA-Z0-9]/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopyFeedback('Đã xuất file Word (.doc) theo chuẩn khảo thí Trung Kiên!');
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  // SKILL: moodle-external-api-development - Export to Moodle GIFT format
  const handleExportMoodleGift = () => {
    let giftContent = `// Moodle GIFT format generated by Trung Kien EdTech AI Studio\n// Course: ${examPaper.course} | Level: ${examPaper.level}\n\n`;

    examPaper.questions.forEach((q, idx) => {
      giftContent += `// Question ${idx + 1} (${q.topic})\n`;
      giftContent += `::TK_${examPaper.level}_Q${idx + 1}:: ${q.question} {\n`;
      q.options.forEach((opt, optIdx) => {
        const cleanOpt = opt.replace(/^[A-D]\.\s*/, '');
        if (optIdx === q.correctAnswer) {
          giftContent += `  =${cleanOpt} # ${q.explanation}\n`;
        } else {
          giftContent += `  ~${cleanOpt}\n`;
        }
      });
      giftContent += `}\n\n`;
    });

    const blob = new Blob([giftContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Moodle_Quiz_${examPaper.level.replace(/[^a-zA-Z0-9]/g, '_')}.gift.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopyFeedback('Đã xuất file Moodle GIFT format! Sẵn sàng import vào Moodle Question Bank.');
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  // SKILL: pptx-official - Export Slide Outline
  const handleExportSlidesJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(lessonSlides, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Lesson_Slides_Trung_Kien_${slideTopic.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopyFeedback('Đã xuất Dàn ý Slide (.json) sẵn sàng tích hợp công cụ PowerPoint tự động!');
    setTimeout(() => setCopyFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>AI PEDAGOGICAL CONTENT STUDIO · DOCX · PPTX · MOODLE GIFT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tạo Đề Thi & Dàn Ý Bài Giảng Thông Minh (AI Studio)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tự động biên soạn đề thi chuẩn hóa, ma trận câu hỏi, xuất file Word (.doc/docx) khảo thí, định dạng Moodle GIFT import trực tiếp vào LMS và slide bài giảng PowerPoint.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'exam' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Đề Thi & Moodle GIFT</span>
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'slides' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Dàn Ý Slide Bài Giảng (.pptx)</span>
          </button>
        </div>
      </div>

      {copyFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{copyFeedback}</span>
          </div>
        </div>
      )}

      {apiError && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-700 text-xs text-rose-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{apiError}</span>
          </div>
        </div>
      )}

      {/* TAB 1: EXAM BUILDER */}
      {activeTab === 'exam' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Configuration Panel (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Cấu Hình Khảo Thí AI</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                AI Agent Generator
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Khóa học mục tiêu:
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="IELTS Intensive Band 7.5+">IELTS Intensive Band 7.5+</option>
                  <option value="TOEIC Speed Run 800+">TOEIC Speed Run 800+</option>
                  <option value="Tiếng Anh Giao Tiếp Doanh Nghiệp">Tiếng Anh Giao Tiếp Doanh Nghiệp</option>
                  <option value="Cambridge B2 First (FCE)">Cambridge B2 First (FCE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Trình độ (CEFR / Band):
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="C1 - Advanced (IELTS 7.0 - 8.0)">C1 - Advanced (IELTS 7.0 - 8.0)</option>
                  <option value="B2 - Upper Intermediate (IELTS 5.5 - 6.5)">B2 - Upper Intermediate (IELTS 5.5 - 6.5)</option>
                  <option value="B1 - Intermediate (TOEIC 450 - 650)">B1 - Intermediate (TOEIC 450 - 650)</option>
                  <option value="C2 - Mastery">C2 - Mastery</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chủ đề bài học (Topic / Context):
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="VD: Artificial Intelligence, Climate, Global Trade..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">
                    Số lượng câu hỏi trắc nghiệm:
                  </label>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{questionCount} câu</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerateExam}
                  disabled={isGeneratingExam}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{isGeneratingExam ? 'AI Đang Biên Soạn Đề Thi...' : 'Biên Soạn Đề Thi Mới Bằng AI'}</span>
                </button>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Xuất định dạng đa nền tảng
              </div>
              <button
                onClick={handleExportWordDoc}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tải File Đề Thi Word (.doc)</span>
              </button>
              <button
                onClick={handleExportMoodleGift}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FolderDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Xuất Moodle GIFT (.gift.txt)</span>
              </button>
            </div>
          </div>

          {/* Right Preview & Interactive Panel (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {examPaper.level}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Thời lượng: {examPaper.durationMinutes} phút
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {examPaper.title}
                </h2>
                <div className="text-xs text-slate-400 mt-0.5">
                  Khóa học: <span className="text-slate-200">{examPaper.course}</span> · Tổng điểm:{' '}
                  <span className="text-cyan-400 font-bold">{examPaper.totalPoints} điểm</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowTeacherAnswers(!showTeacherAnswers)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    showTeacherAnswers
                      ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {showTeacherAnswers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showTeacherAnswers ? 'Ẩn Lời Giải' : 'Hiện Lời Giải Giáo Viên'}</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {examPaper.questions.map((q, idx) => {
                const userSelected = studentAnswers[q.id];
                const isAnswered = userSelected !== undefined;
                const isCorrect = userSelected === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="text-sm font-semibold text-slate-100 leading-relaxed">
                          {q.question}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                        {q.difficulty}
                      </span>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-8">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === optIdx;
                        let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (submittedTest) {
                          if (optIdx === q.correctAnswer) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-rose-950/60 border-rose-600 text-rose-300';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-medium';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`p-2.5 rounded-lg border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {submittedTest && optIdx === q.correctAnswer && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Section */}
                    {showTeacherAnswers && (
                      <div className="ml-8 mt-2 p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đáp án đúng: {q.options[q.correctAnswer]}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          <strong className="text-slate-300">Phân tích:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Test Actions Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Đã trả lời: <span className="text-white font-mono font-bold">{Object.keys(studentAnswers).length}</span> / {examPaper.questions.length} câu
              </div>

              <div className="flex items-center gap-3">
                {!submittedTest ? (
                  <button
                    onClick={() => setSubmittedTest(true)}
                    disabled={Object.keys(studentAnswers).length === 0}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-40 shadow-sm"
                  >
                    Nộp Bài & Chấm Điểm Thử
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 rounded-lg text-xs font-mono text-emerald-300">
                      Kết quả: <strong>{calculateScore().correct} / {calculateScore().total} câu</strong> ({calculateScore().grade} điểm · {calculateScore().percentage}%)
                    </div>
                    <button
                      onClick={() => {
                        setSubmittedTest(false);
                        setStudentAnswers({});
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Làm Lại
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LESSON SLIDES BUILDER (SKILL: pptx-official) */}
      {activeTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Presentation className="w-4 h-4 text-cyan-400" />
                <span>Thiết Kế Slide Bài Giảng</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                PPTX Generator
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Chủ đề bài giảng:
                </label>
                <input
                  type="text"
                  value={slideTopic}
                  onChange={(e) => setSlideTopic(e.target.value)}
                  placeholder="VD: IELTS Writing Task 2, Job Interview Skills..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Thời lượng bài giảng:
                </label>
                <select
                  value={slideDuration}
                  onChange={(e) => setSlideDuration(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value={30}>30 phút (Speed Session)</option>
                  <option value={45}>45 phút (Chuẩn 1 tiết học)</option>
                  <option value={90}>90 phút (Block 2 tiết)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerateSlides}
                  disabled={isGeneratingSlides}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{isGeneratingSlides ? 'AI Đang Soạn Slide...' : 'Tạo Dàn Ý Bài Giảng Mới'}</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={handleExportSlidesJSON}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Xuất Dàn Ý Slide (.json / pptx schema)</span>
              </button>
            </div>
          </div>

          {/* Slides Carousel / List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>BẢNG DÀN Ý SLIDE GIẢNG DẠY ({lessonSlides.length} SLIDES)</span>
              <span>CHUẨN KHUNG SƯ PHẠM TRUNG KIÊN</span>
            </div>

            <div className="space-y-4">
              {lessonSlides.map((slide, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-cyan-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 font-mono font-bold text-xs flex items-center justify-center">
                        #{slide.slideNumber}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {slide.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {slide.type}
                    </span>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1.5 pl-9">
                    {slide.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* Teacher notes & Visual guidance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 pl-9 text-[11px]">
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-400">
                      <strong className="text-amber-400 block mb-0.5 font-medium">Ghi chú Sư phạm:</strong>
                      <span>{slide.teacherNotes}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-400">
                      <strong className="text-cyan-400 block mb-0.5 font-medium">Gợi ý Visual Slide:</strong>
                      <span>{slide.visualRecommendation}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
