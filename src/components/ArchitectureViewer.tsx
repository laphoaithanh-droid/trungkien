import React, { useState } from 'react';
import { INITIAL_SERVICES } from '../data/mockData';
import { ServiceNode } from '../types';
import { 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Server, 
  ArrowRight, 
  Lock, 
  Key, 
  Database, 
  Zap, 
  RefreshCw,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [services] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [selectedService, setSelectedService] = useState<ServiceNode>(INITIAL_SERVICES[0]);
  const [activeTab, setActiveTab] = useState<'topology' | 'zerotrust' | 'cloudscale'>('topology');
  const [simulatedLoad, setSimulatedLoad] = useState<number>(38); // 38%
  const [isSimulatingSpike, setIsSimulatingSpike] = useState(false);

  const triggerSpike = () => {
    setIsSimulatingSpike(true);
    setSimulatedLoad(86);
    setTimeout(() => {
      setIsSimulatingSpike(false);
      setSimulatedLoad(42);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>ENTERPRISE DISTRIBUTED SYSTEM TOPOLOGY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kiến trúc Microservices & Bảo mật Zero Trust
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Mô hình phân tán độc lập (Loose Coupling, Zero Downtime), mã hóa 2 lớp (At-rest & In-transit) và nền tảng Cloud-native sẵn sàng Auto-scaling.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('topology')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'topology'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sơ đồ Microservices
          </button>
          <button
            onClick={() => setActiveTab('zerotrust')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'zerotrust'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ma trận Zero Trust
          </button>
          <button
            onClick={() => setActiveTab('cloudscale')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'cloudscale'
                ? 'bg-slate-800 text-cyan-300 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto-scaling HPA
          </button>
        </div>
      </div>

      {activeTab === 'topology' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Services Grid (8 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>ACTIVE CLOUD MICROSERVICES ({services.length})</span>
              <span>NETWORK STATUS: 100% HEALTHY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((svc) => {
                const isSelected = selectedService.id === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-sm shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
                        {svc.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {svc.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white mt-1.5 truncate">
                      {svc.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {svc.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>p99: {svc.latencyP99}</span>
                      <span>{svc.throughput}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Event Bus Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Apache Kafka Event Bus & Redis Pub/Sub Cluster
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Đồng bộ trạng thái bất đồng bộ giữa LMS, Điểm danh FaceID và Sổ cái tài chính Virtual Account.
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-indigo-400 whitespace-nowrap">
                3,420 msgs/s
              </span>
            </div>
          </div>

          {/* Service Deep Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 sticky top-24 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase">
                  Service Inspector
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedService.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-300">
                {selectedService.id}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedService.description}
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tech Stack & Runtime:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-mono bg-slate-950 text-slate-300 border border-slate-800 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cơ sở Dữ liệu & Storage:</span>
                </div>
                <p className="font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedService.database}
                </p>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Chuẩn Bảo mật (Zero Trust):</span>
                </div>
                <p className="font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedService.securityProtocol}
                </p>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Chính sách Auto-scaling:</span>
                </div>
                <p className="font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
                  {selectedService.scalingPolicy}
                </p>
              </div>

              <div>
                <div className="text-slate-400 font-medium mb-1">Endpoints & Workflow:</div>
                <div className="space-y-1">
                  {selectedService.endpoints.map((ep, i) => (
                    <div
                      key={i}
                      className="text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800 flex items-center justify-between"
                    >
                      <span>{ep}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'zerotrust' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400">LAYER 1</span>
                <Lock className="w-4 h-4 text-cyan-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Mã hóa In-Transit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mọi kết nối giữa Client, API Gateway và giữa các Pods trong Cluster bắt buộc áp dụng **TLS 1.3** và **mTLS (Mutual TLS)** với chứng chỉ x509 xoay vòng tự động mỗi 30 ngày.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Cipher: ECDHE-RSA-AES128-GCM
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400">LAYER 2</span>
                <Key className="w-4 h-4 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Mã hóa At-Rest</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dữ liệu học viên, nhật ký điểm danh và bản ghi tài chính được mã hóa bằng chuẩn **AES-256** tại cấp độ Disk & Database. Khóa mã hóa được quản lý tập trung bởi Cloud KMS.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                KMS Rotation: 90 ngày tự động
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400">LAYER 3</span>
                <ShieldCheck className="w-4 h-4 text-teal-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Xác thực Định danh (IAM)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Áp dụng nguyên tắc quyền tối thiểu (Least Privilege), kết hợp **RBAC** (vai trò) và **ABAC** (ngữ cảnh IP, thiết bị, thời gian). Token JWT/Paseto hết hạn sau 15 phút.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                MFA: Bắt buộc với Admin & GV
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400">LAYER 4</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white">Kiểm thử SAST/DAST & Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tích hợp công cụ quét lỗ hổng mã nguồn tĩnh và động trong CI/CD Pipeline. 100% thao tác thay đổi dữ liệu được ghi vào Sổ cái Audit Trail bất biến chống chối bỏ.
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Audit Trail: Write-Once-Read-Many
              </div>
            </div>
          </div>

          {/* Security Protocol Specs Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                Bảng Kiểm chuẩn An toàn Thông tin Trung Kiên EdTech
              </h3>
              <span className="text-xs font-mono text-cyan-400">TIÊU CHUẨN ISO 27001 & ZERO TRUST</span>
            </div>
            <div className="divide-y divide-slate-800 text-xs">
              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="font-semibold text-slate-200">Dữ liệu Sinh trắc học (FaceID)</div>
                <div className="text-slate-400 md:col-span-2">
                  Chỉ lưu vector toán học 128 chiều đã băm một chiều (Hash Embedding). Tuyệt đối không lưu ảnh khuôn mặt gốc trên máy chủ.
                </div>
                <div className="text-emerald-400 font-mono flex items-center gap-1.5 md:justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tuân thủ GDPR / NDPE</span>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="font-semibold text-slate-200">Giao dịch Tài chính Virtual Account</div>
                <div className="text-slate-400 md:col-span-2">
                  Chữ ký số RSA-4096 giữa ngân hàng và hệ thống; Token chống trùng lặp Idempotency ngăn thanh toán đúp.
                </div>
                <div className="text-emerald-400 font-mono flex items-center gap-1.5 md:justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Chính xác 100%</span>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <div className="font-semibold text-slate-200">Chứng chỉ Tốt nghiệp Ngoại ngữ</div>
                <div className="text-slate-400 md:col-span-2">
                  Lưu trữ Root Hash trên Blockchain phân tán; bất kỳ ai cũng có thể xác minh tức thì qua QR mà không thể giả mạo.
                </div>
                <div className="text-emerald-400 font-mono flex items-center gap-1.5 md:justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bất biến (Immutable)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cloudscale' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h3 className="text-base font-bold text-white">
                  Mô phỏng Auto-scaling Kubernetes (HPA Engine)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kiểm tra khả năng chịu tải và co giãn đàn hồi khi 1,500 học viên đồng thời điểm danh FaceID và check-in vào lúc 17:30.
                </p>
              </div>

              <button
                onClick={triggerSpike}
                disabled={isSimulatingSpike}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{isSimulatingSpike ? 'Đang giả lập cao điểm...' : 'Kích hoạt tải cao điểm (1,500 Check-ins)'}</span>
              </button>
            </div>

            {/* Simulated Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Tải CPU Cluster</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">
                  {simulatedLoad}%
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      simulatedLoad > 75 ? 'bg-amber-400' : 'bg-cyan-400'
                    }`}
                    style={{ width: `${simulatedLoad}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Số lượng Replicas Pods đang chạy</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
                  {simulatedLoad > 75 ? '18 Pods (Scaled up)' : '6 Pods (Baseline)'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">HPA Threshold: &gt; 70% CPU</div>
              </div>

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div className="text-xs text-slate-400">Thời gian phản hồi P99</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                  {simulatedLoad > 75 ? '24.5 ms' : '12.8 ms'}
                </div>
                <div className="text-[11px] text-emerald-500 mt-1">Zero Downtime đảm bảo</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
