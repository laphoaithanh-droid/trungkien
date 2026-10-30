import React from 'react';
import { NavTab } from '../types';
import logoImg from '../assets/logo.png';
import { 
  Cpu, 
  BarChart3, 
  Calendar, 
  ScanFace, 
  Wallet, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  BotMessageSquare,
  Key,
  ExternalLink,
  GraduationCap,
  Gamepad2,
  Server
} from 'lucide-react';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  activeModelName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab,
  onOpenApiKeyModal,
  hasApiKey,
  activeModelName = 'Gemini 3 Flash'
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ElementType; isNew?: boolean }[] = [
    { id: 'architect', label: 'Kiến trúc sư Trợ lý', icon: BotMessageSquare },
    { id: 'exam_studio', label: 'Tạo Đề Thi & Slide', icon: GraduationCap, isNew: true },
    { id: 'edu_game', label: 'Đấu Trí Từ Vựng', icon: Gamepad2, isNew: true },
    { id: 'moodle_hub', label: 'Moodle LMS Hub', icon: Server, isNew: true },
    { id: 'adaptive', label: 'Adaptive Learning AI', icon: Sparkles },
    { id: 'dashboard', label: 'BI & Dự báo Churn', icon: BarChart3 },
    { id: 'students', label: 'Học viên & Fuzzy Dedup', icon: Users },
    { id: 'attendance', label: 'FaceID & Dynamic QR', icon: ScanFace },
    { id: 'scheduler', label: 'Xếp lịch Thông minh', icon: Calendar },
    { id: 'finance', label: 'Auto-Reconciliation', icon: Wallet },
    { id: 'blockchain', label: 'Chứng chỉ Blockchain', icon: ShieldCheck },
    { id: 'architecture', label: 'Microservices Topo', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark with Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onSelectTab('architect'); }}
          className="group flex items-center gap-2.5 sm:gap-3 shrink-0 transition-all hover:opacity-95"
          title="Về Trang chủ / Bảng điều khiển Trung Kiên EdTech"
        >
          {/* Logo container: Yellow (#FFE600) bg with rounded edges and gentle shadow */}
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-[#FFE600] p-1 flex items-center justify-center shadow-md shadow-amber-500/10 ring-1 ring-amber-400/50 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img 
              src={logoImg} 
              alt="Trung Kien English Center Logo" 
              className="h-full w-full object-contain rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm lg:text-base font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1.5 leading-tight">
              TRUNG KIÊN EDTECH
            </span>
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase hidden sm:inline leading-none mt-0.5">
              Hệ Sinh Thái Giáo Dục
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-1 overflow-x-auto py-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" title="Tính năng mới từ SKILL"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & API Key Settings */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Permanent Red Prompt to obtain API Key as required by AI Instructions */}
          <a
            href="https://aistudio.google.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] sm:text-xs font-bold text-rose-300 bg-rose-950/80 hover:bg-rose-900 border border-rose-600/70 rounded-md transition-all shadow-xs cursor-pointer group"
            title="Nhận Google Gemini API Key miễn phí tại Google AI Studio"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 group-hover:animate-ping"></span>
            <span className="text-rose-400 font-semibold">Lấy API key để sử dụng app</span>
            <ExternalLink className="w-3 h-3 text-rose-400 shrink-0 ml-0.5" />
          </a>

          {/* Settings (API Key) Modal Trigger Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer shadow-xs ${
              hasApiKey
                ? 'bg-slate-900 hover:bg-slate-850 text-slate-200 border-slate-700 hover:border-cyan-500/50'
                : 'bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border-amber-600/60 animate-pulse'
            }`}
            title="Cấu hình Model & Quản lý API Key"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Settings (API Key)</span>
            <span className="sm:hidden">API Key</span>
            {hasApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" title="Key sẵn sàng"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Chưa nhập key"></span>
            )}
          </button>

          {/* Shortcut to Architect Tab */}
          <button
            onClick={() => onSelectTab('architect')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-md hover:from-cyan-300 hover:to-teal-300 transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BotMessageSquare className="w-3.5 h-3.5 text-slate-950" />
            <span>Tư vấn Kỹ thuật AI</span>
          </button>
        </div>
      </div>

      {/* Sub-bar for Tab Navigation on screens < 2xl */}
      <div className="2xl:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-slate-900 bg-slate-950/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.isNew && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
