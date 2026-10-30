import React, { useState } from 'react';
import { INITIAL_CERTIFICATES } from '../data/mockData';
import { CertificateRecord } from '../types';
import logoImg from '../assets/logo.png';
import { 
  ShieldCheck, 
  Award, 
  Search, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  QrCode, 
  Lock, 
  Sparkles, 
  Copy, 
  Check,
  Printer,
  Download
} from 'lucide-react';

export const BlockchainCredentials: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateRecord[]>(INITIAL_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<CertificateRecord>(INITIAL_CERTIFICATES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  // Minting modal state
  const [showMintModal, setShowMintModal] = useState(false);
  const [newStudent, setNewStudent] = useState('Vũ Đức Thịnh');
  const [newCourse, setNewCourse] = useState('IELTS Academic Mastery Program');
  const [newScore, setNewScore] = useState('Band 8.0 Overall (L: 8.5, R: 8.5, W: 7.5, S: 7.5)');
  const [isMinting, setIsMinting] = useState(false);

  const filteredCerts = certificates.filter((c) =>
    c.certNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleMintCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);

    setTimeout(() => {
      const randomBlock = Math.floor(19850000 + Math.random() * 5000);
      const randomHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const randomMerkle = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const certId = `TK-2026-IELTS-${Math.floor(8600 + Math.random() * 900)}`;

      const newCert: CertificateRecord = {
        id: `cert-${Date.now()}`,
        certNumber: certId,
        studentName: newStudent,
        courseName: newCourse,
        finalScore: newScore,
        issueDate: '2026-10-29',
        expiryDate: '2028-10-29',
        blockchainHash: randomHash,
        blockNumber: randomBlock,
        contractAddress: '0x4f128bcde9814671c6d1f90a4b7721e901a87b32',
        merkleRoot: randomMerkle,
        verifiedCount: 1,
      };

      setCertificates((prev) => [newCert, ...prev]);
      setSelectedCert(newCert);
      setIsMinting(false);
      setShowMintModal(false);
    }, 1800);
  };

  const handlePrintCertificate = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
      <head>
        <title>Chứng Chỉ Blockchain - ${selectedCert.studentName}</title>
        <style>
          @page { size: landscape; margin: 15mm; }
          body { font-family: 'Times New Roman', serif; text-align: center; padding: 30px; color: #1e293b; background: #fff; }
          .cert-border { border: 8px double #d97706; padding: 25px; position: relative; }
          .title { font-size: 26pt; font-weight: bold; color: #92400e; text-transform: uppercase; margin: 10px 0 5px; }
          .subtitle { font-size: 13pt; color: #475569; font-style: italic; margin-bottom: 20px; }
          .recipient { font-size: 26pt; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; display: inline-block; padding: 0 40px 6px; margin: 10px 0 15px; }
          .course { font-size: 15pt; margin: 10px 0; color: #334155; }
          .score { font-size: 16pt; font-weight: bold; color: #047857; margin: 10px 0; }
          .meta { margin-top: 30px; display: flex; justify-content: space-between; font-size: 10pt; color: #64748b; font-family: monospace; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          .seal { font-weight: bold; color: #b45309; text-transform: uppercase; font-size: 11pt; }
        </style>
      </head>
      <body>
        <div class="cert-border">
          <div style="margin-bottom: 12px;">
            <img src="/logo.png" alt="Trung Kien English Center Logo" style="height: 60px; width: auto; object-contain: contain; border-radius: 8px; background: #FFE600; padding: 4px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);" />
          </div>
          <div style="font-size: 11pt; font-weight: bold; color: #b45309; letter-spacing: 2px; text-transform: uppercase;">
            TRUNG KIÊN EDTECH · SMART EDUCATION ECOSYSTEM
          </div>
          <div class="title">CHỨNG CHỈ NGOẠI NGỮ TỐT NGHIỆP</div>
          <div class="subtitle">Định danh mật mã & Neo Smart Contract Blockchain bất biến</div>
          
          <div style="font-size: 12pt; color: #64748b;">Chứng nhận học viên:</div>
          <div class="recipient">${selectedCert.studentName}</div>
          
          <div class="course">Đã hoàn thành xuất sắc chương trình đào tạo chuyên sâu:</div>
          <div style="font-size: 17pt; font-weight: bold; color: #1e3a8a;">${selectedCert.courseName}</div>
          
          <div class="score">Kết quả: ${selectedCert.finalScore}</div>
          
          <div class="meta">
            <div style="text-align: left;">
              <div>Số hiệu chứng chỉ: <strong>${selectedCert.certNumber}</strong></div>
              <div>Ngày cấp: ${selectedCert.issueDate} · Hạn: ${selectedCert.expiryDate}</div>
              <div style="max-width: 420px; word-break: break-all; font-size: 8pt;">SHA-256 Hash: ${selectedCert.blockchainHash}</div>
            </div>
            <div style="text-align: right;">
              <div class="seal">Chữ ký số Giám đốc Đào tạo</div>
              <div style="margin-top: 25px; font-weight: bold; color: #0f172a;">TRUNG KIÊN EDTECH ACADEMY</div>
              <div style="font-size: 8.5pt;">Block: #${selectedCert.blockNumber} (Immutable Proof)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>IMMUTABLE DECENTRALIZED CREDENTIAL REGISTRY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Định Danh Chứng Chỉ Số Trên Blockchain
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Toàn bộ chứng chỉ tốt nghiệp ngoại ngữ tại Trung Kiên được băm mật mã (SHA-256) và neo vào Smart Contract phi tập trung, bảo đảm tính xác thực vĩnh viễn và không thể làm giả.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrintCertificate}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="In hoặc lưu chứng chỉ đang chọn ra file PDF"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>In Bản Đẹp / PDF</span>
          </button>

          <button
            onClick={() => setShowMintModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cấp Chứng Chỉ Số Mới</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Certificate List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              Sổ Quản Lý Bằng Cấp & Chứng Chỉ
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {certificates.length} Đã Cấp
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo số hiệu, tên học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {filteredCerts.map((cert) => {
              const isSelected = selectedCert.id === cert.id;
              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-500/80 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-cyan-400 font-bold">{cert.certNumber}</span>
                    <span className="text-slate-500 text-[11px] font-mono">{cert.issueDate}</span>
                  </div>
                  <div className="font-bold text-white text-sm">{cert.studentName}</div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{cert.courseName}</div>
                  <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Block: #{cert.blockNumber}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã xác minh</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Verifier Badge & Proof Details (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase">
                Cryptographic Verifier
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Bản Chứng Minh Bất Biến (Proof of Credential)
              </h3>
            </div>
            <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-mono rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xác thực 100% On-Chain</span>
            </span>
          </div>

          {/* Certificate Badge Visual Card */}
          <div className="relative p-6 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-slate-700/80 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-lg bg-[#FFE600] p-1 flex items-center justify-center shrink-0 shadow-sm ring-1 ring-amber-400/50">
                  <img 
                    src={logoImg} 
                    alt="Trung Kien English Center Logo" 
                    className="h-full w-full object-contain rounded"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white tracking-wide">
                    HỆ THỐNG TRUNG TÂM NGOẠI NGỮ TRUNG KIÊN
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    SMART EDTECH CREDENTIAL VERIFICATION
                  </div>
                </div>
              </div>
              <Award className="w-8 h-8 text-cyan-400" />
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-400 uppercase font-mono">CHỨNG NHẬN CẤP CHO</div>
              <div className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">
                {selectedCert.studentName}
              </div>
              <div className="text-sm font-semibold text-cyan-300 mt-1">
                {selectedCert.courseName}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-1 font-bold">
                {selectedCert.finalScore}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block">SỐ HIỆU</span>
                <span className="text-slate-200 font-bold">{selectedCert.certNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">NGÀY CẤP</span>
                <span className="text-slate-200">{selectedCert.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">HIỆU LỰC ĐẾN</span>
                <span className="text-slate-200">{selectedCert.expiryDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">LƯỢT TRA CỨU</span>
                <span className="text-cyan-400 font-bold">{selectedCert.verifiedCount} lần</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Hash Ledger */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="text-slate-400 font-medium mb-1 flex items-center justify-between">
                <span>Transaction Hash (SHA-256 Proof):</span>
                <button
                  onClick={() => handleCopyHash(selectedCert.blockchainHash)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                >
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash ? 'Đã sao chép' : 'Sao chép Hash'}</span>
                </button>
              </div>
              <div className="font-mono text-cyan-300 bg-slate-950 p-3 rounded-lg border border-slate-800 break-all text-[11px]">
                {selectedCert.blockchainHash}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block mb-1">SMART CONTRACT ADDRESS:</span>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300 truncate">
                  {selectedCert.contractAddress}
                </div>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">MERKLE ROOT TREE HASH:</span>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-slate-300 truncate">
                  {selectedCert.merkleRoot}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              Nhà tuyển dụng hoặc các tổ chức khảo thí quốc tế có thể quét mã QR trên chứng chỉ hoặc tra cứu mã Hash trên Smart Contract để nhận kết quả xác thực trong vòng 0.2 giây mà không cần liên hệ văn phòng học vụ.
            </div>
          </div>
        </div>
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Cấp Phát Chứng Chỉ Số Bất Biến On-Chain
              </h3>
              <button
                onClick={() => setShowMintModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleMintCertificate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Tên Học Viên:</label>
                <input
                  type="text"
                  required
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Khóa Học Tốt Nghiệp:</label>
                <input
                  type="text"
                  required
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Kết Quả Đánh Giá / Điểm Thi:</label>
                <input
                  type="text"
                  required
                  value={newScore}
                  onChange={(e) => setNewScore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Chứng chỉ sẽ được ký số bằng khóa cá nhân EdTech Master Key và ghi vào Block vĩnh viễn.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMintModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isMinting}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {isMinting ? 'Đang tạo Hash & Ghi Block...' : 'Ký Số & Phát Hành'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
