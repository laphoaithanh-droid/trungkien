import React, { useState } from 'react';
import { INITIAL_MOODLE_COURSES, INITIAL_MOODLE_LOGS } from '../data/mockData';
import { MoodleCourse, MoodleSyncLog } from '../types';
import { 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Database, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Terminal,
  Activity,
  FileCode,
  Zap,
  Lock
} from 'lucide-react';

export const MoodleHub: React.FC = () => {
  const [courses, setCourses] = useState<MoodleCourse[]>(INITIAL_MOODLE_COURSES);
  const [logs, setLogs] = useState<MoodleSyncLog[]>(INITIAL_MOODLE_LOGS);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [apiResponsePreview, setApiResponsePreview] = useState<{
    functionName: string;
    requestUrl: string;
    payload: any;
    response: any;
  }>({
    functionName: 'core_course_get_courses',
    requestUrl: 'https://moodle.trungkien.edu.vn/webservice/rest/server.php?wstoken=tk_sec_token_9f82&wsfunction=core_course_get_courses&moodlewsrestformat=json',
    payload: { options: { ids: [101, 102, 103, 104] } },
    response: {
      status: '200 OK',
      courses_count: 4,
      server_time: new Date().toISOString(),
      tls_version: 'TLS 1.3 mTLS',
      zero_trust_status: 'verified'
    }
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleTriggerMoodleSync = (funcName: string, description: string) => {
    setIsSyncing(funcName);
    setNotification(null);

    setTimeout(() => {
      const recordsCount = Math.floor(5 + Math.random() * 15);
      const latency = Math.floor(85 + Math.random() * 95);

      const newLog: MoodleSyncLog = {
        id: `sync-${Date.now()}`,
        apiFunction: funcName,
        entity: description,
        status: 'success',
        recordsSynced: recordsCount,
        latencyMs: latency,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLogs((prev) => [newLog, ...prev]);

      let simulatedResponse = {};
      if (funcName === 'core_user_create_users') {
        simulatedResponse = {
          success: true,
          users_created: [
            { id: 4892, username: 'nguyen.van.an', email: 'an.nguyen@trungkien.edu.vn', moodle_id: 1089 },
            { id: 4893, username: 'tran.thi.thuha', email: 'thuha.ielts@trungkien.edu.vn', moodle_id: 1090 },
          ],
          auth_method: 'oauth2_zero_trust',
        };
      } else if (funcName === 'core_grades_update_grades') {
        simulatedResponse = {
          success: true,
          course_id: 101,
          grade_items_updated: recordsCount,
          average_score: '8.2 / 10',
          auto_reconciled: true,
        };
      } else {
        simulatedResponse = {
          success: true,
          quiz_id: 'QZ-2026-UNIT4',
          questions_imported: recordsCount,
          gift_format_parsed: true,
        };
      }

      setApiResponsePreview({
        functionName: funcName,
        requestUrl: `https://moodle.trungkien.edu.vn/webservice/rest/server.php?wstoken=tk_sec_token_9f82&wsfunction=${funcName}&moodlewsrestformat=json`,
        payload: {
          timestamp: Date.now(),
          client_id: 'trung-kien-crm-edge',
          records_count: recordsCount,
        },
        response: simulatedResponse,
      });

      setIsSyncing(null);
      setNotification(`Đồng bộ thành công qua Moodle API [${funcName}]: ${recordsCount} bản ghi cập nhật trong ${latency}ms.`);
      setTimeout(() => setNotification(null), 5000);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Server className="w-3.5 h-3.5" />
            <span>MOODLE CORE WEB SERVICES & REALTIME LMS INTEGRATION HUB</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Trung Tâm Tích Hợp Moodle LMS (External API Hub)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Quản trị kết nối hai chiều giữa Trung Kiên EdTech và Moodle LMS: Đồng bộ tài khoản học sinh, bài tập chấm điểm tự động bằng AI và đẩy đề thi trực tiếp vào Moodle Question Bank.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Moodle Gateway: Connected (mTLS)</span>
          </div>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-700 text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* KPI Top Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Khóa học Moodle Đang Chạy</div>
          <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
            {courses.length} Khóa Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">94 học viên đồng bộ tự động</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Độ trễ Đồng bộ (Sync Latency)</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            ~120 ms
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">P99 SLA &lt; 250ms</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Giao thức Bảo mật API</div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            Zero Trust Token
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Bearer + HMAC-SHA256 Sig</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Cơ chế Hàng đợi (Queue)</div>
          <div className="text-xl font-bold font-mono text-indigo-400 mt-1">
            Kafka Event Bus
          </div>
          <div className="text-[11px] text-slate-500 mt-1">At-least-once delivery</div>
        </div>
      </div>

      {/* Main Grid: Moodle Action Triggers & API Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Action Triggers & Courses (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Quick API Action Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Kích Hoạt Web Service APIs Moodle</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                REST / JSON
              </span>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleTriggerMoodleSync('core_user_create_users', 'Đồng bộ học viên mới từ CRM sang Moodle')}
                disabled={Boolean(isSyncing)}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    1. core_user_create_users
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Tạo tài khoản và phân quyền học viên tự động trên Moodle LMS
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {isSyncing === 'core_user_create_users' ? 'Đang gọi...' : 'Kích hoạt'}
                </span>
              </button>

              <button
                onClick={() => handleTriggerMoodleSync('core_grades_update_grades', 'Đồng bộ điểm thi & chuyên cần vào Moodle Gradebook')}
                disabled={Boolean(isSyncing)}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    2. core_grades_update_grades
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Cập nhật điểm chấm luận OCR & điểm thi nói AI vào sổ điểm Moodle
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {isSyncing === 'core_grades_update_grades' ? 'Đang gọi...' : 'Kích hoạt'}
                </span>
              </button>

              <button
                onClick={() => handleTriggerMoodleSync('mod_quiz_add_quiz_question_instance', 'Đẩy câu hỏi trắc nghiệm mới vào bài thi Quiz')}
                disabled={Boolean(isSyncing)}
                className="w-full p-3 bg-slate-950/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    3. mod_quiz_add_quiz_question_instance
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Import tự động ngân hàng câu hỏi GIFT format vào đề thi trực tuyến
                  </div>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {isSyncing === 'mod_quiz_add_quiz_question_instance' ? 'Đang gọi...' : 'Kích hoạt'}
                </span>
              </button>
            </div>
          </div>

          {/* Synced Moodle Courses List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Danh Sách Khóa Học Moodle Đồng Bộ</span>
              <span className="text-xs font-mono text-cyan-400">{courses.length} Lớp</span>
            </h3>

            <div className="space-y-2">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{c.fullname}</div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Code: <span className="text-cyan-400">{c.shortname}</span> · ID Moodle: {c.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px]">
                      {c.enrolledStudentsCount} Học viên
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">{c.syncedAt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-time API Inspector & Sync Logs (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Real-time API Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>MOODLE REST API INSPECTOR</span>
              </div>
              <span className="text-[10px] text-slate-400">HTTP 200 OK</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[11px] text-slate-400">
                <strong>Endpoint:</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 break-all select-all">
                {apiResponsePreview.requestUrl}
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                <strong>Response JSON (Moodle Server):</strong>
              </div>
              <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto max-h-48 leading-relaxed">
                {JSON.stringify(apiResponsePreview.response, null, 2)}
              </pre>
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Nhật Ký Đồng Bộ API Gần Nhất (Audit Trail)</span>
              <Activity className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-2">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{log.apiFunction}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{log.entity}</div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">{log.recordsSynced} records</span>
                    <div className="text-slate-500">{log.latencyMs}ms · {log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
