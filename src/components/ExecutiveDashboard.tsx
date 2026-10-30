import React, { useState } from 'react';
import { 
  Users, 
  TrendingDown, 
  Wallet, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Send,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const [rpaTriggered, setRpaTriggered] = useState(false);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  const handleTriggerRPA = () => {
    setRpaTriggered(true);
    setTimeout(() => setRpaTriggered(false), 5000);
  };

  const kpis = [
    {
      label: 'Học viên Đang Học (Active)',
      value: '1,480',
      change: '+12.4% MoM',
      isPositive: true,
      subtext: '98 lớp học song song',
      icon: Users,
    },
    {
      label: 'Tỷ lệ Churn Rate Dự báo',
      value: '3.8%',
      change: '-1.5% so với Q3',
      isPositive: true,
      subtext: 'Mục tiêu kiểm soát < 5.0%',
      icon: TrendingDown,
    },
    {
      label: 'Độ chính xác Đối soát Tài chính',
      value: '100.0%',
      change: '0 VNĐ sai lệch',
      isPositive: true,
      subtext: 'Qua 3,240 giao dịch Virtual Account',
      icon: Wallet,
    },
    {
      label: 'Công suất Sử dụng Phòng học',
      value: '87.5%',
      change: '+9.2% sau tối ưu',
      isPositive: true,
      subtext: 'Thuật toán xếp lịch CSP & Genetic',
      icon: Clock,
    },
  ];

  const atRiskStudents = [
    {
      name: 'Trần Thị Thu Hà',
      code: 'TK-2026-882',
      course: 'IELTS Mastery 6.5',
      attendance: '72%',
      churnScore: '78%',
      reason: 'Vắng 2 buổi liên tiếp; Chưa nộp bài Speaking Unit 4',
      suggestedAction: 'Gửi tin nhắn Zalo ZNS tự động & xếp lịch 1-on-1 với GV Chủ nhiệm',
    },
    {
      name: 'Hoàng Kim Chi',
      code: 'TK-2026-886',
      course: 'English for Academic Purposes',
      attendance: '64%',
      churnScore: '84%',
      reason: 'Giảm 40% thời lượng truy cập LMS Spaced Repetition',
      suggestedAction: 'Kích hoạt gói học phụ đạo cá nhân hóa với Trợ giảng AI',
    },
    {
      name: 'Nguyễn Quốc Bảo',
      code: 'TK-2026-891',
      course: 'TOEIC Speed Run 750',
      attendance: '70%',
      churnScore: '69%',
      reason: 'Điểm Mock Test Listening giảm 15% so với đầu vào',
      suggestedAction: 'Điều chỉnh playlist luyện nghe thích ứng trên mobile app',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>EXECUTIVE BI & PREDICTIVE ANALYTICS ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Trung tâm Phân tích Dự báo & Vận hành Thông minh
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Giám sát thời gian thực toàn diện: Dự báo nguy cơ thôi học (Churn Prediction), cân bằng tải giảng dạy và đối soát doanh thu tự động.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeRange === '30d' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            30 Ngày gần nhất
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeRange === '90d' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Quý 4 Dự báo
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              timeRange === '1y' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Năm 2026
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>{kpi.label}</span>
                <Icon className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="text-3xl font-bold font-mono text-white tracking-tight tabular-nums">
                {kpi.value}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="font-mono text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-slate-500 truncate">{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Insights & Churn Risk Predictor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AI Predictive Insights (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  Dự báo Thông minh từ Dữ liệu Lịch sử (AI Insights)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Mô hình: Gradient Boosting & LSTM</span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-cyan-300 mb-1">
                  <span>1. Phát hiện sớm Tương quan Điểm danh & Rời bỏ khóa học</span>
                  <span className="font-mono text-[11px] text-amber-400">Độ tin cậy: 94.2%</span>
                </div>
                <p className="text-slate-300">
                  Học viên vắng mặt quá 2 buổi liên tiếp hoặc tỷ lệ nộp bài tập về nhà Speaking dưới 70% trong 14 ngày có nguy cơ rời bỏ khóa học (Drop-out) tăng gấp 3.2 lần. Can thiệp tự động trước ngày thứ 15 giúp nâng tỷ lệ giữ chân (Retention) lên 89%.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-emerald-300 mb-1">
                  <span>2. Xu hướng Doanh thu & Tỷ trọng Thanh toán Virtual Account</span>
                  <span className="font-mono text-[11px] text-emerald-400">Tăng trưởng 18%</span>
                </div>
                <p className="text-slate-300">
                  Dự báo doanh thu tháng 11/2026 đạt 3.12 tỷ VNĐ. Tỷ lệ phụ huynh và học viên chuyển khoản qua tài khoản định danh Virtual Account đạt 94.8%, giúp trung tâm tiết kiệm 120 giờ kế toán đối soát thủ công mỗi tháng.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between font-semibold text-indigo-300 mb-1">
                  <span>3. Tối ưu hóa Phòng học & Giờ vàng Khai giảng</span>
                  <span className="font-mono text-[11px] text-indigo-400">Hiệu suất 92%</span>
                </div>
                <p className="text-slate-300">
                  Phòng Lab 201 và Hội trường Smart A đang có tỷ lệ lấp đầy tối đa vào khung 18:00 - 20:00 các ngày 2-4-6. Thuật toán đề xuất mở thêm 2 lớp IELTS Intensive vào khung sáng Thứ Bảy và Chủ Nhật để đón đầu 65 học viên trong danh sách chờ (Waitlist).
                </p>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Strip */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Kênh Thanh toán & Tỷ lệ Đối soát Tự động (Auto-Reconciliation)
            </h4>
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[11px]">Virtual Account VietQR</div>
                <div className="text-base font-bold text-cyan-400 mt-1">94.8%</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Webhook Realtime 0s</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[11px]">Cổng Thẻ POS Campus</div>
                <div className="text-base font-bold text-indigo-400 mt-1">4.2%</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Batch Sync 23:00</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[11px]">Tiền mặt / Khác</div>
                <div className="text-base font-bold text-slate-300 mt-1">1.0%</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Nhập sổ kép 100%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Churn Risk Watchlist & Actionable RPA (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>DANH SÁCH HỌC VIÊN CẦN CAN THIỆP SỚM</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Thuật toán phân tích cảm xúc & hành vi phát hiện nguy cơ cao
              </p>
            </div>

            <button
              onClick={handleTriggerRPA}
              disabled={rpaTriggered}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3 h-3" />
              <span>{rpaTriggered ? 'Đã kích hoạt RPA!' : 'Kích hoạt RPA Retention'}</span>
            </button>
          </div>

          {rpaTriggered && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Workflow RPA đã gửi lộ trình hỗ trợ và tự động mở lịch hẹn 1-on-1 cho 3 học viên.</span>
            </div>
          )}

          <div className="space-y-3">
            {atRiskStudents.map((st, i) => (
              <div
                key={i}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/90 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">{st.name}</span>
                    <span className="font-mono text-slate-500 ml-2 text-[11px]">{st.code}</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">
                    Churn: {st.churnScore}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px]">
                  Khóa học: <span className="text-slate-300">{st.course}</span> · Đi học: <span className="text-amber-300 font-mono">{st.attendance}</span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500">Nguyên nhân:</span> {st.reason}
                </div>

                <div className="pt-2 border-t border-slate-900 text-[11px] text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 shrink-0" />
                  <span>{st.suggestedAction}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-500">
            * Hệ thống tự động quét lại dữ liệu học tập mỗi 6 giờ và cảnh báo qua Telegram/Zalo cho Quản lý Học vụ.
          </div>
        </div>
      </div>
    </div>
  );
};
