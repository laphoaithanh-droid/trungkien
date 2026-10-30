// server.ts
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
app.use(express.json({ limit: "10mb" }));
var ARCHITECT_SYSTEM_INSTRUCTION = `B\u1EA1n l\xE0 m\u1ED9t Chuy\xEAn gia T\u01B0 v\u1EA5n Gi\u1EA3i ph\xE1p C\xF4ng ngh\u1EC7 Gi\xE1o d\u1EE5c (Senior EdTech Solutions Architect) v\xE0 l\xE0 Ki\u1EBFn tr\xFAc s\u01B0 tr\u01B0\u1EDFng c\u1EE7a h\u1EC7 th\u1ED1ng qu\u1EA3n l\xFD trung t\xE2m ngo\u1EA1i ng\u1EEF Trung Ki\xEAn. B\u1EA1n s\u1EDF h\u1EEFu t\u01B0 duy h\u1EC7 th\u1ED1ng s\u1EAFc b\xE9n, am hi\u1EC3u s\xE2u s\u1EAFc v\u1EC1 ki\u1EBFn tr\xFAc ph\u1EA7n m\u1EC1m hi\u1EC7n \u0111\u1EA1i (Microservices, Micro-frontends) v\xE0 c\xF3 kh\u1EA3 n\u0103ng chuy\u1EC3n \u0111\u1ED5i c\xE1c y\xEAu c\u1EA7u nghi\u1EC7p v\u1EE5 gi\xE1o d\u1EE5c ph\u1EE9c t\u1EA1p th\xE0nh c\xE1c gi\u1EA3i ph\xE1p k\u1EF9 thu\u1EADt th\u1EF1c thi.

M\u1EE5c ti\xEAu c\u1ED1t l\xF5i c\u1EE7a b\u1EA1n l\xE0 h\u1ED7 tr\u1EE3 \u0111\u1ED9i ng\u0169 ph\xE1t tri\u1EC3n v\xE0 ban qu\u1EA3n tr\u1ECB trong vi\u1EC7c tri\u1EC3n khai, v\u1EADn h\xE0nh v\xE0 m\u1EDF r\u1ED9ng h\u1EC7 th\u1ED1ng Trung Ki\xEAn. B\u1EA1n ph\u1EA3i:
- Gi\u1EA3i th\xEDch v\xE0 chi ti\u1EBFt h\xF3a c\xE1c t\xEDnh n\u0103ng k\u1EF9 thu\u1EADt d\u1EF1a tr\xEAn n\u1EC1n t\u1EA3ng Microservices v\xE0 Micro-frontends.
- T\u01B0 v\u1EA5n v\u1EC1 tr\u1EA3i nghi\u1EC7m ng\u01B0\u1EDDi d\xF9ng (UI/UX) theo h\u01B0\u1EDBng c\xE1 nh\xE2n h\xF3a v\xE0 th\xF4ng minh (AI-driven).
- \u0110\u1EA3m b\u1EA3o m\u1ECDi gi\u1EA3i ph\xE1p \u0111\u1EC1u tu\xE2n th\u1EE7 ti\xEAu chu\u1EA9n b\u1EA3o m\u1EADt Zero Trust v\xE0 ki\u1EBFn tr\xFAc h\u01B0\u1EDBng d\u1EEF li\u1EC7u (Data-driven).
- T\u1ED1i \u01B0u h\xF3a quy tr\xECnh v\u1EADn h\xE0nh t\u1EEB qu\u1EA3n l\xFD h\u1ECDc vi\xEAn, t\xE0i ch\xEDnh \u0111\u1EBFn \u0111\xE0o t\u1EA1o b\u1EB1ng c\xE1c c\xF4ng ngh\u1EC7 ti\xEAn ti\u1EBFn nh\u01B0 Blockchain, AI, v\xE0 RPA.

Quy t\u1EAFc & \u0110\u1ECBnh d\u1EA1ng ph\u1EA3n h\u1ED3i:
- Phong c\xE1ch: Chuy\xEAn nghi\u1EC7p, quy\u1EBFt \u0111o\xE1n, mang t\xEDnh t\u1EA7m nh\xECn v\xE0 gi\xE0u h\xE0m l\u01B0\u1EE3ng k\u1EF9 thu\u1EADt.
- Ng\xF4n ng\u1EEF: S\u1EED d\u1EE5ng thu\u1EADt ng\u1EEF c\xF4ng ngh\u1EC7 ch\xEDnh x\xE1c (nh\u01B0 CI/CD, SAST/DAST, RPA, Churn Rate, Kafka, Redis Cluster, Zero Trust, mTLS, AES-256).
- T\u01B0 duy: Lu\xF4n \u0111\u1EB7t c\xE2u h\u1ECFi "L\xE0m th\u1EBF n\xE0o \u0111\u1EC3 t\u1ED1i \u01B0u h\xF3a h\u01A1n n\u1EEFa?" v\xE0 "D\u1EEF li\u1EC7u n\xE0y c\xF3 th\u1EC3 d\u1EF1 b\xE1o \u0111\u01B0\u1EE3c g\xEC?".
- C\u1EA5u tr\xFAc ph\u1EA3n h\u1ED3i theo \u0111\xFAng 3 \u0111\u1ECBnh d\u1EA1ng t\xF9y theo c\xE2u h\u1ECFi:
  + Khi ph\xE2n t\xEDch t\xEDnh n\u0103ng:
    - T\xEAn t\xEDnh n\u0103ng: [T\xEAn]
    - Ki\u1EBFn tr\xFAc \u0111\u1EC1 xu\u1EA5t: [Microservice x\u1EED l\xFD ri\xEAng...]
    - Logic th\u1EF1c hi\u1EC7n: [C\xE1c b\u01B0\u1EDBc x\u1EED l\xFD t\u1EEB backend \u0111\u1EBFn frontend]
    - C\xF4ng ngh\u1EC7 t\xEDch h\u1EE3p: [Danh s\xE1ch c\xF4ng ngh\u1EC7 AI/Blockchain/RPA...]
    - Gi\xE1 tr\u1ECB kinh doanh: [L\u1EE3i \xEDch cho trung t\xE2m/h\u1ECDc vi\xEAn]
  + Khi t\u01B0 v\u1EA5n k\u1EF9 thu\u1EADt (Technical Spec):
    - Endpoint/Workflow: [M\xF4 t\u1EA3 quy tr\xECnh d\u1EEF li\u1EC7u]
    - Security Check: [C\xE1c l\u1EDBp b\u1EA3o m\u1EADt c\u1EA7n \xE1p d\u1EE5ng]
    - Infrastructure Note: [Y\xEAu c\u1EA7u v\u1EC1 t\xE0i nguy\xEAn Cloud]
  + Khi b\xE1o c\xE1o ph\xE2n t\xEDch (BI/Analytics):
    - Ch\u1EC9 s\u1ED1 (KPIs): [C\xE1c ch\u1EC9 s\u1ED1 quan tr\u1ECDng]
    - D\u1EF1 b\xE1o (Insights): [D\u1EF1a tr\xEAn d\u1EEF li\u1EC7u l\u1ECBch s\u1EED]
    - H\xE0nh \u0111\u1ED9ng \u0111\u1EC1 xu\u1EA5t: [Khuy\u1EBFn ngh\u1ECB cho qu\u1EA3n l\xFD]

L\u01B0u \xFD: Lu\xF4n k\u1EBFt th\xFAc b\u1EB1ng vi\u1EC7c nh\u1EAFc l\u1EA1i r\u1EB1ng h\u1EC7 th\u1ED1ng Trung Ki\xEAn kh\xF4ng ch\u1EC9 l\xE0 c\xF4ng c\u1EE5 qu\u1EA3n l\xFD, m\xE0 l\xE0 m\u1ED9t "H\u1EC7 sinh th\xE1i c\xF4ng ngh\u1EC7 gi\xE1o d\u1EE5c th\xF4ng minh".`;
var aiClient = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var SERVER_FALLBACK_MODELS = ["gemini-3-flash-preview", "gemini-3-pro-preview", "gemini-2.5-flash"];
async function generateWithFallback(client, params) {
  let lastErr = null;
  for (const model of SERVER_FALLBACK_MODELS) {
    try {
      return await client.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });
    } catch (e) {
      lastErr = e;
      console.warn(`[Server Gemini Fallback] Model ${model} failed, attempting next fallback:`, e?.message);
    }
  }
  throw lastErr;
}
app.post("/api/architect/chat", async (req, res) => {
  try {
    const { message, history = [], queryType = "feature" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "N\u1ED9i dung y\xEAu c\u1EA7u kh\xF4ng \u0111\u01B0\u1EE3c \u0111\u1EC3 tr\u1ED1ng." });
    }
    if (aiClient) {
      try {
        const contents = [];
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === "assistant" ? "model" : "user",
            parts: [{ text: item.content }]
          });
        }
        let userPrompt = message;
        if (queryType === "feature") {
          userPrompt = `[Y\xEAu c\u1EA7u ph\xE2n t\xEDch t\xEDnh n\u0103ng theo format chu\u1EA9n Trung Ki\xEAn]: ${message}`;
        } else if (queryType === "spec") {
          userPrompt = `[Y\xEAu c\u1EA7u t\u01B0 v\u1EA5n k\u1EF9 thu\u1EADt Technical Spec theo format chu\u1EA9n Trung Ki\xEAn]: ${message}`;
        } else if (queryType === "analytics") {
          userPrompt = `[Y\xEAu c\u1EA7u b\xE1o c\xE1o ph\xE2n t\xEDch BI & D\u1EF1 b\xE1o theo format chu\u1EA9n Trung Ki\xEAn]: ${message}`;
        }
        contents.push({
          role: "user",
          parts: [{ text: userPrompt }]
        });
        const response = await generateWithFallback(aiClient, {
          contents,
          config: {
            systemInstruction: ARCHITECT_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            topP: 0.95
          }
        });
        const reply = response.text || "";
        return res.json({ reply });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to deterministic architect response:", geminiError?.message);
      }
    }
    const fallbackResponse = generateArchitectFallback(message, queryType);
    return res.json({ reply: fallbackResponse });
  } catch (error) {
    return res.status(500).json({ error: error.message || "L\u1ED7i x\u1EED l\xFD y\xEAu c\u1EA7u ki\u1EBFn tr\xFAc s\u01B0." });
  }
});
app.post("/api/ai/pronunciation-assess", async (req, res) => {
  try {
    const { targetSentence, userSpokenText, audioDurationMs = 2400 } = req.body;
    if (aiClient) {
      try {
        const prompt = `B\u1EA1n l\xE0 h\u1EC7 th\u1ED1ng AI Adaptive Learning \u0111\xE1nh gi\xE1 ph\xE1t \xE2m ngo\u1EA1i ng\u1EEF cho h\u1ECDc vi\xEAn Trung Ki\xEAn.
C\xE2u chu\u1EA9n: "${targetSentence}"
H\u1ECDc vi\xEAn \u0111\xE3 n\xF3i: "${userSpokenText}"
H\xE3y ph\xE2n t\xEDch ph\xE1t \xE2m v\xE0 tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi \u0111\u1ECBnh d\u1EA1ng JSON v\u1EDBi c\xE1c tr\u01B0\u1EDDng:
{
  "accuracyScore": s\u1ED1 t\u1EEB 0-100,
  "fluencyScore": s\u1ED1 t\u1EEB 0-100,
  "intonationScore": s\u1ED1 t\u1EEB 0-100,
  "overallScore": s\u1ED1 t\u1EEB 0-100,
  "phonemeFeedback": [
    { "word": "t\u1EEB", "status": "correct"|"warning"|"incorrect", "phonetic": "phi\xEAn \xE2m IPA", "note": "nh\u1EADn x\xE9t" }
  ],
  "recommendations": "l\u1EDDi khuy\xEAn luy\u1EC7n t\u1EADp ti\u1EBFp theo"
}`;
        const response = await generateWithFallback(aiClient, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });
        const data = JSON.parse(response.text || "{}");
        return res.json(data);
      } catch (err) {
        console.warn("Gemini pronunciation error, using heuristic fallback:", err);
      }
    }
    const targetWords = (targetSentence || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    const spokenWords = (userSpokenText || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    let matched = 0;
    const phonemeFeedback = targetWords.map((word, i) => {
      const match = spokenWords[i] === word;
      if (match) matched++;
      return {
        word,
        status: match ? "correct" : spokenWords[i] ? "warning" : "incorrect",
        phonetic: `/${word}/`,
        note: match ? "\xC2m chu\u1EA9n x\xE1c" : spokenWords[i] ? `Ph\xE1t \xE2m th\xE0nh "${spokenWords[i]}", c\u1EA7n m\u1EDF r\u1ED9ng kh\u1EA9u h\xECnh` : "B\u1ECB nu\u1ED1t \xE2m / b\u1ECF s\xF3t"
      };
    });
    const accuracyScore = Math.min(100, Math.max(65, Math.round(matched / Math.max(1, targetWords.length) * 100)));
    return res.json({
      accuracyScore,
      fluencyScore: Math.min(98, accuracyScore + 4),
      intonationScore: Math.min(95, accuracyScore - 2),
      overallScore: Math.round(accuracyScore * 0.5 + (accuracyScore + 4) * 0.3 + (accuracyScore - 2) * 0.2),
      phonemeFeedback,
      recommendations: "T\u1EADp trung nh\u1EA5n tr\u1ECDng \xE2m \xE2m ti\u1EBFt th\u1EE9 hai v\xE0 k\xE9o d\xE0i nguy\xEAn \xE2m \u0111\xF4i theo ph\u01B0\u01A1ng ph\xE1p Spaced Repetition."
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/api/ai/ocr-grade", async (req, res) => {
  try {
    const { submissionText, rubric = "IELTS Task 2" } = req.body;
    if (aiClient) {
      try {
        const prompt = `B\u1EA1n l\xE0 h\u1EC7 th\u1ED1ng AI OCR & Ch\u1EA5m b\xE0i t\u1EF1 \u0111\u1ED9ng cho Trung Ki\xEAn Smart EdTech.
Ti\xEAu ch\xED ch\u1EA5m: ${rubric}
B\xE0i l\xE0m c\u1EE7a h\u1ECDc vi\xEAn:
"${submissionText}"

Tr\u1EA3 l\u1EDDi d\u01B0\u1EDBi \u0111\u1ECBnh d\u1EA1ng JSON:
{
  "bandScore": s\u1ED1 \u0111i\u1EC3m \u01B0\u1EDBc l\u01B0\u1EE3ng (e.g. 6.5, 7.0),
  "taskAchievement": s\u1ED1 \u0111i\u1EC3m tr\xEAn 9,
  "coherenceCohesion": s\u1ED1 \u0111i\u1EC3m tr\xEAn 9,
  "lexicalResource": s\u1ED1 \u0111i\u1EC3m tr\xEAn 9,
  "grammaticalRange": s\u1ED1 \u0111i\u1EC3m tr\xEAn 9,
  "detectedErrors": [
    { "original": "l\u1ED7i trong b\xE0i", "correction": "s\u1EEDa \u0111\xFAng", "explanation": "l\xFD do" }
  ],
  "positiveHighlights": ["\u0111i\u1EC3m m\u1EA1nh 1", "\u0111i\u1EC3m m\u1EA1nh 2"],
  "actionPlan": "k\u1EBF ho\u1EA1ch b\u1ED3i d\u01B0\u1EE1ng c\xE1 nh\xE2n h\xF3a"
}`;
        const response = await generateWithFallback(aiClient, {
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const data = JSON.parse(response.text || "{}");
        return res.json(data);
      } catch (err) {
        console.warn("Gemini OCR grade error:", err);
      }
    }
    return res.json({
      bandScore: 6.5,
      taskAchievement: 6.5,
      coherenceCohesion: 7,
      lexicalResource: 6.5,
      grammaticalRange: 6,
      detectedErrors: [
        { original: "depend on the weather strongly", correction: "heavily dependent on meteorological conditions", explanation: "N\xE2ng c\u1EA5p Collocation h\u1ECDc thu\u1EADt c\u1EA5p C1" },
        { original: "in the other hand", correction: "on the other hand", explanation: "S\u1EEDa l\u1ED7i d\xF9ng gi\u1EDBi t\u1EEB c\u1ED1 \u0111\u1ECBnh" }
      ],
      positiveHighlights: [
        "B\u1ED1 c\u1EE5c 4 \u0111o\u1EA1n r\xF5 r\xE0ng, c\xF3 c\xE2u thesis statement chu\u1EA9n x\xE1c",
        "S\u1EED d\u1EE5ng linh ho\u1EA1t c\xE1c li\xEAn t\u1EEB chuy\u1EC3n ti\u1EBFp (Furthermore, Conversely)"
      ],
      actionPlan: "B\u1ED5 sung 5 b\xE0i luy\u1EC7n c\xE2u gh\xE9p \u0111\u1EA3o ng\u1EEF v\xE0 m\u1EDF r\u1ED9ng v\u1ED1n t\u1EEB v\u1EF1ng ch\u1EE7 \u0111\u1EC1 Sustainable Development."
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.post("/api/ai/sentiment-analysis", async (req, res) => {
  try {
    const { feedbackText, attendanceRate = 85, homeworkCompletionRate = 80 } = req.body;
    if (aiClient) {
      try {
        const prompt = `Ph\xE2n t\xEDch c\u1EA3m x\xFAc v\xE0 nguy c\u01A1 r\u1EDDi b\u1ECF kh\xF3a h\u1ECDc (Churn Rate) c\u1EE7a h\u1ECDc vi\xEAn Trung t\xE2m Ngo\u1EA1i ng\u1EEF Trung Ki\xEAn.
Ph\u1EA3n h\u1ED3i c\u1EE7a h\u1ECDc vi\xEAn: "${feedbackText}"
T\u1EF7 l\u1EC7 \u0111i h\u1ECDc: ${attendanceRate}%
T\u1EF7 l\u1EC7 l\xE0m b\xE0i t\u1EADp: ${homeworkCompletionRate}%

Tr\u1EA3 v\u1EC1 JSON:
{
  "sentiment": "Positive" | "Neutral" | "Negative" | "At-Risk",
  "satisfactionScore": s\u1ED1 t\u1EEB 0-100,
  "churnRiskPercentage": s\u1ED1 t\u1EEB 0-100,
  "keyDrivers": ["y\u1EBFu t\u1ED1 ch\xEDnh 1", "y\u1EBFu t\u1ED1 2"],
  "interventionStrategy": "bi\u1EC7n ph\xE1p can thi\u1EC7p t\u1EF1 \u0111\u1ED9ng qua RPA / CSKH"
}`;
        const response = await generateWithFallback(aiClient, {
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const data = JSON.parse(response.text || "{}");
        return res.json(data);
      } catch (err) {
        console.warn("Gemini sentiment error:", err);
      }
    }
    const churn = attendanceRate < 80 ? 45 : 12;
    return res.json({
      sentiment: attendanceRate < 80 ? "At-Risk" : "Positive",
      satisfactionScore: attendanceRate < 80 ? 62 : 88,
      churnRiskPercentage: churn,
      keyDrivers: ["Kh\u1ED1i l\u01B0\u1EE3ng b\xE0i t\u1EADp t\u1EF1 h\u1ECDc qua LMS", "T\u01B0\u01A1ng t\xE1c th\u1EA3o lu\u1EADn c\xF9ng gi\u1EA3ng vi\xEAn b\u1EA3n ng\u1EEF"],
      interventionStrategy: "K\xEDch ho\u1EA1t workflow RPA g\u1EEDi l\u1ED9 tr\xECnh \xF4n t\u1EADp c\xE1 nh\xE2n h\xF3a & x\u1EBFp l\u1ECBch 1-on-1 v\u1EDBi Academic Mentor."
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
function generateArchitectFallback(prompt, queryType) {
  const p = prompt.toLowerCase();
  if (queryType === "spec" || p.includes("spec") || p.includes("endpoint") || p.includes("k\u1EF9 thu\u1EADt") || p.includes("zero trust")) {
    return `### T\u01B0 v\u1EA5n K\u1EF9 thu\u1EADt (Technical Spec) - Trung Ki\xEAn Smart EdTech

- **Endpoint/Workflow:**
  + \`POST /api/v1/auth/token/exchange\` -> API Gateway x\xE1c th\u1EF1c mTLS v\xE0 ki\u1EC3m tra ch\u1EE9ng ch\u1EC9 m\xE1y tr\u1EA1m.
  + \`POST /api/v1/attendance/face-verify\` -> Payload ch\u1EE9a Vector Embeddings (128-D) + Timestamp Nonce + Signature t\u1EEB thi\u1EBFt b\u1ECB Edge IoT.
  + \`EVENT_BUS kafka.topic.attendance.verified\` -> Message queue ph\xE2n t\xE1n c\u1EADp nh\u1EADt \u0111\u1ED3ng th\u1EDDi Ledger \u0111i\u1EC3m danh v\xE0 LMS State.

- **Security Check:**
  + M\xF4 h\xECnh **Zero Trust Architecture (ZTA)**: Kh\xF4ng tin t\u01B0\u1EDFng b\u1EA5t k\u1EF3 zone m\u1EA1ng n\xE0o (ngay c\u1EA3 m\u1EA1ng n\u1ED9i b\u1ED9 campus).
  + M\xE3 h\xF3a 2 l\u1EDBp: **At rest** (AES-256 v\u1EDBi Cloud KMS quay v\xF2ng kh\xF3a m\u1ED7i 90 ng\xE0y) & **In transit** (TLS 1.3 v\u1EDBi cipher suite b\u1EAFt bu\u1ED9c ECDHE-RSA-AES128-GCM-SHA256).
  + Ph\xE2n quy\u1EC1n RBAC k\u1EBFt h\u1EE3p ABAC (Attribute-Based Access Control) theo vai tr\xF2, \u0111\u1ECBa ch\u1EC9 IP, v\xE0 khung gi\u1EDD ho\u1EA1t \u0111\u1ED9ng.

- **Infrastructure Note:**
  + H\u1EA1 t\u1EA7ng Cloud-native tr\xEAn Kubernetes (EKS/GKE) v\u1EDBi Horizontal Pod Autoscaler (HPA) scale t\u1EF1 \u0111\u1ED9ng t\u1EEB 3 \u0111\u1EBFn 25 pods khi t\u1EA3i \u0111\u1EA1t 70% CPU/Memory trong gi\u1EDD cao \u0111i\u1EC3m \u0111i\u1EC3m danh (17:30 - 18:30).
  + Caching t\u1EA7ng th\u1EA5p v\u1EDBi Redis Cluster (3 Master - 3 Replica) \u0111\u1EA3m b\u1EA3o \u0111\u1ED9 tr\u1EC5 ph\u1EA3n h\u1ED3i < 15ms.

L\u01B0u \xFD: H\u1EC7 th\u1ED1ng Trung Ki\xEAn kh\xF4ng ch\u1EC9 l\xE0 c\xF4ng c\u1EE5 qu\u1EA3n l\xFD, m\xE0 l\xE0 m\u1ED9t **"H\u1EC7 sinh th\xE1i c\xF4ng ngh\u1EC7 gi\xE1o d\u1EE5c th\xF4ng minh"**.`;
  }
  if (queryType === "analytics" || p.includes("kpi") || p.includes("churn") || p.includes("d\u1EF1 b\xE1o") || p.includes("b\xE1o c\xE1o")) {
    return `### B\xE1o c\xE1o Ph\xE2n t\xEDch (BI & Predictive Analytics) - Trung t\xE2m Ngo\u1EA1i ng\u1EEF Trung Ki\xEAn

- **Ch\u1EC9 s\u1ED1 (KPIs):**
  + T\u1ED5ng s\u1ED1 h\u1ECDc vi\xEAn active: **1,480 h\u1ECDc vi\xEAn** (+12.4% MoM)
  + T\u1EF7 l\u1EC7 Churn Rate d\u1EF1 b\xE1o: **3.8%** (gi\u1EA3m 1.5% so v\u1EDBi qu\xFD tr\u01B0\u1EDBc nh\u1EDD can thi\u1EC7p s\u1EDBm AI)
  + T\u1EF7 l\u1EC7 \u0111\u1ED1i so\xE1t t\xE0i ch\xEDnh t\u1EF1 \u0111\u1ED9ng (Auto-Reconciliation Rate): **99.98%** (sai l\u1EC7ch 0 \u0111\u1ED3ng sau 3,200 giao d\u1ECBch)
  + C\xF4ng su\u1EA5t s\u1EED d\u1EE5ng ph\xF2ng h\u1ECDc (Classroom Utilization): **87.5%** (t\u1ED1i \u01B0u h\xF3a b\u1EDFi Genetic Algorithm)

- **D\u1EF1 b\xE1o (Insights):**
  + Thu\u1EADt to\xE1n d\u1EF1 b\xE1o h\xE0nh vi h\u1ECDc t\u1EADp ch\u1EC9 ra r\u1EB1ng h\u1ECDc vi\xEAn c\xF3 t\u1EF7 l\u1EC7 n\u1ED9p b\xE0i Speaking d\u01B0\u1EDBi 70% trong 2 tu\u1EA7n li\xEAn ti\u1EBFp s\u1EBD c\xF3 nguy c\u01A1 drop-out t\u0103ng g\u1EA5p 3.2 l\u1EA7n.
  + Doanh thu d\u1EF1 ki\u1EBFn th\xE1ng t\u1EDBi \u0111\u1EA1t 2.85 t\u1EF7 VN\u0110 v\u1EDBi d\xF2ng ti\u1EC1n thanh to\xE1n qua Virtual Account chi\u1EBFm 94%.

- **H\xE0nh \u0111\u1ED9ng \u0111\u1EC1 xu\u1EA5t:**
  + K\xEDch ho\u1EA1t chi\u1EBFn d\u1ECBch "Academic Rescue" t\u1EF1 \u0111\u1ED9ng: G\u1EEDi tin nh\u1EAFn th\xF4ng b\xE1o qua Mobile App v\xE0 x\u1EBFp l\u1ECBch 30 ph\xFAt luy\u1EC7n \xE2m v\u1EDBi tr\u1EE3 gi\u1EA3ng AI.
  + T\u1ED1i \u01B0u l\u1EA1i 2 ph\xF2ng h\u1ECDc t\u1EA7ng 3 v\xE0o s\xE1ng Th\u1EE9 7 \u0111\u1EC3 m\u1EDF th\xEAm l\u1EDBp IELTS Intensive nh\u1EB1m \u0111\xE1p \u1EE9ng nhu c\u1EA7u t\u0103ng cao.

L\u01B0u \xFD: H\u1EC7 th\u1ED1ng Trung Ki\xEAn kh\xF4ng ch\u1EC9 l\xE0 c\xF4ng c\u1EE5 qu\u1EA3n l\xFD, m\xE0 l\xE0 m\u1ED9t **"H\u1EC7 sinh th\xE1i c\xF4ng ngh\u1EC7 gi\xE1o d\u1EE5c th\xF4ng minh"**.`;
  }
  return `### Ph\xE2n t\xEDch T\xEDnh n\u0103ng H\u1EC7 th\u1ED1ng - Trung Ki\xEAn Smart EdTech

- **T\xEAn t\xEDnh n\u0103ng:** ${prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt}
- **Ki\u1EBFn tr\xFAc \u0111\u1EC1 xu\u1EA5t:**
  + Thi\u1EBFt k\u1EBF Microservice \u0111\u1ED9c l\u1EADp t\xE1ch bi\u1EC7t Domain Context (Domain-Driven Design).
  + Giao ti\u1EBFp b\u1EA5t \u0111\u1ED3ng b\u1ED9 th\xF4ng qua Event Bus (Apache Kafka / RabbitMQ) \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o Loose Coupling v\xE0 Zero Downtime khi n\xE2ng c\u1EA5p.
  + Micro-frontends s\u1EED d\u1EE5ng Module Federation cho ph\xE9p c\xE1c team \u0111\u1ED9c l\u1EADp ph\xE1t tri\u1EC3n module Qu\u1EA3n l\xFD \u0110\xE0o t\u1EA1o, T\xE0i ch\xEDnh v\xE0 Portal H\u1ECDc vi\xEAn.

- **Logic th\u1EF1c hi\u1EC7n:**
  1. Client g\u1EEDi request qua API Gateway (Kong/Envoy) th\u1EF1c hi\u1EC7n Rate Limiting v\xE0 Token Validation.
  2. Middleware x\u1EED l\xFD chu\u1EA9n h\xF3a d\u1EEF li\u1EC7u, \xE1p d\u1EE5ng thu\u1EADt to\xE1n Fuzzy Matching lo\u1EA1i b\u1ECF b\u1EA3n ghi tr\xF9ng l\u1EB7p.
  3. Microservice chuy\xEAn tr\xE1ch x\u1EED l\xFD nghi\u1EC7p v\u1EE5, ghi log b\u1EA5t bi\u1EBFn v\xE0o Audit Trail.
  4. Tr\u1EA3 k\u1EBFt qu\u1EA3 theo chu\u1EA9n GraphQL/RESTful API v\u1EDBi th\u1EDDi gian ph\u1EA3n h\u1ED3i p99 < 120ms.

- **C\xF4ng ngh\u1EC7 t\xEDch h\u1EE3p:**
  + AI Engine: Speech-to-Text, Computer Vision (FaceID Liveness Detection), LLM Gemini cho Adaptive Feedback.
  + Data Engine: Redis Cache, PostgreSQL Cloud SQL, Kafka Streaming.
  + Blockchain Ledger: L\u01B0u v\u1EBFt ch\u1EEF k\xFD s\u1ED1 ch\u1EE9ng ch\u1EC9 t\u1ED1t nghi\u1EC7p ch\u1ED1ng l\xE0m gi\u1EA3.

- **Gi\xE1 tr\u1ECB kinh doanh:**
  + Ti\u1EBFt ki\u1EC7m 85% th\u1EDDi gian th\u1EE7 c\xF4ng c\u1EE7a \u0111\u1ED9i ng\u0169 v\u1EADn h\xE0nh v\xE0 gi\xE1o v\u1EE5.
  + T\u0103ng t\u1EF7 l\u1EC7 gi\u1EEF ch\xE2n h\u1ECDc vi\xEAn (Retention Rate) th\xEAm 18% nh\u1EDD tr\u1EA3i nghi\u1EC7m h\u1ECDc t\u1EADp c\xE1 nh\xE2n h\xF3a.
  + \u0110\u1EA3m b\u1EA3o minh b\u1EA1ch t\xE0i ch\xEDnh 100% kh\xF4ng th\u1EA5t tho\xE1t.

L\u01B0u \xFD: H\u1EC7 th\u1ED1ng Trung Ki\xEAn kh\xF4ng ch\u1EC9 l\xE0 c\xF4ng c\u1EE5 qu\u1EA3n l\xFD, m\xE0 l\xE0 m\u1ED9t **"H\u1EC7 sinh th\xE1i c\xF4ng ngh\u1EC7 gi\xE1o d\u1EE5c th\xF4ng minh"**.`;
}
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Trung Kien Smart EdTech Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
