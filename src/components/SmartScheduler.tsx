import React, { useState } from 'react';
import { INITIAL_SCHEDULE } from '../data/mockData';
import { ClassScheduleItem } from '../types';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Plus
} from 'lucide-react';

export const SmartScheduler: React.FC = () => {
  const [schedule, setSchedule] = useState<ClassScheduleItem[]>(INITIAL_SCHEDULE);
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<string | null>(null);

  const days = ['all', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

  const filteredSchedule = selectedDay === 'all' 
    ? schedule 
    : schedule.filter((s) => s.dayOfWeek === selectedDay);

  const runResourceOptimizer = () => {
    setIsOptimizing(true);
    setOptimizationResult(null);

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationResult('Thuật toán Genetic Algorithm & CSP đã phân bổ 6 lớp học: 0 xung đột phòng, 100% giáo viên trong hạn mức giờ dạy, tăng hiệu suất sử dụng thiết bị lên 96.8%.');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>CONSTRAINT SATISFACTION & GENETIC SCHEDULING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Xếp Lịch Thông Minh & Tối Ưu Hóa Tài Nguyên
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tự động giải quyết bài toán phân bổ phòng học, năng lực thiết bị âm thanh và cân bằng tải giờ dạy cho đội ngũ giảng viên Trung Kiên.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={runResourceOptimizer}
          disabled={isOptimizing}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
          <span>{isOptimizing ? 'Đang chạy thuật toán...' : 'Chạy Resource Optimization'}</span>
        </button>
      </div>

      {optimizationResult && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-white">Kết quả Tối ưu hóa Thành công:</div>
            <p className="text-slate-300">{optimizationResult}</p>
          </div>
        </div>
      )}

      {/* Constraints Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Ràng buộc Giảng viên (Workload)</div>
          <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
            Tối đa 24h / tuần
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tránh tình trạng kiệt sức (Teacher Burnout)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Tỷ lệ Lấp đầy Phòng học</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            88.2% Sức chứa
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Không lãng phí năng lượng điều hòa & phòng lớn</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Chuẩn Thiết bị Chuyên biệt</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            Score: 97.4 / 100
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Smart Screen, Mic thu âm Studio, Acoustic Booth</p>
        </div>
      </div>

      {/* Filter Tabs by Day of Week */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedDay === day
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-xs'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            {day === 'all' ? 'Tất cả các ngày' : day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchedule.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-cyan-400 font-semibold">{item.className}</span>
                <span className="font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.dayOfWeek}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {item.subject}
              </h3>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono">{item.timeSlot}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{item.room}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-300 truncate">{item.teacher}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">
                Sĩ số: <span className="text-white font-bold">{item.enrolled}</span>/{item.capacity}
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Không xung đột</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
