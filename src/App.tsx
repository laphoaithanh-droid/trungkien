import React, { useState, useEffect } from 'react';
import { NavTab } from './types';
import { Navbar } from './components/Navbar';
import { ArchitectAdvisor } from './components/ArchitectAdvisor';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { SmartScheduler } from './components/SmartScheduler';
import { SmartAttendance } from './components/SmartAttendance';
import { FinanceHub } from './components/FinanceHub';
import { AdaptiveLearning } from './components/AdaptiveLearning';
import { BlockchainCredentials } from './components/BlockchainCredentials';
import { StudentManagement } from './components/StudentManagement';
import { ExamStudio } from './components/ExamStudio';
import { EduGameArena } from './components/EduGameArena';
import { MoodleHub } from './components/MoodleHub';
import { ApiKeyModal } from './components/ApiKeyModal';
import logoImg from './assets/logo.png';
import { getStoredApiKey, getStoredModel } from './services/geminiService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('architect');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [activeModel, setActiveModel] = useState('gemini-3-flash-preview');

  useEffect(() => {
    const key = getStoredApiKey();
    const model = getStoredModel();
    setHasApiKey(Boolean(key));
    setActiveModel(model);

    // AI Instructions requirement: Khi chưa có key, hiển thị Modal bắt buộc nhập
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const handleKeySaved = () => {
    const key = getStoredApiKey();
    const model = getStoredModel();
    setHasApiKey(Boolean(key));
    setActiveModel(model);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar with One-Row, 3-Zone Contract */}
      <Navbar 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
        activeModelName={activeModel}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 lg:px-8 py-6 md:py-8">
        {currentTab === 'architect' && (
          <ArchitectAdvisor onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        )}
        {currentTab === 'exam_studio' && (
          <ExamStudio onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        )}
        {currentTab === 'edu_game' && <EduGameArena />}
        {currentTab === 'moodle_hub' && <MoodleHub />}
        {currentTab === 'dashboard' && <ExecutiveDashboard />}
        {currentTab === 'architecture' && <ArchitectureViewer />}
        {currentTab === 'scheduler' && <SmartScheduler />}
        {currentTab === 'attendance' && <SmartAttendance />}
        {currentTab === 'finance' && <FinanceHub />}
        {currentTab === 'adaptive' && (
          <AdaptiveLearning onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)} />
        )}
        {currentTab === 'blockchain' && <BlockchainCredentials />}
        {currentTab === 'students' && <StudentManagement />}
      </main>

      {/* Clean Enterprise Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 lg:px-8 mt-12">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#FFE600] p-0.5 flex items-center justify-center shrink-0">
                <img 
                  src={logoImg} 
                  alt="Trung Kien English Center Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-semibold text-slate-400">
                TRUNG KIÊN EDTECH SOLUTIONS ARCHITECT
              </span>
            </div>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Hệ sinh thái công nghệ giáo dục thông minh</span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span className="font-mono">Microservices & Zero Trust</span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-slate-500">
            <span>At-rest: AES-256</span>
            <span aria-hidden="true">/</span>
            <span>In-transit: TLS 1.3 mTLS</span>
            <span aria-hidden="true">/</span>
            <span>Blockchain: SHA-256 Merkle</span>
          </div>
        </div>
      </footer>

      {/* Global API Key & Model Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        forceRequired={!hasApiKey}
        onSaveSuccess={handleKeySaved}
      />
    </div>
  );
}
