import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanFace, 
  QrCode, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Camera, 
  MapPin, 
  Clock, 
  Lock,
  Sparkles,
  Video,
  VideoOff
} from 'lucide-react';

export const SmartAttendance: React.FC = () => {
  const [mode, setMode] = useState<'faceid' | 'dynamic_qr'>('faceid');

  // FaceID State
  const [isScanningFace, setIsScanningFace] = useState(false);
  const [faceScanSuccess, setFaceScanSuccess] = useState<boolean | null>(null);
  const [matchedStudent, setMatchedStudent] = useState<string | null>(null);
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Dynamic QR State
  const [qrToken, setQrToken] = useState('TK-QR-7A9B-2026');
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [qrScanSuccess, setQrScanSuccess] = useState<string | null>(null);

  // Attendance Logs
  const [logs, setLogs] = useState([
    {
      id: 'log-1',
      studentName: 'Nguyễn Văn An',
      studentCode: 'TK-2026-881',
      method: 'FaceID Liveness',
      score: '98.8% match',
      time: '17:58:12',
      status: 'verified',
    },
    {
      id: 'log-2',
      studentName: 'Vũ Đức Thịnh',
      studentCode: 'TK-2026-885',
      method: 'Dynamic QR (TOTP)',
      score: 'Geofence 12m',
      time: '17:59:04',
      status: 'verified',
    },
    {
      id: 'log-3',
      studentName: 'Lê Hoàng Minh',
      studentCode: 'TK-2026-883',
      method: 'FaceID Liveness',
      score: '97.2% match',
      time: '18:01:45',
      status: 'verified',
    },
  ]);

  // QR Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Rotate token
          const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
          const randomSalt = Math.floor(1000 + Math.random() * 9000);
          setQrToken(`TK-QR-${randomHex}-${randomSalt}`);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleLiveCamera = async () => {
    if (useLiveCamera) {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
      setUseLiveCamera(false);
      setCameraError(null);
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Trình duyệt không hỗ trợ WebRTC Camera.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      mediaStreamRef.current = stream;
      setUseLiveCamera(true);
      setCameraError(null);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Không thể mở camera. Vui lòng cấp quyền webcam.');
      setUseLiveCamera(false);
    }
  };

  useEffect(() => {
    if (useLiveCamera && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [useLiveCamera]);

  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleStartFaceScan = () => {
    setIsScanningFace(true);
    setFaceScanSuccess(null);
    setMatchedStudent(null);

    setTimeout(() => {
      setIsScanningFace(false);
      setFaceScanSuccess(true);
      setMatchedStudent('Nguyễn Văn An (TK-2026-881) · Lớp IELTS Intensive 7.5+');
      
      const newLog = {
        id: `log-${Date.now()}`,
        studentName: 'Nguyễn Văn An',
        studentCode: 'TK-2026-881',
        method: 'FaceID Liveness',
        score: '99.4% Liveness Anti-spoof',
        time: new Date().toLocaleTimeString(),
        status: 'verified',
      };
      setLogs((prev) => [newLog, ...prev]);
    }, 2200);
  };

  const handleSimulateQRScan = () => {
    setQrScanSuccess(`Xác thực thành công Token [${qrToken}] · Định vị: Tầng 2 Campus Trung Kiên (Độ lệch 4 mét)`);
    const newLog = {
      id: `log-${Date.now()}`,
      studentName: 'Phạm Quỳnh Nga',
      studentCode: 'TK-2026-884',
      method: 'Dynamic QR (TOTP)',
      score: 'Token Valid + Geo OK',
      time: new Date().toLocaleTimeString(),
      status: 'verified',
    };
    setLogs((prev) => [newLog, ...prev]);
    setTimeout(() => setQrScanSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <ScanFace className="w-3.5 h-3.5" />
            <span>BIOMETRIC & CRYPTOGRAPHIC ATTENDANCE SUITE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Điểm Danh Thông Minh FaceID & Dynamic QR
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Cơ chế chống gian lận kép: Kiểm tra thực thể sống (Liveness Detection) kết hợp mã QR xoay vòng 15 giây mã hóa muối và Geofencing định vị khuôn viên.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 shrink-0">
          <button
            onClick={() => setMode('faceid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'faceid' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanFace className="w-3.5 h-3.5" />
            <span>FaceID Liveness</span>
          </button>
          <button
            onClick={() => setMode('dynamic_qr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              mode === 'dynamic_qr' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Dynamic QR (15s)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Verification Engine Interactive Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {mode === 'faceid' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Hệ thống Nhận diện Khuôn mặt FaceID Edge
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trích xuất 128 điểm vector khuôn mặt · Chống ảnh in & màn hình điện thoại
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleLiveCamera}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                      useLiveCamera
                        ? 'bg-rose-950/70 border-rose-600 text-rose-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300'
                    }`}
                  >
                    {useLiveCamera ? <VideoOff className="w-3.5 h-3.5 text-rose-400" /> : <Video className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{useLiveCamera ? 'Tắt Webcam' : 'Bật Webcam Thật'}</span>
                  </button>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Anti-Spoofing L3</span>
                  </span>
                </div>
              </div>

              {cameraError && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-700 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Simulated or Live Camera Viewport */}
              <div className="relative aspect-video bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden group">
                {/* Live Webcam Stream if active */}
                {useLiveCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                )}

                {/* Target Reticle */}
                <div className="relative z-10 w-48 h-56 border-2 border-dashed border-cyan-500/70 rounded-2xl flex flex-col items-center justify-center p-4 bg-slate-950/20 backdrop-blur-[2px]">
                  {isScanningFace ? (
                    <div className="space-y-3 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto"></div>
                      <div className="text-xs font-mono text-cyan-300 animate-pulse">
                        Đang phân tích Liveness & Đối khớp Vector...
                      </div>
                    </div>
                  ) : faceScanSuccess ? (
                    <div className="space-y-2 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-emerald-300">
                        Xác Thực Thành Công!
                      </div>
                      <div className="text-[11px] text-slate-300 max-w-[180px] leading-tight">
                        {matchedStudent}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-center text-slate-400">
                      <Camera className="w-10 h-10 text-slate-500 mx-auto" />
                      <div className="text-xs font-medium">Đặt khuôn mặt trong khung hình</div>
                    </div>
                  )}

                  {/* Corner Accent brackets */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>CAMERA: HD 1080P PROBER</span>
                  <span>FPS: 30.0 · LATENCY: 14MS</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Vector được mã hóa băm một chiều (Hash Embedding) ngay tại thiết bị Edge.
                </div>
                <button
                  onClick={handleStartFaceScan}
                  disabled={isScanningFace}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <ScanFace className="w-4 h-4" />
                  <span>{isScanningFace ? 'Đang phân tích...' : 'Bắt đầu quét FaceID'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Mã Dynamic QR Xoay Vòng 15 Giây (TOTP)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Mã hóa muối động (Dynamic Salt) · Ngăn chặn chụp màn hình chia sẻ nhóm
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Tự hủy sau {secondsRemaining}s</span>
                </span>
              </div>

              {/* QR Container */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
                <div className="relative p-4 bg-white rounded-xl shadow-lg">
                  {/* SVG QR Code Simulation */}
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="black">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner 1 */}
                    <rect x="10" y="10" width="22" height="22" fill="#020617" />
                    <rect x="14" y="14" width="14" height="14" fill="white" />
                    <rect x="17" y="17" width="8" height="8" fill="#020617" />
                    {/* Corner 2 */}
                    <rect x="68" y="10" width="22" height="22" fill="#020617" />
                    <rect x="72" y="14" width="14" height="14" fill="white" />
                    <rect x="75" y="17" width="8" height="8" fill="#020617" />
                    {/* Corner 3 */}
                    <rect x="10" y="68" width="22" height="22" fill="#020617" />
                    <rect x="14" y="72" width="14" height="14" fill="white" />
                    <rect x="17" y="75" width="8" height="8" fill="#020617" />
                    {/* Dynamic hash pattern */}
                    <rect x="36" y="12" width="6" height="6" fill="#020617" />
                    <rect x="46" y="18" width="8" height="4" fill="#020617" />
                    <rect x="38" y="38" width="12" height="12" fill="#06b6d4" />
                    <rect x="56" y="38" width="6" height="8" fill="#020617" />
                    <rect x="38" y="58" width="8" height="6" fill="#020617" />
                    <rect x="68" y="68" width="6" height="6" fill="#020617" />
                    <rect x="78" y="76" width="10" height="8" fill="#020617" />
                    <rect x="48" y="76" width="6" height="12" fill="#020617" />
                  </svg>

                  <div className="text-center font-mono text-[10px] text-slate-800 font-bold mt-2">
                    {qrToken}
                  </div>
                </div>

                {/* Progress countdown bar */}
                <div className="w-64 space-y-1.5 text-center">
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(secondsRemaining / 15) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Mã xoay vòng sau: <span className="text-cyan-400 font-bold">{secondsRemaining} giây</span>
                  </div>
                </div>
              </div>

              {qrScanSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{qrScanSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Geofencing: Bắt buộc tọa độ thiết bị trong bán kính 50m campus</span>
                </div>
                <button
                  onClick={handleSimulateQRScan}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Học viên Quét Mã Check-in</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Attendance Ledger (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                Nhật Ký Điểm Danh Thời Gian Thực
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cập nhật đồng thời vào TimescaleDB & LMS Student State
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">
              {logs.length} Bản ghi
            </span>
          </div>

          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{log.studentName}</span>
                    <span className="font-mono text-[10px] text-slate-500">{log.studentCode}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="text-cyan-400">{log.method}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500">{log.score}</span>
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <div className="text-slate-300">{log.time}</div>
                  <div className="text-emerald-400 flex items-center justify-end gap-1 mt-0.5">
                    <CheckCircle className="w-3 h-3" />
                    <span>Hợp lệ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 leading-relaxed">
            * Dữ liệu điểm danh được ký số bất biến, phục vụ tính toán điều kiện dự thi và cấp chứng chỉ số Blockchain.
          </div>
        </div>
      </div>
    </div>
  );
};
