import { GoogleGenAI } from '@google/genai';

export interface ModelOption {
  id: string;
  name: string;
  tag: string;
  description: string;
  badgeColor: string;
  isDefault?: boolean;
}

export const SUPPORTED_MODELS: ModelOption[] = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash Preview',
    tag: 'Khuyên dùng / Mặc định',
    description: 'Tốc độ phản hồi cực nhanh, thông minh vượt trội, tối ưu quota và chi phí.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isDefault: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro Preview',
    tag: 'Suy luận chuyên sâu',
    description: 'Khả năng phân tích kiến trúc, suy luận đa bước phức tạp với độ chính xác cao nhất.',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'Dự phòng ổn định',
    description: 'Model ổn định cao, độ trễ thấp, phương án dự phòng tin cậy khi các model preview bận.',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
];

export const DEFAULT_MODEL_ID = 'gemini-3-flash-preview';

// Cascade priority list for automatic fallback
export const FALLBACK_CASCADE = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

const STORAGE_KEY_API_KEY = 'trung_kien_gemini_api_key';
const STORAGE_KEY_API_KEY_LEGACY = 'gemini_api_key';
const STORAGE_KEY_MODEL = 'trung_kien_gemini_model';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  const key = 
    localStorage.getItem(STORAGE_KEY_API_KEY) || 
    localStorage.getItem(STORAGE_KEY_API_KEY_LEGACY) || 
    (import.meta as any).env?.VITE_GEMINI_API_KEY || 
    '';
  return key.trim();
}

export function saveStoredApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  const cleanKey = apiKey.trim();
  localStorage.setItem(STORAGE_KEY_API_KEY, cleanKey);
  localStorage.setItem(STORAGE_KEY_API_KEY_LEGACY, cleanKey);
}

export function removeStoredApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_API_KEY);
  localStorage.removeItem(STORAGE_KEY_API_KEY_LEGACY);
}

export function getStoredModel(): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL_ID;
  return localStorage.getItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL_ID;
}

export function saveStoredModel(modelId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_MODEL, modelId);
}

export interface StepStatus {
  step: number;
  title: string;
  status: 'idle' | 'running' | 'success' | 'error' | 'stopped';
  detail?: string;
}

export interface ExecutionState {
  steps: StepStatus[];
  activeModel: string;
  progressPercent: number;
  hasError: boolean;
  verbatimError?: string;
  fallbackCount: number;
}

export interface FallbackCallbackInfo {
  failedModel: string;
  nextModel: string;
  error: any;
  verbatimErrorMessage: string;
}

export const ARCHITECT_SYSTEM_INSTRUCTION = `Bạn là một Chuyên gia Tư vấn Giải pháp Công nghệ Giáo dục (Senior EdTech Solutions Architect) và là Kiến trúc sư trưởng của hệ thống quản lý trung tâm ngoại ngữ Trung Kiên. Bạn sở hữu tư duy hệ thống sắc bén, am hiểu sâu sắc về kiến trúc phần mềm hiện đại (Microservices, Micro-frontends) và có khả năng chuyển đổi các yêu cầu nghiệp vụ giáo dục phức tạp thành các giải pháp kỹ thuật thực thi.

Mục tiêu cốt lõi của bạn là hỗ trợ đội ngũ phát triển và ban quản trị trong việc triển khai, vận hành và mở rộng hệ thống Trung Kiên. Bạn phải:
- Giải thích và chi tiết hóa các tính năng kỹ thuật dựa trên nền tảng Microservices và Micro-frontends.
- Tư vấn về trải nghiệm người dùng (UI/UX) theo hướng cá nhân hóa và thông minh (AI-driven).
- Đảm bảo mọi giải pháp đều tuân thủ tiêu chuẩn bảo mật Zero Trust và kiến trúc hướng dữ liệu (Data-driven).
- Tối ưu hóa quy trình vận hành từ quản lý học viên, tài chính đến đào tạo bằng các công nghệ tiên tiến như Blockchain, AI, và RPA.

Quy tắc & Định dạng phản hồi:
- Phong cách: Chuyên nghiệp, quyết đoán, mang tính tầm nhìn và giàu hàm lượng kỹ thuật.
- Ngôn ngữ: Sử dụng thuật ngữ công nghệ chính xác (như CI/CD, SAST/DAST, RPA, Churn Rate, Kafka, Redis Cluster, Zero Trust, mTLS, AES-256).
- Tư duy: Luôn đặt câu hỏi "Làm thế nào để tối ưu hóa hơn nữa?" và "Dữ liệu này có thể dự báo được gì?".
- Cấu trúc phản hồi theo đúng 3 định dạng tùy theo câu hỏi:
  + Khi phân tích tính năng:
    - Tên tính năng: [Tên]
    - Kiến trúc đề xuất: [Microservice xử lý riêng...]
    - Logic thực hiện: [Các bước xử lý từ backend đến frontend]
    - Công nghệ tích hợp: [Danh sách công nghệ AI/Blockchain/RPA...]
    - Giá trị kinh doanh: [Lợi ích cho trung tâm/học viên]
  + Khi tư vấn kỹ thuật (Technical Spec):
    - Endpoint/Workflow: [Mô tả quy trình dữ liệu]
    - Security Check: [Các lớp bảo mật cần áp dụng]
    - Infrastructure Note: [Yêu cầu về tài nguyên Cloud]
  + Khi báo cáo phân tích (BI/Analytics):
    - Chỉ số (KPIs): [Các chỉ số quan trọng]
    - Dự báo (Insights): [Dựa trên dữ liệu lịch sử]
    - Hành động đề xuất: [Khuyến nghị cho quản lý]

Lưu ý: Luôn kết thúc bằng việc nhắc lại rằng hệ thống Trung Kiên không chỉ là công cụ quản lý, mà là một "Hệ sinh thái công nghệ giáo dục thông minh".`;

// Extract clean verbatim error string from Gemini API / Error object
export function extractVerbatimError(err: any): string {
  if (!err) return 'Lỗi không xác định';
  if (typeof err === 'string') return err;
  if (err.message) {
    // If it's a JSON string from API, try to parse
    try {
      const parsed = JSON.parse(err.message);
      if (parsed.error?.message) {
        return `${parsed.error.code ? `[${parsed.error.code}] ` : ''}${parsed.error.message}${parsed.error.status ? ` (${parsed.error.status})` : ''}`;
      }
    } catch {
      // not json
    }
    return err.message;
  }
  return JSON.stringify(err);
}

// Build model cascade starting from the chosen preferred model
export function buildModelCascade(preferredModel: string): string[] {
  const list = [preferredModel];
  for (const m of FALLBACK_CASCADE) {
    if (!list.includes(m)) {
      list.push(m);
    }
  }
  return list;
}

// Low-level helper to execute a Gemini call with Automatic Fallback & Retry
export async function runWithModelFallback<T>(
  operation: (client: GoogleGenAI, modelName: string) => Promise<T>,
  options?: {
    customApiKey?: string;
    preferredModel?: string;
    onModelFallback?: (info: FallbackCallbackInfo) => void;
  }
): Promise<{ result: T; modelUsed: string }> {
  const apiKey = options?.customApiKey || getStoredApiKey();
  if (!apiKey) {
    throw new Error('CHƯA_CÓ_API_KEY: Vui lòng nhập Gemini API Key của bạn để sử dụng ứng dụng.');
  }

  const preferredModel = options?.preferredModel || getStoredModel();
  const modelsToTry = buildModelCascade(preferredModel);

  const client = new GoogleGenAI({
    apiKey,
  });

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    try {
      const result = await operation(client, currentModel);
      return { result, modelUsed: currentModel };
    } catch (err: any) {
      lastError = err;
      const verbatimError = extractVerbatimError(err);
      console.warn(`[Trung Kien AI Fallback] Thất bại với model "${currentModel}":`, verbatimError);

      const hasNext = i + 1 < modelsToTry.length;
      if (hasNext) {
        const nextModel = modelsToTry[i + 1];
        options?.onModelFallback?.({
          failedModel: currentModel,
          nextModel,
          error: err,
          verbatimErrorMessage: verbatimError,
        });
        // Brief exponential backoff pause before trying fallback model
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  }

  // All models failed: throw verbatim error
  const finalVerbatim = extractVerbatimError(lastError);
  throw new Error(finalVerbatim);
}

// Test an API Key with a small prompt
export async function testGeminiApiKey(
  apiKey: string,
  modelName: string = DEFAULT_MODEL_ID
): Promise<{ success: boolean; model: string; error?: string }> {
  try {
    if (!apiKey || !apiKey.trim()) {
      return { success: false, model: modelName, error: 'API Key không được để trống.' };
    }
    const client = new GoogleGenAI({ apiKey: apiKey.trim() });
    const response = await client.models.generateContent({
      model: modelName,
      contents: 'Ping: Trả lời ngắn gọn 1 chữ "OK" để xác thực kết nối hệ thống Trung Kiên.',
    });
    const text = response.text || '';
    if (text) {
      return { success: true, model: modelName };
    }
    return { success: false, model: modelName, error: 'Không nhận được dữ liệu phản hồi từ Gemini API.' };
  } catch (err: any) {
    return { success: false, model: modelName, error: extractVerbatimError(err) };
  }
}

// Feature 1: Architect Advisor Chat with Fallback
export async function callArchitectChat(params: {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  queryType?: 'feature' | 'spec' | 'analytics';
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ reply: string; modelUsed: string }> {
  const { message, history = [], queryType = 'feature', onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

      // History
      for (const item of history.slice(-6)) {
        contents.push({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }],
        });
      }

      let userPrompt = message;
      if (queryType === 'feature') {
        userPrompt = `[Yêu cầu phân tích tính năng theo format chuẩn Trung Kiên]: ${message}`;
      } else if (queryType === 'spec') {
        userPrompt = `[Yêu cầu tư vấn kỹ thuật Technical Spec theo format chuẩn Trung Kiên]: ${message}`;
      } else if (queryType === 'analytics') {
        userPrompt = `[Yêu cầu báo cáo phân tích BI & Dự báo theo format chuẩn Trung Kiên]: ${message}`;
      }

      contents.push({
        role: 'user',
        parts: [{ text: userPrompt }],
      });

      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      const reply = response.text || '';
      if (!reply) {
        throw new Error('Gemini API trả về nội dung trống.');
      }
      return reply;
    },
    { onModelFallback }
  );

  return { reply: result, modelUsed };
}

// Feature 2: Speech & Pronunciation Assessment
export async function callPronunciationAssess(params: {
  targetSentence: string;
  userSpokenText: string;
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ data: any; modelUsed: string }> {
  const { targetSentence, userSpokenText, onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const prompt = `Bạn là hệ thống AI Adaptive Learning đánh giá phát âm ngoại ngữ cho học viên Trung Kiên.
Câu chuẩn: "${targetSentence}"
Học viên đã nói: "${userSpokenText}"
Hãy phân tích phát âm và trả lời dưới định dạng JSON với các trường:
{
  "accuracyScore": số từ 0-100,
  "fluencyScore": số từ 0-100,
  "intonationScore": số từ 0-100,
  "overallScore": số từ 0-100,
  "phonemeFeedback": [
    { "word": "từ", "status": "correct"|"warning"|"incorrect", "phonetic": "phiên âm IPA", "note": "nhận xét" }
  ],
  "recommendations": "lời khuyên luyện tập tiếp theo"
}`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const raw = response.text || '{}';
      return JSON.parse(raw);
    },
    { onModelFallback }
  );

  return { data: result, modelUsed };
}

// Feature 3: OCR Essay Evaluation
export async function callOcrGrade(params: {
  submissionText: string;
  rubric?: string;
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ data: any; modelUsed: string }> {
  const { submissionText, rubric = 'IELTS Task 2', onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const prompt = `Bạn là hệ thống AI OCR & Chấm bài tự động cho Trung Kiên Smart EdTech.
Tiêu chí chấm: ${rubric}
Bài làm của học viên:
"${submissionText}"

Trả lời dưới định dạng JSON:
{
  "bandScore": số điểm ước lượng (e.g. 6.5, 7.0),
  "taskAchievement": số điểm trên 9,
  "coherenceCohesion": số điểm trên 9,
  "lexicalResource": số điểm trên 9,
  "grammaticalRange": số điểm trên 9,
  "detectedErrors": [
    { "original": "lỗi trong bài", "correction": "sửa đúng", "explanation": "lý do" }
  ],
  "positiveHighlights": ["điểm mạnh 1", "điểm mạnh 2"],
  "actionPlan": "kế hoạch bồi dưỡng cá nhân hóa"
}`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text || '{}';
      return JSON.parse(raw);
    },
    { onModelFallback }
  );

  return { data: result, modelUsed };
}

// Feature 4: Student Sentiment & Churn Risk
export async function callSentimentAnalysis(params: {
  feedbackText: string;
  attendanceRate?: number;
  homeworkCompletionRate?: number;
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ data: any; modelUsed: string }> {
  const { feedbackText, attendanceRate = 85, homeworkCompletionRate = 80, onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const prompt = `Phân tích cảm xúc và nguy cơ rời bỏ khóa học (Churn Rate) của học viên Trung tâm Ngoại ngữ Trung Kiên.
Phản hồi của học viên: "${feedbackText}"
Tỷ lệ đi học: ${attendanceRate}%
Tỷ lệ làm bài tập: ${homeworkCompletionRate}%

Trả về JSON:
{
  "sentiment": "Positive" | "Neutral" | "Negative" | "At-Risk",
  "satisfactionScore": số từ 0-100,
  "churnRiskPercentage": số từ 0-100,
  "keyDrivers": ["yếu tố chính 1", "yếu tố 2"],
  "interventionStrategy": "biện pháp can thiệp tự động qua RPA / CSKH"
}`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const raw = response.text || '{}';
      return JSON.parse(raw);
    },
    { onModelFallback }
  );

  return { data: result, modelUsed };
}

// Feature 5: AI Exam Paper & Moodle GIFT Generator (SKILL: docx-official & moodle-external-api-development)
export async function callGenerateExamPaper(params: {
  course: string;
  level: string;
  topic: string;
  questionCount: number;
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ data: any; modelUsed: string }> {
  const { course, level, topic, questionCount, onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const prompt = `Bạn là Chuyên gia Khảo thí và Thiết kế Đề thi Ngoại ngữ cho Trung tâm Ngoại ngữ Trung Kiên.
Hãy biên soạn một đề thi chuẩn hóa cấp độ ${level} (${course}) theo chủ đề "${topic}" gồm đúng ${questionCount} câu hỏi trắc nghiệm chất lượng cao.
Yêu cầu định dạng JSON CHÍNH XÁC:
{
  "title": "Tên bài kiểm tra",
  "course": "${course}",
  "level": "${level}",
  "durationMinutes": ${Math.max(15, questionCount * 3)},
  "totalPoints": 10,
  "matrix": {
    "grammarCount": số câu ngữ pháp,
    "vocabCount": số câu từ vựng,
    "readingCount": số câu đọc hiểu
  },
  "questions": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi tiếng Anh với chỗ trống hoặc yêu cầu chọn đáp án đúng",
      "options": ["A. Lựa chọn 1", "B. Lựa chọn 2", "C. Lựa chọn 3", "D. Lựa chọn 4"],
      "correctAnswer": 0,
      "explanation": "Giải thích chi tiết ngữ pháp và ngữ nghĩa tại sao đáp án này đúng",
      "difficulty": "medium",
      "topic": "${topic}"
    }
  ]
}`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const raw = response.text || '{}';
      return JSON.parse(raw);
    },
    { onModelFallback }
  );

  return { data: result, modelUsed };
}

// Feature 6: AI Lesson Slides & Pedagogy Outline (SKILL: pptx-official)
export async function callGenerateLessonSlides(params: {
  topic: string;
  level: string;
  durationMins: number;
  onModelFallback?: (info: FallbackCallbackInfo) => void;
}): Promise<{ data: any[]; modelUsed: string }> {
  const { topic, level, durationMins, onModelFallback } = params;

  const { result, modelUsed } = await runWithModelFallback(
    async (client, model) => {
      const prompt = `Bạn là Chuyên gia Thiết kế Bài giảng và Giáo án Số cho Trung tâm Ngoại ngữ Trung Kiên.
Hãy soạn dàn ý Slide PowerPoint (Presentation) cho buổi học thời lượng ${durationMins} phút, chủ đề "${topic}", trình độ ${level}.
Trả về mảng JSON với 5-6 slides:
[
  {
    "slideNumber": 1,
    "title": "Tiêu đề Slide",
    "type": "intro" | "vocabulary" | "grammar" | "practice" | "summary",
    "bullets": ["Ý chính 1", "Ý chính 2", "Ý chính 3"],
    "teacherNotes": "Ghi chú dành cho giảng viên hướng dẫn lớp",
    "visualRecommendation": "Gợi ý hình ảnh hoặc sơ đồ minh họa phù hợp cho slide"
  }
]`;

      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const raw = response.text || '[]';
      return JSON.parse(raw);
    },
    { onModelFallback }
  );

  return { data: result, modelUsed };
}

// Deterministic offline fallback responses for demo and development without API Key
export function generateOfflineArchitectFallback(prompt: string, queryType: string): string {
  const p = prompt.toLowerCase();

  if (queryType === 'spec' || p.includes('spec') || p.includes('endpoint') || p.includes('kỹ thuật') || p.includes('zero trust')) {
    return `### Tư vấn Kỹ thuật (Technical Spec) - Trung Kiên Smart EdTech (Offline Mode)

- **Endpoint/Workflow:**
  + \`POST /api/v1/auth/token/exchange\` -> API Gateway xác thực mTLS và kiểm tra chứng chỉ máy trạm.
  + \`POST /api/v1/attendance/face-verify\` -> Payload chứa Vector Embeddings (128-D) + Timestamp Nonce + Signature từ thiết bị Edge IoT.
  + \`EVENT_BUS kafka.topic.attendance.verified\` -> Message queue phân tán cập nhật đồng thời Ledger điểm danh và LMS State.

- **Security Check:**
  + Mô hình **Zero Trust Architecture (ZTA)**: Không tin tưởng bất kỳ zone mạng nào (ngay cả mạng nội bộ campus).
  + Mã hóa 2 lớp: **At rest** (AES-256 với Cloud KMS quay vòng khóa mỗi 90 ngày) & **In transit** (TLS 1.3 với cipher suite bắt buộc ECDHE-RSA-AES128-GCM-SHA256).
  + Phân quyền RBAC kết hợp ABAC (Attribute-Based Access Control) theo vai trò, địa chỉ IP, và khung giờ hoạt động.

- **Infrastructure Note:**
  + Hạ tầng Cloud-native trên Kubernetes (EKS/GKE) với Horizontal Pod Autoscaler (HPA) scale tự động từ 3 đến 25 pods khi tải đạt 70% CPU/Memory trong giờ cao điểm điểm danh (17:30 - 18:30).
  + Caching tầng thấp với Redis Cluster (3 Master - 3 Replica) đảm bảo độ trễ phản hồi < 15ms.

Lưu ý: Hệ thống Trung Kiên không chỉ là công cụ quản lý, mà là một **"Hệ sinh thái công nghệ giáo dục thông minh"**.`;
  }

  if (queryType === 'analytics' || p.includes('kpi') || p.includes('churn') || p.includes('dự báo') || p.includes('báo cáo')) {
    return `### Báo cáo Phân tích (BI & Predictive Analytics) - Trung tâm Ngoại ngữ Trung Kiên (Offline Mode)

- **Chỉ số (KPIs):**
  + Tổng số học viên active: **1,480 học viên** (+12.4% MoM)
  + Tỷ lệ Churn Rate dự báo: **3.8%** (giảm 1.5% so với quý trước nhờ can thiệp sớm AI)
  + Tỷ lệ đối soát tài chính tự động (Auto-Reconciliation Rate): **99.98%** (sai lệch 0 đồng sau 3,200 giao dịch)
  + Công suất sử dụng phòng học (Classroom Utilization): **87.5%** (tối ưu hóa bởi Genetic Algorithm)

- **Dự báo (Insights):**
  + Thuật toán dự báo hành vi học tập chỉ ra rằng học viên có tỷ lệ nộp bài Speaking dưới 70% trong 2 tuần liên tiếp sẽ có nguy cơ drop-out tăng gấp 3.2 lần.
  + Doanh thu dự kiến tháng tới đạt 2.85 tỷ VNĐ với dòng tiền thanh toán qua Virtual Account chiếm 94%.

- **Hành động đề xuất:**
  + Kích hoạt chiến dịch "Academic Rescue" tự động: Gửi tin nhắn thông báo qua Mobile App và xếp lịch 30 phút luyện âm với trợ giảng AI.
  + Tối ưu lại 2 phòng học tầng 3 vào sáng Thứ 7 để mở thêm lớp IELTS Intensive nhằm đáp ứng nhu cầu tăng cao.

Lưu ý: Hệ thống Trung Kiên không chỉ là công cụ quản lý, mà là một **"Hệ sinh thái công nghệ giáo dục thông minh"**.`;
  }

  return `### Phân tích Tính năng Hệ thống - Trung Kiên Smart EdTech (Offline Mode)

- **Tên tính năng:** ${prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt}
- **Kiến trúc đề xuất:**
  + Thiết kế Microservice độc lập tách biệt Domain Context (Domain-Driven Design).
  + Giao tiếp bất đồng bộ thông qua Event Bus (Apache Kafka / RabbitMQ) để đảm bảo Loose Coupling và Zero Downtime khi nâng cấp.
  + Micro-frontends sử dụng Module Federation cho phép các team độc lập phát triển module Quản lý Đào tạo, Tài chính và Portal Học viên.

- **Logic thực hiện:**
  1. Client gửi request qua API Gateway (Kong/Envoy) thực hiện Rate Limiting và Token Validation.
  2. Middleware xử lý chuẩn hóa dữ liệu, áp dụng thuật toán Fuzzy Matching loại bỏ bản ghi trùng lặp.
  3. Microservice chuyên trách xử lý nghiệp vụ, ghi log bất biến vào Audit Trail.
  4. Trả kết quả theo chuẩn GraphQL/RESTful API với thời gian phản hồi p99 < 120ms.

- **Công nghệ tích hợp:**
  + AI Engine: Speech-to-Text, Computer Vision (FaceID Liveness Detection), LLM Gemini cho Adaptive Feedback.
  + Data Engine: Redis Cache, PostgreSQL Cloud SQL, Kafka Streaming.
  + Blockchain Ledger: Lưu vết chữ ký số chứng chỉ tốt nghiệp chống làm giả.

- **Giá trị kinh doanh:**
  + Tiết kiệm 85% thời gian thủ công của đội ngũ vận hành và giáo vụ.
  + Tăng tỷ lệ giữ chân học viên (Retention Rate) thêm 18% nhờ trải nghiệm học tập cá nhân hóa.
  + Đảm bảo minh bạch tài chính 100% không thất thoát.

Lưu ý: Hệ thống Trung Kiên không chỉ là công cụ quản lý, mà là một **"Hệ sinh thái công nghệ giáo dục thông minh"**.`;
}
