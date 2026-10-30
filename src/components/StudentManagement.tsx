import React, { useState } from 'react';
import { INITIAL_STUDENTS } from '../data/mockData';
import { Student, LeadCandidate } from '../types';
import { 
  Users, 
  Search, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Merge, 
  UserPlus, 
  Filter,
  ShieldAlert,
  ArrowRight,
  Download,
  X
} from 'lucide-react';

export const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'roster' | 'fuzzymatch'>('roster');

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCourse, setNewCourse] = useState('IELTS Intensive Band 7.5+');
  const [fuzzyWarning, setFuzzyWarning] = useState<string | null>(null);

  // Simulated Lead Ingestion Queue with fuzzy matches
  const [candidates, setCandidates] = useState<LeadCandidate[]>([
    {
      id: 'lead-01',
      inputName: 'Nguyen Van An',
      inputPhone: '+84 912 345 678',
      inputEmail: 'an.nguyen.edu@gmail.com',
      existingMatchId: 'std-001',
      matchScore: 94.8,
      matchedFields: ['Số điện thoại chuẩn hóa E.164 trùng 100%', 'Tên không dấu tương đồng 96%'],
      status: 'flagged',
    },
    {
      id: 'lead-02',
      inputName: 'Tran Thi Thu Ha',
      inputPhone: '0987.654.321',
      inputEmail: 'thuha.ielts@gmail.com',
      existingMatchId: 'std-002',
      matchScore: 92.5,
      matchedFields: ['Số điện thoại trùng khớp', 'Fuzzy name match (Jaro-Winkler = 0.94)'],
      status: 'flagged',
    },
  ]);

  const [mergeNotification, setMergeNotification] = useState<string | null>(null);

  const filteredStudents = students.filter((s) =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.virtualAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Live fuzzy check on phone/name input
  const handlePhoneChange = (val: string) => {
    setNewPhone(val);
    const cleanPhone = val.replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 8) {
      const match = students.find((s) => s.phone.replace(/[^0-9]/g, '').includes(cleanPhone));
      if (match) {
        setFuzzyWarning(`Cảnh báo Fuzzy: SĐT này tương đồng với học viên "${match.fullName}" (${match.code})!`);
      } else {
        setFuzzyWarning(null);
      }
    } else {
      setFuzzyWarning(null);
    }
  };

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newStudent: Student = {
      id: `std-${Date.now()}`,
      code: `TK-2026-${randomSuffix}`,
      fullName: newName.trim(),
      email: newEmail.trim() || `student${randomSuffix}@trungkien.edu.vn`,
      phone: newPhone.trim(),
      course: newCourse,
      level: newCourse.includes('IELTS') ? 'B2 / IELTS 6.5' : 'B1 Intermediate',
      attendanceRate: 100,
      homeworkScore: 9.0,
      churnRisk: 'low',
      paymentStatus: 'paid',
      virtualAccount: `TK-VA-99${randomSuffix}`,
      lastActive: 'Vừa kích hoạt',
    };

    setStudents((prev) => [newStudent, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setFuzzyWarning(null);
    setMergeNotification(`Đã thêm thành công học viên ${newStudent.fullName} (${newStudent.code}) và cấp Virtual Account [${newStudent.virtualAccount}]!`);
    setTimeout(() => setMergeNotification(null), 5000);
  };

  const handleExportCSV = () => {
    const headers = ['Mã HV,Họ và Tên,Số Điện Thoại,Email,Khóa Học,Trình Độ,Chuyên Cần,Điểm BT,Nguy Cơ Churn,Trạng Thái Học Phí,Virtual Account'];
    const rows = students.map(s => 
      `"${s.code}","${s.fullName}","${s.phone}","${s.email}","${s.course}","${s.level}","${s.attendanceRate}%","${s.homeworkScore}","${s.churnRisk}","${s.paymentStatus}","${s.virtualAccount}"`
    );
    const csvContent = '\ufeff' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Danh_sach_Hoc_vien_Trung_Kien_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMergeNotification('Đã xuất danh sách toàn bộ học viên ra file CSV thành công!');
    setTimeout(() => setMergeNotification(null), 4000);
  };

  const handleMergeLead = (candidateId: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, status: 'merged' } : c))
    );
    setMergeNotification(`Middleware Fuzzy Matching đã hợp nhất thông tin Lead với hồ sơ học viên gốc. Đã đồng bộ tài khoản Virtual Account và giữ nguyên tiến độ học.`);
    setTimeout(() => setMergeNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>MIDDLEWARE PIPELINE & FUZZY DEDUPLICATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Quản Lý Học Viên & Làm Sạch Dữ Liệu (Fuzzy Matching)
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Middleware kiểm chuẩn dữ liệu, tự động phát hiện bản ghi trùng lặp (Levenshtein & Phone normalization) và quản lý tiến trình học tập cá nhân hóa.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'roster' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Danh sách Học viên ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('fuzzymatch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'fuzzymatch' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Middleware Fuzzy Matching ({candidates.filter(c => c.status === 'flagged').length})</span>
          </button>
        </div>
      </div>

      {mergeNotification && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{mergeNotification}</span>
        </div>
      )}

      {activeTab === 'roster' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Hồ Sơ Học Viên Đang Theo Học Tại Hệ Thống Trung Kiên
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Đồng bộ tiến độ học tập, tỷ lệ chuyên cần và số tài khoản định danh Virtual Account
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm tên, mã HV, SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="Xuất danh sách ra file CSV"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Xuất CSV</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Thêm HV Mới</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                  <th className="py-3 px-4 font-semibold">MÃ HV</th>
                  <th className="py-3 px-4 font-semibold">HỌ VÀ TÊN</th>
                  <th className="py-3 px-4 font-semibold">KHÓA HỌC</th>
                  <th className="py-3 px-4 font-semibold">TRÌNH ĐỘ</th>
                  <th className="py-3 px-4 font-semibold text-center">ĐI HỌC</th>
                  <th className="py-3 px-4 font-semibold text-center">BÀI TẬP</th>
                  <th className="py-3 px-4 font-semibold">TÀI KHOẢN ẢO (VA)</th>
                  <th className="py-3 px-4 font-semibold text-center">CHURN RISK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400 font-semibold">{st.code}</td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div>{st.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{st.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{st.course}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{st.level}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums">
                      <span className={st.attendanceRate < 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {st.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-300">
                      {st.homeworkScore}/100
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300 font-bold">
                      {st.virtualAccount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block font-mono text-[11px] font-semibold ${
                          st.churnRisk === 'high'
                            ? 'text-rose-400'
                            : st.churnRisk === 'medium'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {st.churnRisk === 'high' ? 'Cao (Nguy cơ)' : st.churnRisk === 'medium' ? 'Trung bình' : 'Thấp (An toàn)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Thuật Toán Fuzzy Matching Làm Sạch Dữ Liệu Marketing & Leads
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Khi khách hàng hoặc phụ huynh đăng ký qua Landing Page, Facebook Lead Ads hoặc Zalo OA, dữ liệu thường bị gõ sai dấu, khác định dạng số điện thoại hoặc viết tắt. Middleware áp dụng thuật toán so khớp mờ (Fuzzy String Distance) để ngăn tạo hồ sơ rác.
            </p>
          </div>

          <div className="space-y-3">
            {candidates.map((lead) => (
              <div
                key={lead.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded font-bold">
                      Độ trùng khớp: {lead.matchScore}%
                    </span>
                    <span className="text-xs text-slate-400">
                      ID Khách tiềm năng: <span className="font-mono text-slate-300">{lead.id}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-500 font-mono mb-1">DỮ LIỆU LEAD MỚI NHẬP:</div>
                      <div className="font-bold text-white text-sm">{lead.inputName}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{lead.inputPhone}</div>
                      <div className="text-slate-500 mt-0.5">{lead.inputEmail}</div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-cyan-400 font-mono mb-1">HỒ SƠ HỌC VIÊN ĐÃ TỒN TẠI (ID: {lead.existingMatchId}):</div>
                      <div className="font-bold text-white text-sm">Nguyễn Văn An</div>
                      <div className="text-slate-400 font-mono mt-0.5">0912345678</div>
                      <div className="text-slate-500 mt-0.5">TK-IELTS-8810 · Lớp IELTS Intensive 7.5+</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500">Căn cứ đối khớp:</span>
                    {lead.matchedFields.join(' · ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {lead.status === 'flagged' ? (
                    <button
                      onClick={() => handleMergeLead(lead.id)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Merge className="w-3.5 h-3.5" />
                      <span>Hợp Nhất Bản Ghi</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Đã hợp nhất</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Student Modal with Realtime Fuzzy Check */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <span>Thêm Hồ Sơ Học Viên Mới</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Họ và tên học viên:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Lê Thị Mai Anh"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Số điện thoại liên hệ:
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0912 888 999"
                  value={newPhone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                {fuzzyWarning && (
                  <div className="mt-1.5 p-2 rounded bg-amber-950/60 border border-amber-700 text-[11px] text-amber-300 flex items-center gap-1.5 animate-in fade-in">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>{fuzzyWarning}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email học viên:
                </label>
                <input
                  type="email"
                  placeholder="VD: maianh.ielts@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Khóa học đăng ký:
                </label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="IELTS Intensive Band 7.5+">IELTS Intensive Band 7.5+</option>
                  <option value="TOEIC Speed Run 800+">TOEIC Speed Run 800+</option>
                  <option value="Tiếng Anh Giao Tiếp Doanh Nghiệp">Tiếng Anh Giao Tiếp Doanh Nghiệp</option>
                  <option value="Cambridge B2 First (FCE)">Cambridge B2 First (FCE)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold rounded-lg cursor-pointer shadow-sm"
                >
                  Tạo Hồ Sơ & Cấp VA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
