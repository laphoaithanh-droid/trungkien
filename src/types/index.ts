export type NavTab = 
  | 'architect'
  | 'architecture'
  | 'dashboard'
  | 'exam_studio'
  | 'edu_game'
  | 'moodle_hub'
  | 'scheduler'
  | 'attendance'
  | 'finance'
  | 'adaptive'
  | 'blockchain'
  | 'students';

export interface ServiceNode {
  id: string;
  name: string;
  category: 'gateway' | 'core' | 'ai' | 'finance' | 'data' | 'security';
  description: string;
  techStack: string[];
  database: string;
  endpoints: string[];
  securityProtocol: string;
  latencyP99: string;
  throughput: string;
  scalingPolicy: string;
  status: 'healthy' | 'degraded' | 'scaling';
}

export interface Student {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  level: string; // B1, B2, C1, IELTS 7.0+
  attendanceRate: number; // percentage
  homeworkScore: number;
  churnRisk: 'low' | 'medium' | 'high';
  paymentStatus: 'paid' | 'partial' | 'pending';
  virtualAccount: string;
  lastActive: string;
}

export interface LeadCandidate {
  id: string;
  inputName: string;
  inputPhone: string;
  inputEmail: string;
  existingMatchId: string | null;
  matchScore: number;
  matchedFields: string[];
  status: 'flagged' | 'clean' | 'merged';
}

export interface ClassScheduleItem {
  id: string;
  className: string;
  subject: string;
  room: string;
  teacher: string;
  dayOfWeek: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7' | 'Chủ Nhật';
  timeSlot: string;
  capacity: number;
  enrolled: number;
  equipmentScore: number;
  conflictStatus: 'optimal' | 'warning' | 'conflict';
}

export interface TransactionRecord {
  id: string;
  referenceNo: string;
  virtualAccount: string;
  studentName: string;
  amount: number;
  timestamp: string;
  bankName: string;
  status: 'reconciled' | 'pending' | 'flagged';
  reconciliationMethod: 'auto_webhook' | 'rpa_matcher' | 'manual_review';
  variance: number;
}

export interface CertificateRecord {
  id: string;
  certNumber: string;
  studentName: string;
  courseName: string;
  finalScore: string;
  issueDate: string;
  expiryDate: string;
  blockchainHash: string;
  blockNumber: number;
  contractAddress: string;
  merkleRoot: string;
  verifiedCount: number;
}

// SKILL: docx-official & ai-agents-architect
export interface ExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  moodleGiftFormat?: string;
}

export interface ExamPaper {
  title: string;
  course: string;
  level: string;
  durationMinutes: number;
  totalPoints: number;
  matrix: {
    grammarCount: number;
    vocabCount: number;
    readingCount: number;
  };
  questions: ExamQuestion[];
}

// SKILL: pptx-official
export interface LessonSlide {
  slideNumber: number;
  title: string;
  type: 'intro' | 'vocabulary' | 'grammar' | 'practice' | 'summary';
  bullets: string[];
  teacherNotes: string;
  visualRecommendation: string;
}

// SKILL: moodle-external-api-development
export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  categoryid: number;
  enrolledStudentsCount: number;
  syncedAt: string;
  status: 'active' | 'archived';
}

export interface MoodleSyncLog {
  id: string;
  apiFunction: string;
  entity: string;
  status: 'success' | 'warning' | 'error';
  recordsSynced: number;
  latencyMs: number;
  timestamp: string;
}

// SKILL: game-development
export interface VocabGameQuestion {
  id: string;
  word: string;
  phonetic: string;
  vietnameseMeaning: string;
  distractors: string[];
  exampleSentence: string;
  hint: string;
  cefrLevel: string;
}

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  studentCode: string;
  score: number;
  streak: number;
  accuracy: number;
  badge: string;
}
