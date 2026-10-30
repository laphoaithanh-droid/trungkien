import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import { 
  Key, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldCheck, 
  RefreshCw,
  Trash2,
  Cpu
} from 'lucide-react';
import { 
  SUPPORTED_MODELS, 
  DEFAULT_MODEL_ID, 
  getStoredApiKey, 
  saveStoredApiKey, 
  removeStoredApiKey, 
  getStoredModel, 
  saveStoredModel,
  testGeminiApiKey 
} from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceRequired?: boolean;
  onSaveSuccess?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  forceRequired = false,
  onSaveSuccess,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string>('');
  const [savedSuccessToast, setSavedSuccessToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKeyInput(getStoredApiKey());
      setSelectedModel(getStoredModel());
      setTestState('idle');
      setTestError('');
      setSavedSuccessToast(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasExistingKey = Boolean(getStoredApiKey());

  const handleTestKey = async () => {
    if (!apiKeyInput.trim()) {
      setTestState('error');
      setTestError('Vui lòng nhập API Key trước khi kiểm tra.');
      return;
    }
    setTestState('testing');
    setTestError('');

    const res = await testGeminiApiKey(apiKeyInput.trim(), selectedModel);
    if (res.success) {
      setTestState('success');
    } else {
      setTestState('error');
      setTestError(res.error || 'Xác thực API Key thất bại.');
    }
  };

  const handleSave = () => {
    if (!apiKeyInput.trim()) {
      setTestState('error');
      setTestError('Vui lòng nhập API Key để tiếp tục sử dụng hệ thống.');
      return;
    }

    saveStoredApiKey(apiKeyInput.trim());
    saveStoredModel(selectedModel);

    setSavedSuccessToast(true);
    setTimeout(() => {
      setSavedSuccessToast(false);
      onSaveSuccess?.();
      onClose();
    }, 700);
  };

  const handleClearKey = () => {
    removeStoredApiKey();
    setApiKeyInput('');
    setTestState('idle');
    setTestError('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setApiKeyInput(text.trim());
      }
    } catch (e) {
      // clipboard permission denied or not supported
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Thiết lập Model & API Key
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Zero Trust
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Nhập Google Gemini API Key của bạn để vận hành toàn bộ tính năng AI thông minh
              </p>
            </div>
          </div>

          {!forceRequired && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Centered Brand Logo (Auth Header) */}
          <div className="flex flex-col items-center justify-center pt-1 pb-2 text-center">
            <div className="h-20 w-20 rounded-2xl bg-[#FFE600] p-2 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/60 mb-2.5">
              <img 
                src={logoImg} 
                alt="Trung Kien English Center Logo" 
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
              TRUNG TÂM NGOẠI NGỮ TRUNG KIÊN
            </h3>
            <p className="text-[11px] font-mono text-cyan-400 mt-0.5">
              HỆ SINH THÁI GIÁO DỤC THÔNG MINH · ZERO TRUST AUTH
            </p>
          </div>

          {/* Instruction & Link Banner */}
          <div className="bg-rose-950/40 border border-rose-600/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-300">
                  Lấy API key để sử dụng app:
                </span>{' '}
                <span className="text-slate-300">
                  Nếu bạn chưa có key, hãy truy cập Google AI Studio để tạo key hoàn toàn miễn phí.
                </span>
              </div>
            </div>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg shrink-0 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Lấy API Key ngay</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Model Selection (Cards) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. Chọn Model AI Mặc Định</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Thứ tự fallback tự động 1 ➔ 2 ➔ 3
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUPPORTED_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className={`relative text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-500 ring-1 ring-cyan-500/60 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${model.badgeColor}`}>
                          {model.tag}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white tracking-tight mt-1">
                        {model.name}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {model.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-500">
                      ID: {model.id}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fallback explanation box */}
            <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                <strong>Cơ chế Retry & Fallback:</strong> Nếu model được chọn gặp lỗi quá tải quota (429), hệ thống tự động retry liền mạch với các model kế tiếp trong chuỗi.
              </span>
            </div>
          </div>

          {/* API Key Input Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Dán Google Gemini API Key</span>
              </label>
              {hasExistingKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa key đã lưu</span>
                </button>
              )}
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => {
                  setApiKeyInput(e.target.value);
                  setTestState('idle');
                  setTestError('');
                }}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-4 py-3 text-xs sm:text-sm font-mono text-white placeholder-slate-600 transition-colors pr-24"
              />

              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors cursor-pointer"
                  title="Dán từ Clipboard"
                >
                  Dán
                </button>
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors cursor-pointer"
                  title={showKey ? 'Ẩn key' : 'Hiện key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Test status banner */}
            {testState === 'testing' && (
              <div className="mt-2.5 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-300 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Đang gửi gói tin kiểm tra đến Google Gemini API...</span>
              </div>
            )}

            {testState === 'success' && (
              <div className="mt-2.5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>API Key hợp lệ! Đã kết nối thành công với Google AI Studio.</span>
              </div>
            )}

            {testState === 'error' && (
              <div className="mt-2.5 p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-xs text-rose-200 flex flex-col gap-1">
                <div className="flex items-center gap-2 font-semibold text-rose-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Xác thực thất bại - Thông báo lỗi từ API:</span>
                </div>
                <div className="font-mono text-[11px] bg-rose-950/80 p-2 rounded border border-rose-800 text-rose-200 overflow-x-auto">
                  {testError}
                </div>
              </div>
            )}

            {/* Privacy note */}
            <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Khóa API được mã hóa và lưu trực tiếp trong localStorage của trình duyệt bạn.</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testState === 'testing' || !apiKeyInput.trim()}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testState === 'testing' ? 'animate-spin' : ''}`} />
            <span>Kiểm tra kết nối (Test Key)</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!forceRequired && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedSuccessToast ? (
                <>
                  <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                  <span>Đã lưu thành công!</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-slate-950" />
                  <span>Lưu & Kích hoạt Model</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
