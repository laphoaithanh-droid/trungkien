import { 
  ServiceNode, 
  Student, 
  ClassScheduleItem, 
  TransactionRecord, 
  CertificateRecord,
  ExamPaper,
  LessonSlide,
  MoodleCourse,
  MoodleSyncLog,
  VocabGameQuestion,
  LeaderboardEntry
} from '../types';

export const INITIAL_SERVICES: ServiceNode[] = [
  {
    id: 'svc-gateway',
    name: 'API Gateway & WAF Envoy',
    category: 'gateway',
    description: 'Cổng giao tiếp duy nhất kiểm soát lưu lượng, SSL Termination TLS 1.3, Rate-limiting và định tuyến Micro-frontends.',
    techStack: ['Envoy Proxy', 'Go', 'Redis Token Bucket'],
    database: 'Redis Cluster (Rate Limit state)',
    endpoints: ['/api/v1/*', '/graphql', '/ws/live-stream'],
    securityProtocol: 'mTLS + Cloudflare WAF + DDoS Mitigation Layer 7',
    latencyP99: '4.2 ms',
    throughput: '12,400 rps',
    scalingPolicy: 'HPA auto-scale 3 -> 12 replicas at 65% CPU',
    status: 'healthy',
  },
  {
    id: 'svc-auth',
    name: 'Zero-Trust Identity & Access (IAM)',
    category: 'security',
    description: 'Xác thực định danh đa nhân tố (MFA), cấp phát JWT có thời hạn ngắn (15m), mã hóa 2 lớp và phân quyền ABAC/RBAC.',
    techStack: ['Node.js', 'OAuth 2.1 / OIDC', 'Paseto / JWT'],
    database: 'PostgreSQL (Users & Roles) + Redis (Session Blacklist)',
    endpoints: ['/api/v1/auth/token/exchange', '/api/v1/auth/mfa/verify', '/api/v1/auth/keys'],
    securityProtocol: 'Zero Trust Network Access (ZTNA) + Argon2id Password Hash',
    latencyP99: '11.8 ms',
    throughput: '3,800 rps',
    scalingPolicy: 'Fixed 4 nodes + Auto-failover Multi-AZ',
    status: 'healthy',
  },
  {
    id: 'svc-adaptive',
    name: 'Adaptive Learning & AI Scoring Engine',
    category: 'ai',
    description: 'Động cơ học tập thích ứng: Speech-to-Text phát âm, thuật toán Spaced Repetition (SM-2), OCR chấm luận và phân tích cảm xúc học viên.',
    techStack: ['Python FastAPI', 'Gemini 3.8 Flash', 'PyTorch / ONNX'],
    database: 'Qdrant Vector DB (Embeddings) + MongoDB (Submission history)',
    endpoints: ['/api/v1/ai/pronounce-eval', '/api/v1/ai/spaced-repetition/next', '/api/v1/ai/ocr-grade'],
    securityProtocol: 'Encrypted payload AES-256 + Private VPC Peering',
    latencyP99: '82.0 ms',
    throughput: '850 rps',
    scalingPolicy: 'GPU/CPU Worker autoscaling on demand',
    status: 'healthy',
  },
  {
    id: 'svc-attendance',
    name: 'Biometric Attendance & Dynamic QR',
    category: 'core',
    description: 'Xác thực khuôn mặt FaceID chống gian lận (Liveness Detection) và cấp phát mã QR xoay vòng TOTP 15 giây mã hóa muối.',
    techStack: ['Go', 'TensorRT Edge', 'WebSocket'],
    database: 'TimescaleDB (Điểm danh chuỗi thời gian) + Redis Pub/Sub',
    endpoints: ['/api/v1/attendance/face-verify', '/api/v1/attendance/qr/generate-dynamic', '/api/v1/attendance/logs'],
    securityProtocol: 'Face Vector hashing (không lưu trữ raw image) + TOTP HMAC-SHA256',
    latencyP99: '18.4 ms',
    throughput: '2,400 rps',
    scalingPolicy: 'Scale x3 vào 2 khung giờ cao điểm (17:00 & 19:00)',
    status: 'healthy',
  },
  {
    id: 'svc-finance',
    name: 'Virtual Account & Auto-Reconciliation Hub',
    category: 'finance',
    description: 'Quản lý tài khoản định danh ảo (Virtual Account), kết nối Webhook ngân hàng, đối soát 100% tự động và phát hành hóa đơn điện tử.',
    techStack: ['Java Spring Boot 3', 'Kafka Event Bus', 'RPA Engine'],
    database: 'PostgreSQL Multi-Write (Ledger bất biến) + Kafka Topics',
    endpoints: ['/api/v1/finance/va/create', '/api/v1/finance/webhook/napas', '/api/v1/finance/reconcile/run'],
    securityProtocol: 'PCI-DSS Level 1 compliant + Chữ ký số RSA-4096 ngân hàng',
    latencyP99: '15.0 ms',
    throughput: '1,950 rps',
    scalingPolicy: 'Chống trùng lặp Idempotency Token cho 100% giao dịch',
    status: 'healthy',
  },
  {
    id: 'svc-scheduler',
    name: 'Smart Scheduling & Resource Optimizer',
    category: 'core',
    description: 'Thuật toán tối ưu hóa phòng học và cân bằng giờ dạy giảng viên (Genetic Algorithm & Constraint Programming), triệt tiêu xung đột.',
    techStack: ['Rust', 'Google OR-Tools Wrapper', 'gRPC'],
    database: 'PostgreSQL (Classroom & Faculty constraints)',
    endpoints: ['/api/v1/schedule/optimize', '/api/v1/schedule/conflicts/check', '/api/v1/schedule/publish'],
    securityProtocol: 'Internal Service-to-Service mTLS only',
    latencyP99: '65.0 ms',
    throughput: '420 rps',
    scalingPolicy: 'Batch worker job execution',
    status: 'healthy',
  },
  {
    id: 'svc-blockchain',
    name: 'Blockchain Credential Ledger',
    category: 'data',
    description: 'Cấp phát và xác thực chứng chỉ số bất biến trên mạng lưới phân tán, tra cứu QR tức thì chống làm giả bằng Merkle Tree Root.',
    techStack: ['Solidity', 'Ethers.js', 'IPFS Metadata Gateway'],
    database: 'Ethereum L2 / EduChain Smart Contract + IPFS',
    endpoints: ['/api/v1/credentials/mint', '/api/v1/credentials/verify/:hash', '/api/v1/credentials/export-pdf'],
    securityProtocol: 'ECDSA secp256k1 Cryptographic Signatures',
    latencyP99: '35.0 ms',
    throughput: '620 rps',
    scalingPolicy: 'L2 State Rollup batch verification',
    status: 'healthy',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-001',
    code: 'TK-2026-881',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0912345678',
    course: 'IELTS Intensive 7.5+',
    level: 'C1 Academic',
    attendanceRate: 96,
    homeworkScore: 92,
    churnRisk: 'low',
    paymentStatus: 'paid',
    virtualAccount: 'TK-IELTS-8810',
    lastActive: '10 phút trước',
  },
  {
    id: 'std-002',
    code: 'TK-2026-882',
    fullName: 'Trần Thị Thu Hà',
    email: 'thuha.tran@outlook.com',
    phone: '0987654321',
    course: 'IELTS Mastery 6.5',
    level: 'B2 Upper',
    attendanceRate: 72,
    homeworkScore: 68,
    churnRisk: 'high',
    paymentStatus: 'partial',
    virtualAccount: 'TK-IELTS-8821',
    lastActive: '3 ngày trước',
  },
  {
    id: 'std-003',
    code: 'TK-2026-883',
    fullName: 'Lê Hoàng Minh',
    email: 'minh.lehoang@gmail.com',
    phone: '0903112233',
    course: 'Business Communication Elite',
    level: 'B2 Business',
    attendanceRate: 90,
    homeworkScore: 85,
    churnRisk: 'low',
    paymentStatus: 'paid',
    virtualAccount: 'TK-BUS-8832',
    lastActive: '2 giờ trước',
  },
  {
    id: 'std-004',
    code: 'TK-2026-884',
    fullName: 'Phạm Quỳnh Nga',
    email: 'quynhnga.p@gmail.com',
    phone: '0938445566',
    course: 'TOEIC 850+ Speed Run',
    level: 'B2 Listening/Reading',
    attendanceRate: 82,
    homeworkScore: 78,
    churnRisk: 'medium',
    paymentStatus: 'paid',
    virtualAccount: 'TK-TOEIC-8843',
    lastActive: 'Hôm qua',
  },
  {
    id: 'std-005',
    code: 'TK-2026-885',
    fullName: 'Vũ Đức Thịnh',
    email: 'thinh.vu@techcorp.vn',
    phone: '0977889900',
    course: 'IELTS Intensive 7.5+',
    level: 'C1 Academic',
    attendanceRate: 98,
    homeworkScore: 95,
    churnRisk: 'low',
    paymentStatus: 'paid',
    virtualAccount: 'TK-IELTS-8854',
    lastActive: '30 phút trước',
  },
  {
    id: 'std-006',
    code: 'TK-2026-886',
    fullName: 'Hoàng Kim Chi',
    email: 'kimchi.hoang@gmail.com',
    phone: '0915667788',
    course: 'English for Academic Purposes',
    level: 'B1 Pre-IELTS',
    attendanceRate: 64,
    homeworkScore: 58,
    churnRisk: 'high',
    paymentStatus: 'pending',
    virtualAccount: 'TK-EAP-8865',
    lastActive: '5 ngày trước',
  },
];

export const INITIAL_SCHEDULE: ClassScheduleItem[] = [
  {
    id: 'sch-01',
    className: 'IELTS-INT-01',
    subject: 'IELTS Writing & Speaking C1',
    room: 'Phòng Lab 201 (Smart Media)',
    teacher: 'Thầy Trung Kiên (Head Architect & Master Trainer)',
    dayOfWeek: 'Thứ 2',
    timeSlot: '18:00 - 20:00',
    capacity: 18,
    enrolled: 16,
    equipmentScore: 98,
    conflictStatus: 'optimal',
  },
  {
    id: 'sch-02',
    className: 'IELTS-MAS-02',
    subject: 'IELTS Reading & Listening 6.5',
    room: 'Phòng Hội thảo 302',
    teacher: 'Cô Sarah Jenkins (Bản ngữ - CELTA)',
    dayOfWeek: 'Thứ 2',
    timeSlot: '18:00 - 20:00',
    capacity: 22,
    enrolled: 20,
    equipmentScore: 92,
    conflictStatus: 'optimal',
  },
  {
    id: 'sch-03',
    className: 'TOEIC-ADV-03',
    subject: 'TOEIC Listening Comprehension',
    room: 'Phòng Acoustic 104',
    teacher: 'Thầy David Miller (IELTS 8.5 Examiner)',
    dayOfWeek: 'Thứ 3',
    timeSlot: '19:30 - 21:30',
    capacity: 25,
    enrolled: 24,
    equipmentScore: 95,
    conflictStatus: 'optimal',
  },
  {
    id: 'sch-04',
    className: 'BUS-ENG-04',
    subject: 'Executive Negotiation & Presentation',
    room: 'Phòng Studio A (Recording)',
    teacher: 'Cô Mai Nguyễn (MBA / Master of Applied Linguistics)',
    dayOfWeek: 'Thứ 4',
    timeSlot: '18:30 - 20:30',
    capacity: 15,
    enrolled: 14,
    equipmentScore: 99,
    conflictStatus: 'optimal',
  },
  {
    id: 'sch-05',
    className: 'IELTS-INT-02',
    subject: 'IELTS Academic Mock Test Lab',
    room: 'Phòng Computer Lab 203',
    teacher: 'Thầy Trung Kiên (Head Architect & Master Trainer)',
    dayOfWeek: 'Thứ 6',
    timeSlot: '18:00 - 20:00',
    capacity: 20,
    enrolled: 19,
    equipmentScore: 97,
    conflictStatus: 'optimal',
  },
  {
    id: 'sch-06',
    className: 'IELTS-SPK-06',
    subject: 'Adaptive Pronunciation Coaching 1-on-1',
    room: 'AI Soundproof Booth 01',
    teacher: 'AI Virtual Examiner & Cô Sarah Jenkins',
    dayOfWeek: 'Thứ 7',
    timeSlot: '09:00 - 11:30',
    capacity: 10,
    enrolled: 10,
    equipmentScore: 100,
    conflictStatus: 'optimal',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-001',
    referenceNo: 'FT262981093847',
    virtualAccount: 'TK-IELTS-8810',
    studentName: 'Nguyễn Văn An',
    amount: 14500000,
    timestamp: '2026-10-29 08:14:22',
    bankName: 'Vietcombank NAPAS',
    status: 'reconciled',
    reconciliationMethod: 'auto_webhook',
    variance: 0,
  },
  {
    id: 'tx-002',
    referenceNo: 'FT262981093848',
    virtualAccount: 'TK-BUS-8832',
    studentName: 'Lê Hoàng Minh',
    amount: 12000000,
    timestamp: '2026-10-29 09:22:10',
    bankName: 'Techcombank VietQR',
    status: 'reconciled',
    reconciliationMethod: 'auto_webhook',
    variance: 0,
  },
  {
    id: 'tx-003',
    referenceNo: 'FT262981093849',
    virtualAccount: 'TK-TOEIC-8843',
    studentName: 'Phạm Quỳnh Nga',
    amount: 7800000,
    timestamp: '2026-10-29 10:05:41',
    bankName: 'MB Bank',
    status: 'reconciled',
    reconciliationMethod: 'auto_webhook',
    variance: 0,
  },
  {
    id: 'tx-004',
    referenceNo: 'FT262981093850',
    virtualAccount: 'TK-IELTS-8854',
    studentName: 'Vũ Đức Thịnh',
    amount: 14500000,
    timestamp: '2026-10-28 17:40:15',
    bankName: 'BIDV SmartBanking',
    status: 'reconciled',
    reconciliationMethod: 'rpa_matcher',
    variance: 0,
  },
  {
    id: 'tx-005',
    referenceNo: 'FT262981093851',
    virtualAccount: 'TK-IELTS-8821',
    studentName: 'Trần Thị Thu Hà (Đợt 1)',
    amount: 6000000,
    timestamp: '2026-10-27 14:12:00',
    bankName: 'ACB QR Pay',
    status: 'reconciled',
    reconciliationMethod: 'auto_webhook',
    variance: 0,
  },
];

export const INITIAL_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-01',
    certNumber: 'TK-2026-IELTS-8501',
    studentName: 'Nguyễn Văn An',
    courseName: 'IELTS Academic Mastery Program',
    finalScore: 'Band 8.0 Overall (L: 8.5, R: 8.5, W: 7.5, S: 7.5)',
    issueDate: '2026-10-15',
    expiryDate: '2028-10-15',
    blockchainHash: '0x7e8b91c49b0fa2a912e9b867c4df196d4218a5fe8f0a3d463e27f09c6298f612',
    blockNumber: 19842104,
    contractAddress: '0x4f128bcde9814671c6d1f90a4b7721e901a87b32',
    merkleRoot: '0xa41b9812ccf1490b82f91a0c49b6e821',
    verifiedCount: 14,
  },
  {
    id: 'cert-02',
    certNumber: 'TK-2026-TOEIC-9204',
    studentName: 'Lê Hoàng Minh',
    courseName: 'Advanced Business English & TOEIC 900',
    finalScore: 'Score: 940/990 (CEFR C1 Professional)',
    issueDate: '2026-09-30',
    expiryDate: '2028-09-30',
    blockchainHash: '0x3a9c72e1180fbe98716da024f923c7b28e519c620478df88319ba34c11894d01',
    blockNumber: 19821940,
    contractAddress: '0x4f128bcde9814671c6d1f90a4b7721e901a87b32',
    merkleRoot: '0xd81c4728990afbb134ef02847a98210b',
    verifiedCount: 8,
  },
];

export const FLASHCARD_DECK = [
  {
    id: 'fc-1',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere at the same time.',
    collocations: 'ubiquitous presence, ubiquitous smartphone usage, ubiquitous technology',
    vietnamese: 'Có mặt ở khắp mọi nơi, phổ biến rộng rãi',
    exampleSentence: 'In the digital era, mobile learning applications have become ubiquitous among language students.',
    intervalDays: 6,
    repetitions: 3,
    easeFactor: 2.5,
  },
  {
    id: 'fc-2',
    word: 'Corroborate',
    phonetic: '/kəˈrɒb.ə.reɪt/',
    partOfSpeech: 'verb',
    definition: 'To confirm or give support to a statement, theory, or finding.',
    collocations: 'corroborate evidence, corroborate findings, corroborate testimony',
    vietnamese: 'Xác thực, chứng thực, củng cố bằng chứng',
    exampleSentence: 'The empirical metrics from the LMS corroborate the hypothesis that spaced repetition elevates long-term retention.',
    intervalDays: 3,
    repetitions: 2,
    easeFactor: 2.4,
  },
  {
    id: 'fc-3',
    word: 'Paradigm shift',
    phonetic: '/ˈpær.ə.daɪm ʃɪft/',
    partOfSpeech: 'noun',
    definition: 'A fundamental change in approach or underlying assumptions.',
    collocations: 'initiate a paradigm shift, represent a paradigm shift, technological paradigm shift',
    vietnamese: 'Sự chuyển dịch mô thức căn bản',
    exampleSentence: 'Integrating AI adaptive feedback represents a profound paradigm shift in educational pedagogy.',
    intervalDays: 1,
    repetitions: 1,
    easeFactor: 2.3,
  },
];

// SKILL: docx-official & ai-agents-architect Mock Exam
export const INITIAL_EXAM_PAPER: ExamPaper = {
  title: 'IELTS Academic Mastery - Mid-term Progress Test',
  course: 'IELTS Intensive Band 7.5+',
  level: 'C1 - Advanced',
  durationMinutes: 45,
  totalPoints: 10,
  matrix: {
    grammarCount: 3,
    vocabCount: 4,
    readingCount: 3,
  },
  questions: [
    {
      id: 1,
      question: 'Had the government implemented strict carbon-tax policies earlier, the degradation of marine ecosystems ________ so drastically.',
      options: [
        'A. would not have escalated',
        'B. will not escalate',
        'C. did not escalate',
        'D. would not escalate'
      ],
      correctAnswer: 0,
      explanation: 'Đảo ngữ câu điều kiện loại 3 (Inversion of Third Conditional: Had + S + V3/ed, S + would have + V3/ed) diễn tả giả định trái ngược với quá khứ.',
      difficulty: 'hard',
      topic: 'Conditionals & Environmental Science'
    },
    {
      id: 2,
      question: 'The research committee found empirical evidence to ________ the correlation between bilingualism and cognitive flexibility in older adults.',
      options: [
        'A. corroborate',
        'B. undermine',
        'C. fabricate',
        'D. refute'
      ],
      correctAnswer: 0,
      explanation: 'Từ vựng học thuật C1: "corroborate" có nghĩa là chứng thực, củng cố bằng chứng (to confirm or support with evidence).',
      difficulty: 'medium',
      topic: 'Academic Vocabulary'
    },
    {
      id: 3,
      question: 'Not only ________ the foundational hypothesis, but the author also proposed a paradigm-shifting methodology for neural linguistic analysis.',
      options: [
        'A. she questioned',
        'B. did she question',
        'C. was she questioning',
        'D. she had questioned'
      ],
      correctAnswer: 1,
      explanation: 'Đảo ngữ với cụm "Not only... but also...": Cụm "Not only" đứng đầu mệnh đề buộc phải đảo trợ động từ lên trước chủ ngữ ("did she question").',
      difficulty: 'hard',
      topic: 'Advanced Inversion'
    },
    {
      id: 4,
      question: 'Sustainable urban transit requires a holistic strategy that takes into account both environmental factors ________ public accessibility.',
      options: [
        'A. as well',
        'B. and also',
        'C. and',
        'D. alongside with'
      ],
      correctAnswer: 2,
      explanation: 'Cặp liên từ song song cố định: "both A and B".',
      difficulty: 'easy',
      topic: 'Correlative Conjunctions'
    },
    {
      id: 5,
      question: 'The minister was heavily criticized for making statements that directly ________ the findings published by the national research council.',
      options: [
        'A. contradicted',
        'B. reconciled',
        'C. consented',
        'D. verified'
      ],
      correctAnswer: 0,
      explanation: '"contradicted" (mâu thuẫn, phản bác) phù hợp với ngữ cảnh bị chỉ trích vì đưa ra phát ngôn trái ngược với kết quả nghiên cứu.',
      difficulty: 'medium',
      topic: 'Collocations & Logic'
    }
  ]
};

// SKILL: pptx-official Mock Presentation Outline
export const INITIAL_LESSON_SLIDES: LessonSlide[] = [
  {
    slideNumber: 1,
    title: 'IELTS Writing Task 2: Advanced Cohesion & Inversion',
    type: 'intro',
    bullets: [
      'Mục tiêu buổi học: Làm chủ 4 cấu trúc đảo ngữ Band 7.5+',
      'Kỹ thuật liên kết ý tưởng bằng Transition Connectors',
      'Phân tích bài mẫu Band 8.5 từ cựu giám khảo Cambridge'
    ],
    teacherNotes: 'Khởi động bằng bài tập nối vế câu 3 phút trước khi vào nội dung chính.',
    visualRecommendation: 'Sơ đồ tư duy dạng mạng lưới (Concept Map) kết nối Coherence và Cohesion.'
  },
  {
    slideNumber: 2,
    title: 'Cấu trúc 1: Đảo ngữ Phủ định (Negative Inversions)',
    type: 'grammar',
    bullets: [
      'Công thức: Seldom / Rarely / Under no circumstances + Trợ động từ + S + V',
      'Ví dụ kinh điển: "Rarely do modern societies experience such seismic shifts."',
      'Lỗi sai phổ biến: Quên đảo trợ động từ hoặc đảo nhầm dạng thì quá khứ.'
    ],
    teacherNotes: 'Yêu cầu 3 học viên ngẫu nhiên viết lại câu đơn thành câu đảo ngữ lên bảng phụ.',
    visualRecommendation: 'Bảng so sánh 2 cột: Câu thông thường vs. Câu đảo ngữ nhấn mạnh.'
  },
  {
    slideNumber: 3,
    title: 'Từ vựng Học thuật: High-Scoring Academic Collocations',
    type: 'vocabulary',
    bullets: [
      'Profound implication (hệ quả sâu sắc)',
      'Exacerbate environmental degradation (làm trầm trọng suy thoái môi trường)',
      'Spearhead the transition towards renewables (tiên phong chuyển dịch năng lượng)'
    ],
    teacherNotes: 'Giải thích sắc thái ngữ nghĩa (connotation) và kết hợp từ tự nhiên (collocations).',
    visualRecommendation: 'Infographic minh họa các từ đồng nghĩa và mức độ trang trọng.'
  },
  {
    slideNumber: 4,
    title: 'Thực hành Viết tại lớp (Speed Drill - 15 phút)',
    type: 'practice',
    bullets: [
      'Chủ đề: "Should AI tools be banned in secondary language education?"',
      'Yêu cầu: Viết đoạn Body 1 sử dụng ít nhất 1 câu đảo ngữ và 2 collocations học thuật',
      'Nộp bài trực tiếp qua ứng dụng Trung Kiên để nhận kết quả OCR AI tức thì.'
    ],
    teacherNotes: 'Giảng viên theo dõi tiến độ nộp bài trực tiếp trên Executive Dashboard.',
    visualRecommendation: 'Đồng hồ đếm ngược 15:00 hiển thị lớn trên màn hình lớp học.'
  },
  {
    slideNumber: 5,
    title: 'Tổng kết & Bài tập Spaced Repetition về nhà',
    type: 'summary',
    bullets: [
      'Ôn tập 10 từ vựng cốt lõi qua thuật toán Flashcard SM-2 trên app',
      'Hoàn thiện bài luận 250 từ nộp trước 23:59 Chủ Nhật',
      'Đọc trước tài liệu Unit 6: Cause and Solution Essays'
    ],
    teacherNotes: 'Nhắc nhở học viên kiểm tra điểm danh FaceID và xác nhận lộ trình tự học.',
    visualRecommendation: 'Slide tổng kết dạng Checklist 3 bước hành động rõ ràng.'
  }
];

// SKILL: moodle-external-api-development Mock Courses & Sync
export const INITIAL_MOODLE_COURSES: MoodleCourse[] = [
  {
    id: 101,
    shortname: 'IELTS-INT-75',
    fullname: 'IELTS Academic Intensive 7.5+ (Trung Kiên Campus A)',
    categoryid: 1,
    enrolledStudentsCount: 24,
    syncedAt: '2026-10-30 08:15',
    status: 'active'
  },
  {
    id: 102,
    shortname: 'TOEIC-RUN-800',
    fullname: 'TOEIC Speed Run 800+ Listening & Reading',
    categoryid: 2,
    enrolledStudentsCount: 32,
    syncedAt: '2026-10-30 08:10',
    status: 'active'
  },
  {
    id: 103,
    shortname: 'COMM-B2-PRO',
    fullname: 'Tiếng Anh Giao Tiếp Doanh Nghiệp Cấp B2',
    categoryid: 3,
    enrolledStudentsCount: 18,
    syncedAt: '2026-10-29 19:40',
    status: 'active'
  },
  {
    id: 104,
    shortname: 'KIDS-PET-A2',
    fullname: 'Cambridge PET Masterclass - Học sinh Trung học',
    categoryid: 4,
    enrolledStudentsCount: 20,
    syncedAt: '2026-10-29 17:00',
    status: 'active'
  }
];

export const INITIAL_MOODLE_LOGS: MoodleSyncLog[] = [
  {
    id: 'sync-01',
    apiFunction: 'core_user_create_users',
    entity: 'Đồng bộ 5 học viên mới từ CRM sang Moodle',
    status: 'success',
    recordsSynced: 5,
    latencyMs: 142,
    timestamp: '08:22:15'
  },
  {
    id: 'sync-02',
    apiFunction: 'core_grades_update_grades',
    entity: 'Đồng bộ điểm chấm luận AI vào Moodle Gradebook',
    status: 'success',
    recordsSynced: 18,
    latencyMs: 98,
    timestamp: '08:19:40'
  },
  {
    id: 'sync-03',
    apiFunction: 'mod_quiz_add_quiz_question_instance',
    entity: 'Đẩy 10 câu hỏi trắc nghiệm mới vào Quiz Unit 4',
    status: 'success',
    recordsSynced: 10,
    latencyMs: 215,
    timestamp: '08:14:02'
  }
];

// SKILL: game-development Vocab Sprint Questions
export const INITIAL_VOCAB_GAME_QUESTIONS: VocabGameQuestion[] = [
  {
    id: 'vg-1',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    vietnameseMeaning: 'Có mặt ở khắp mọi nơi, rất phổ biến',
    distractors: ['Hiếm gặp, bất thường', 'Nguy hiểm, độc hại', 'Tạm thời, ngắn ngủi'],
    exampleSentence: 'Smartphones have become ubiquitous in daily life.',
    hint: 'Nghĩ đến "omnipresent" - xuất hiện mọi lúc mọi nơi.',
    cefrLevel: 'C1'
  },
  {
    id: 'vg-2',
    word: 'Meticulous',
    phonetic: '/məˈtɪk.jə.ləs/',
    vietnameseMeaning: 'Tỉ mỉ, cẩn thận từng chi tiết nhỏ',
    distractors: ['Cẩu thả, vội vã', 'Ồn ào, huyên náo', 'Lười biếng, uể oải'],
    exampleSentence: 'The architect was meticulous in reviewing every structural blueprint.',
    hint: 'Tính từ mô tả người làm việc kỹ lưỡng, không bỏ sót sai sót nào.',
    cefrLevel: 'B2'
  },
  {
    id: 'vg-3',
    word: 'Corroborate',
    phonetic: '/kəˈrɒb.ə.reɪt/',
    vietnameseMeaning: 'Chứng thực, củng cố thêm bằng chứng',
    distractors: ['Phủ nhận hoàn toàn', 'Tranh cãi gay gắt', 'Bỏ qua một bên'],
    exampleSentence: 'Recent telemetry logs corroborate the security alert.',
    hint: 'Gần nghĩa với "confirm" hoặc "verify".',
    cefrLevel: 'C1'
  },
  {
    id: 'vg-4',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.jənt/',
    vietnameseMeaning: 'Kiên cường, phục hồi nhanh sau khó khăn',
    distractors: ['Dễ vỡ, mỏng manh', 'Chậm chạp, thụ động', 'Ích kỷ, hẹp hòi'],
    exampleSentence: 'The students demonstrated resilient attitudes during the exam period.',
    hint: 'Khả năng bật dậy (bounce back) sau nghịch cảnh.',
    cefrLevel: 'B2'
  },
  {
    id: 'vg-5',
    word: 'Elucidate',
    phonetic: '/iˈluː.sɪ.deɪt/',
    vietnameseMeaning: 'Làm sáng tỏ, giải thích rõ ràng',
    distractors: ['Làm mơ hồ, rối rắm', 'Phán xét vội vã', 'Che giấu bí mật'],
    exampleSentence: 'The lecturer used clear diagrams to elucidate complex syntax.',
    hint: 'Có gốc từ "lucid" - ánh sáng, sự rõ ràng.',
    cefrLevel: 'C1'
  },
  {
    id: 'vg-6',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt.ɪk/',
    vietnameseMeaning: 'Thực tế, thực dụng, trọng hiệu quả',
    distractors: ['Mơ mộng viển vông', 'Bảo thủ cố chấp', 'Nóng nảy bốc đồng'],
    exampleSentence: 'The center adopted a pragmatic approach to language training.',
    hint: 'Trái nghĩa với "idealistic" hay lý thuyết suông.',
    cefrLevel: 'B2'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    studentName: 'Nguyễn Văn An',
    studentCode: 'TK-2026-881',
    score: 2840,
    streak: 14,
    accuracy: 98,
    badge: '🏆 Top Scholar'
  },
  {
    rank: 2,
    studentName: 'Vũ Đức Thịnh',
    studentCode: 'TK-2026-885',
    score: 2610,
    streak: 11,
    accuracy: 94,
    badge: '⚡ Speed Demon'
  },
  {
    rank: 3,
    studentName: 'Lê Hoàng Minh',
    studentCode: 'TK-2026-883',
    score: 2420,
    streak: 9,
    accuracy: 91,
    badge: '🔥 Combo Master'
  },
  {
    rank: 4,
    studentName: 'Trần Thị Thu Hà',
    studentCode: 'TK-2026-882',
    score: 2190,
    streak: 7,
    accuracy: 89,
    badge: '🎯 Sharp Shooter'
  },
  {
    rank: 5,
    studentName: 'Hoàng Kim Chi',
    studentCode: 'TK-2026-886',
    score: 1950,
    streak: 5,
    accuracy: 86,
    badge: '⭐ Rising Star'
  }
];
