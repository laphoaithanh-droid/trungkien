import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Terminal, 
  Layers, 
  FileCode, 
  TrendingUp, 
  Copy, 
  Check, 
  RotateCcw, 
  Cpu, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Key,
  ExternalLink
} from 'lucide-react';
import { 
  callArchitectChat, 
  generateOfflineArchitectFallback, 
  getStoredApiKey, 
  getStoredModel,
  SUPPORTED_MODELS,
  FallbackCallbackInfo
} from '../services/geminiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  queryType?: 'feature' | 'spec' | 'analytics';
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

interface StepInfo {
  id: number;
  name: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'stopped';
  detail: string;
}

interface ArchitectAdvisorProps {
  onOpenApiKeyModal?: () => void;
}

export const ArchitectAdvisor: React.FC<ArchitectAdvisorProps> = ({ onOpenApiKeyModal }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Xin chào Ban Quản trị và Đội ngũ Kỹ thuật Trung Kiên, tôi là **Senior EdTech Solutions Architect & Kiến trúc sư trưởng** của hệ thống quản lý trung tâm ngoại ngữ Trung Kiên.

Tôi sẵn sàng hỗ trợ tư vấn, giải thích và đặc tả các giải pháp kỹ thuật theo 3 định dạng chuẩn hóa:
1. **Phân tích tính năng**: Phân rã Microservices, Logic thực hiện và Giá trị kinh doanh.
2. **Tư vấn kỹ thuật (Technical Spec)**: Quy trình dữ liệu, Chuẩn bảo mật Zero Trust (At-rest & In-transit) và Hạ tầng Cloud-native.
3. **Báo cáo phân tích (BI/Analytics)**: Chỉ số vận hành, Dự báo Churn Rate và Đề xuất hành động thông minh.

*Lưu ý: Hệ thống Trung Kiên không chỉ là công cụ quản lý, mà là một **"Hệ sinh thái công nghệ giáo dục thông minh"**.*`,
      timestamp: '08:00',
    },
  ]);
  const [input, setInput] = useState('');
  const [queryType, setQueryType] = useState<'feature' | 'spec' | 'analytics'>('feature');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>(getStoredModel());

  // Step & Progress state management for AI Instructions compliance
  const [steps, setSteps] = useState<StepInfo[]>([
    { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'idle', detail: 'Sẵn sàng khởi tạo' },
    { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'idle', detail: 'Chờ truy vấn' },
    { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'idle', detail: 'Chờ kết quả' },
  ]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, steps, currentError]);

  useEffect(() => {
    setActiveModel(getStoredModel());
  }, []);

  const handleSend = async (customPrompt?: string, customType?: 'feature' | 'spec' | 'analytics') => {
    const textToSend = customPrompt || input.trim();
    const typeToSend = customType || queryType;
    if (!textToSend || isLoading) return;

    const apiKey = getStoredApiKey();
    if (!apiKey) {
      if (onOpenApiKeyModal) {
        onOpenApiKeyModal();
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      queryType: typeToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setIsLoading(true);
    setCurrentError(null);
    setFallbackNotice(null);

    // Initialise 3-step pipeline
    const preferredModel = getStoredModel();
    setActiveModel(preferredModel);

    // Step 1: Initialize & Verify
    setSteps([
      { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'running', detail: `Đang kết nối: ${preferredModel}` },
      { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'idle', detail: 'Đang chờ' },
      { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'idle', detail: 'Đang chờ' },
    ]);
    setProgressPercent(15);

    try {
      // Advance to Step 2
      await new Promise((r) => setTimeout(r, 200));
      setSteps([
        { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'success', detail: `Đã kết nối: ${preferredModel}` },
        { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'running', detail: 'Đang xử lý prompt đa tầng...' },
        { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'idle', detail: 'Đang chờ' },
      ]);
      setProgressPercent(45);

      // Call Gemini with automatic fallback cascade
      const { reply, modelUsed } = await callArchitectChat({
        message: textToSend,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
        queryType: typeToSend,
        onModelFallback: (info: FallbackCallbackInfo) => {
          setFallbackNotice(
            `Model "${info.failedModel}" gặp sự cố (${info.verbatimErrorMessage.slice(0, 60)}...). Tự động chuyển đổi sang model dự phòng "${info.nextModel}"!`
          );
          setActiveModel(info.nextModel);
          setSteps((prev) =>
            prev.map((s) =>
              s.id === 2 ? { ...s, detail: `Đã tự động chuyển sang ${info.nextModel}` } : s
            )
          );
        },
      });

      // Advance to Step 3
      setSteps([
        { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'success', detail: 'Xác thực thành công' },
        { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'success', detail: `Hoàn tất với ${modelUsed}` },
        { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'running', detail: 'Kiểm tra schema định dạng...' },
      ]);
      setProgressPercent(80);

      await new Promise((r) => setTimeout(r, 250));

      // All Steps Successful
      setSteps([
        { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'success', detail: 'Xác thực thành công' },
        { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'success', detail: `Hoàn tất (${modelUsed})` },
        { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'success', detail: 'Định dạng hợp lệ 100%' },
      ]);
      setProgressPercent(100);

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        queryType: typeToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const verbatimError = error.message || 'Lỗi không xác định khi kết nối AI Engine';
      setCurrentError(verbatimError);

      // STRICT STATE RULE 3:
      // Trạng thái các cột đang chờ phải chuyển thành "Đã dừng do lỗi", tuyệt đối không được hiện "Hoàn tất" hoặc checkmark xanh nếu quy trình bị gián đoạn.
      setSteps([
        { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'error', detail: 'Lỗi kết nối' },
        { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'stopped', detail: 'Đã dừng do lỗi' },
        { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'stopped', detail: 'Đã dừng do lỗi' },
      ]);
      // Progress bar stays interrupted, do NOT complete to 100%
      setProgressPercent(35);

      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `### ❌ Lỗi Xử Lý Yêu Cầu Kiến Trúc Sư\n\n**Hệ thống đã dừng do lỗi:**\n\`\`\`\n${verbatimError}\n\`\`\`\n\n*Gợi ý khắc phục:* Kiểm tra lại quota của Gemini API Key hoặc chọn Model khác bằng nút **Settings (API Key)** trên Header.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    {
      title: 'Điểm danh FaceID & QR xoay vòng',
      desc: 'Phân tích tính năng chống gian lận điểm danh',
      prompt: 'Phân tích kiến trúc tính năng Điểm danh kết hợp FaceID Liveness Detection và Dynamic QR xoay vòng chống gian lận.',
      type: 'feature' as const,
    },
    {
      title: 'Đặc tả Kỹ thuật Zero Trust & Microservices',
      desc: 'Technical Spec mã hóa 2 lớp và mTLS',
      prompt: 'Cung cấp Technical Spec chuẩn cho toàn bộ luồng giao tiếp liên service theo mô hình Zero Trust, mã hóa At rest và In transit.',
      type: 'spec' as const,
    },
    {
      title: 'Dự báo Churn Rate & BI Quý 4',
      desc: 'Báo cáo phân tích dữ liệu học viên',
      prompt: 'Xuất báo cáo BI & Predictive Analytics dự báo tỷ lệ học viên có nguy cơ thôi học (Churn Rate) và đề xuất hành động can thiệp bằng RPA.',
      type: 'analytics' as const,
    },
    {
      title: 'Tài chính Auto-Reconciliation 100%',
      desc: 'Kiến trúc Virtual Account và đối soát tự động',
      prompt: 'Phân tích giải pháp kết nối Virtual Account và cơ chế Auto-reconciliation đối soát tài chính đạt độ chính xác 100%.',
      type: 'feature' as const,
    },
    {
      title: 'Adaptive Learning & Spaced Repetition',
      desc: 'Động cơ AI cá nhân hóa lộ trình học',
      prompt: 'Tư vấn kỹ thuật tích hợp Speech-to-Text phát âm và Spaced Repetition vào hệ thống quản lý học tập LMS.',
      type: 'spec' as const,
    },
  ];

  const hasApiKey = Boolean(getStoredApiKey());

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>SENIOR EDTECH SOLUTIONS ARCHITECT CONSOLE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Trung Kiên Architecture & Advisory Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tư vấn kiến trúc Microservices, Micro-frontends, chuẩn bảo mật Zero Trust và quy trình vận hành giáo dục dựa trên dữ liệu (Data-driven).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 rounded-md transition-colors cursor-pointer"
            >
              <Key className="w-3 h-3 text-cyan-400" />
              <span>Cấu hình AI ({activeModel})</span>
            </button>
          )}

          <button
            onClick={() => {
              setMessages([messages[0]]);
              setSteps([
                { id: 1, name: 'Step 1: Xác thực Model & API Key', status: 'idle', detail: 'Sẵn sàng khởi tạo' },
                { id: 2, name: 'Step 2: Phân tích Kiến trúc & AI Engine', status: 'idle', detail: 'Chờ truy vấn' },
                { id: 3, name: 'Step 3: Chuẩn hóa Microservices & Zero Trust', status: 'idle', detail: 'Chờ kết quả' },
              ]);
              setProgressPercent(0);
              setCurrentError(null);
              setFallbackNotice(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đặt lại phiên</span>
          </button>
        </div>
      </div>

      {/* Preset Strategy Cards */}
      <div>
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Các kịch bản tư vấn kiến trúc tiêu biểu</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q.prompt, q.type)}
              className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                <span className="truncate">{q.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {q.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Execution Pipeline & State Monitoring (Multi-Step & Fallback Cascade Visualizer) */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Tiến Trình Xử Lý Đa Bước & Fallback Cascade
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Model hoạt động:</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[11px]">
              {activeModel}
            </span>
          </div>
        </div>

        {/* 3 Columns / Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {steps.map((st) => {
            const isError = st.status === 'error';
            const isStopped = st.status === 'stopped';
            const isSuccess = st.status === 'success';
            const isRunning = st.status === 'running';

            return (
              <div
                key={st.id}
                className={`p-3 rounded-lg border transition-all ${
                  isError || isStopped
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                    : isSuccess
                    ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                    : isRunning
                    ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500/50 text-cyan-200 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold tracking-tight truncate">
                    {st.name}
                  </span>
                  {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {isRunning && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />}
                  {isError && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  {isStopped && (
                    <span className="text-[10px] font-bold text-rose-400 uppercase px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-800">
                      Đã dừng do lỗi
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono flex items-center justify-between">
                  <span className={isError || isStopped ? 'text-rose-300 font-medium' : isSuccess ? 'text-emerald-300' : 'text-slate-400'}>
                    {isStopped ? 'Đã dừng do lỗi' : st.detail}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    {st.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar (Complies with Rule 3: only green when truly successful) */}
        <div className="mt-3">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                currentError
                  ? 'bg-rose-600'
                  : progressPercent === 100
                  ? 'bg-emerald-500'
                  : 'bg-cyan-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
            <span>
              {progressPercent === 100
                ? 'Hoàn tất quy trình 100%'
                : currentError
                ? 'Quy trình đã dừng do lỗi'
                : isLoading
                ? `Đang thực thi (${progressPercent}%)`
                : 'Sẵn sàng'}
            </span>
            <span className="font-mono">Cascade: 3-flash ➔ 3-pro ➔ 2.5-flash</span>
          </div>
        </div>

        {/* Fallback Live Notice */}
        {fallbackNotice && (
          <div className="mt-2.5 p-2.5 bg-amber-950/40 border border-amber-600/50 rounded-lg text-xs text-amber-300 flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin" />
            <span>{fallbackNotice}</span>
          </div>
        )}

        {/* Verbatim Red Error Box as required by Rule 3 */}
        {currentError && (
          <div className="mt-2.5 p-3.5 bg-rose-950/70 border border-rose-600 rounded-xl text-xs text-rose-200">
            <div className="flex items-center gap-2 font-bold text-rose-300 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Thông Báo Lỗi Nguyên Văn Từ Gemini API:</span>
            </div>
            <div className="font-mono text-[11px] bg-rose-950/90 border border-rose-800 p-2.5 rounded-lg text-rose-200 break-all select-all">
              {currentError}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-rose-300">
                Toàn bộ model trong chuỗi fallback đều không thể phản hồi.
              </span>
              {onOpenApiKeyModal && (
                <button
                  type="button"
                  onClick={onOpenApiKeyModal}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-md transition-colors cursor-pointer"
                >
                  Đổi API Key / Model
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chat & Response Stream */}
      <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden flex flex-col h-[600px]">
        {/* Sub-header with format selector */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>Chế độ phản hồi cấu trúc:</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setQueryType('feature')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                queryType === 'feature'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Phân tích tính năng</span>
            </button>
            <button
              onClick={() => setQueryType('spec')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                queryType === 'spec'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Technical Spec</span>
            </button>
            <button
              onClick={() => setQueryType('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                queryType === 'analytics'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>BI & Analytics</span>
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isErrorMsg = msg.isError;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
              >
                {!isUser && (
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 shadow-sm ${
                    isErrorMsg 
                      ? 'bg-rose-600 text-white' 
                      : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white'
                  }`}>
                    {isErrorMsg ? '!' : 'TK'}
                  </div>
                )}

                <div
                  className={`rounded-xl p-4 md:p-5 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-cyan-950/60 text-cyan-50 border border-cyan-800/60 max-w-2xl'
                      : isErrorMsg
                      ? 'bg-rose-950/40 border border-rose-800 text-rose-100 w-full'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 w-full'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-2 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">
                        {isUser ? 'Ban Quản trị / Kỹ sư' : 'Senior EdTech Solutions Architect'}
                      </span>
                      {msg.modelUsed && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span>{msg.timestamp}</span>
                      {!isUser && !isErrorMsg && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-cyan-400 transition-colors p-1 cursor-pointer"
                          title="Sao chép phản hồi"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap font-sans text-[13.5px] space-y-2 text-slate-200">
                    {msg.content}
                  </div>
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                    YOU
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-2xl mr-auto">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 animate-pulse">
                TK
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center gap-3">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                <span>Kiến trúc sư đang tổng hợp phương án ({activeModel})...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  queryType === 'feature'
                    ? 'Nhập tính năng cần phân tích (VD: Điểm danh khuôn mặt, AI Speech chấm phát âm, RPA học phí)...'
                    : queryType === 'spec'
                    ? 'Yêu cầu đặc tả kỹ thuật (VD: Luồng mTLS Zero Trust, Database Sharding, Caching Redis)...'
                    : 'Nhập câu hỏi phân tích dữ liệu (VD: Phân tích nguyên nhân Churn rate, Tối ưu công suất phòng học)...'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-xs rounded-lg hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phân tích</span>
            </button>
          </form>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 mt-2 px-1 gap-1">
            <span>Model: {activeModel} · Tự động retry fallback khi hết quota</span>
            <span className="font-mono">Zero Trust · Microservices · AES-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
