import React, { useState } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { TransactionRecord } from '../types';
import { 
  Wallet, 
  CheckCircle, 
  ArrowDownLeft, 
  FileText, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  Search, 
  ExternalLink, 
  Receipt,
  Download
} from 'lucide-react';

export const FinanceHub: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [simulatedAccount, setSimulatedAccount] = useState('TK-IELTS-8821');
  const [simulatedAmount, setSimulatedAmount] = useState('6000000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reconcileFeedback, setReconcileFeedback] = useState<string | null>(null);

  const filteredTx = transactions.filter((t) => 
    t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.virtualAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReconciled = transactions
    .filter((t) => t.status === 'reconciled')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSimulateWebhook = () => {
    setIsProcessing(true);
    setReconcileFeedback(null);

    setTimeout(() => {
      const newTx: TransactionRecord = {
        id: `tx-${Date.now()}`,
        referenceNo: `FT26${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        virtualAccount: simulatedAccount,
        studentName: 'Trần Thị Thu Hà (Đợt 2 - Quyết toán)',
        amount: parseInt(simulatedAmount, 10) || 6000000,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        bankName: 'Vietcombank NAPAS 24/7',
        status: 'reconciled',
        reconciliationMethod: 'auto_webhook',
        variance: 0,
      };

      setTransactions((prev) => [newTx, ...prev]);
      setIsProcessing(false);
      setReconcileFeedback(`Đã nhận Webhook Ngân hàng: Khớp lệnh tự động 100% với Hóa đơn học phí [${simulatedAccount}] · Sai lệch: 0 VNĐ · Đã xuất hóa đơn điện tử VAT.`);
      setTimeout(() => setReconcileFeedback(null), 6000);
    }, 1500);
  };

  const handleExportFinanceCSV = () => {
    const headers = ['Mã Giao Dịch,Số Tài Khoản Ảo (VA),Tên Học Viên,Số Tiền (VNĐ),Thời Gian,Ngân Hàng,Trạng Thái,Phương Thức Đối Soát,Sai Lệch'];
    const rows = transactions.map(t => 
      `"${t.referenceNo}","${t.virtualAccount}","${t.studentName}","${t.amount}","${t.timestamp}","${t.bankName}","${t.status}","${t.reconciliationMethod}","${t.variance}"`
    );
    const csvContent = '\ufeff' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `So_Ke_Toan_Doi_Soat_Trung_Kien_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setReconcileFeedback('Đã xuất sổ kế toán đối soát tự động ra file CSV thành công!');
    setTimeout(() => setReconcileFeedback(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Wallet className="w-3.5 h-3.5" />
            <span>PRECISION ZERO-VARIANCE FINANCIAL LEDGER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tài Chính Virtual Account & Auto-Reconciliation 100%
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tự động hóa toàn trình thu học phí: Định danh tài khoản ảo (VA) cho từng học viên, đối soát tự động qua Webhook ngân hàng và bảo đảm độ chính xác tuyệt đối.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportFinanceCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="Xuất sổ kế toán ra CSV"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Xuất Báo Cáo CSV</span>
          </button>

          <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sai lệch: 0 VNĐ</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400">Tổng Học Phí Đã Đối Soát Tự Động</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
            {totalReconciled.toLocaleString('vi-VN')} VNĐ
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Độ chính xác đối soát: 100.0%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400">Tỷ lệ Phủ Virtual Account (VA)</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            100% Học viên
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Mỗi học viên sở hữu 1 số tài khoản định danh riêng biệt
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400">Tốc độ Ghi nhận Giao dịch (SLA)</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            &lt; 850 ms
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Webhook mở khóa quyền truy cập LMS học tập tức thì
          </div>
        </div>
      </div>

      {/* Webhook Simulator Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">
              Mô Phỏng Nhận Webhook Ngân Hàng (NAPAS / VietQR Gateway)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Chuẩn PCI-DSS & RSA-4096</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Tài khoản Định danh (VA):</label>
            <input
              type="text"
              value={simulatedAccount}
              onChange={(e) => setSimulatedAccount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Số tiền thanh toán (VNĐ):</label>
            <input
              type="text"
              value={simulatedAmount}
              onChange={(e) => setSimulatedAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSimulateWebhook}
              disabled={isProcessing}
              className="w-full py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Đang xác thực Webhook...' : 'Bắn Webhook Thanh toán'}</span>
            </button>
          </div>
        </div>

        {reconcileFeedback && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{reconcileFeedback}</span>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">
              Sổ Cái Giao Dịch Học Phí Bất Biến (Audit Trail)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ghi nhận đối soát hai chiều giữa ngân hàng và hệ thống đào tạo
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm theo mã VA, tên học viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">MÃ GIAO DỊCH</th>
                <th className="py-3 px-4 font-semibold">TÀI KHOẢN ẢO (VA)</th>
                <th className="py-3 px-4 font-semibold">HỌC VIÊN</th>
                <th className="py-3 px-4 font-semibold text-right">SỐ TIỀN</th>
                <th className="py-3 px-4 font-semibold">NGÂN HÀNG</th>
                <th className="py-3 px-4 font-semibold">THỜI GIAN</th>
                <th className="py-3 px-4 font-semibold text-center">TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4 text-cyan-400">{tx.referenceNo}</td>
                  <td className="py-3 px-4 text-slate-300 font-bold">{tx.virtualAccount}</td>
                  <td className="py-3 px-4 font-sans text-white font-medium">{tx.studentName}</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold tabular-nums">
                    {tx.amount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{tx.bankName}</td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">{tx.timestamp}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>100% Khớp</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
