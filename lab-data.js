// Engineering Lab — Content Data
// To add a new doc: push a new object into LAB_DOCS following the same shape.

const LAB_DOCS = [
    {
        slug: "learning-ai",
        title: "Learning.ai",
        category: "Backend",
        categoryColor: "indigo",
        tags: ["Node.js", "React", "MongoDB", "Groq", "Gemini", "JWT", "Adaptive Quiz"],
        summary: "Full-stack learning platform: roadmaps, adaptive quizzes, document-to-quiz pipeline, and an exam subsystem with proctoring hooks.",
        readTime: "12 min read",
        lastUpdated: "March 2025",
        links: {
            github: "https://github.com/Kaushal-15",
            demo: null,
        },
        sections: [
            {
                id: "overview",
                title: "Overview",
                content: `A full-stack platform built around structured roadmaps, adaptive quizzes, document-to-quiz generation, XP/leaderboard tracking, and an admin-managed exam system. The backend is doing most of the heavy lifting — the frontend is mostly a React layer over a fairly broad Express + MongoDB API.

The user flow is: pick a learning roadmap → get daily study plans → take quizzes → earn XP → optionally sit for formal exams administered by an admin.`
            },
            {
                id: "problem",
                title: "Problem",
                content: `Combining two workflows in one product was the core challenge:

1. Self-paced learning with roadmaps, AI-generated study content, quizzes, and progress tracking
2. Controlled exam delivery with student verification, adaptive routing, and basic proctoring

Most platforms do one or the other. The goal was to build a single product that handles both — with the same user and auth model bridging both flows. That created some structural tension, especially around the exam subsystem needing its own data isolation.`
            },
            {
                id: "architecture",
                title: "Architecture",
                content: `**Stack:** React 18 + Vite + TailwindCSS (frontend), Node.js + Express (backend), MongoDB (main DB), separate MongoDB connection for exam collections.

**Auth:** JWT in cookies + Authorization header, refresh tokens, Passport Google OAuth, express-session — the layering here is messier than it should be.

**AI:** Groq (primary), Gemini (fallback), OpenAI SDK present but mostly legacy. Content generation, quiz-from-document pipeline, and chatbot all call the provider directly from services.

**File handling:** Multer → local uploads/, pdf-parse and mammoth for extraction. Fine for local dev, fragile on serverless.`,
                diagram: {
                    type: "mermaid",
                    code: `flowchart TD
    U[User] --> FE[React Frontend]
    FE --> API[Express API]
    API --> MDB[(Main MongoDB)]
    API --> EDB[(Exam MongoDB)]
    API --> AI[Groq / Gemini]
    API --> NM[Nodemailer]
    API --> FS[Local Uploads]
    MDB --> learning[learning / quiz / progress]
    EDB --> exams[exam sessions / results]`
                }
            },
            {
                id: "tech-stack",
                title: "Tech Stack",
                items: [
                    { label: "Frontend", value: "React 18, Vite, React Router, TailwindCSS, Framer Motion, Three.js" },
                    { label: "Backend", value: "Node.js, Express" },
                    { label: "Database", value: "MongoDB via Mongoose (two connections)" },
                    { label: "Auth", value: "JWT, refresh tokens, Passport Google OAuth" },
                    { label: "AI/LLM", value: "Groq, Google Gemini, OpenAI SDK (legacy)" },
                    { label: "File parsing", value: "Multer, pdf-parse, mammoth" },
                    { label: "Email", value: "Nodemailer OTP" },
                    { label: "Deployment", value: "Vercel serverless + Docker + nginx" }
                ]
            },
            {
                id: "core-workflow",
                title: "Core Workflow",
                content: `**Learning flow:**
User signs up → selects roadmap, level, timeline → dashboard loads progress, recent quizzes, XP, topic analysis → learn screen fetches daily content → user takes quizzes → backend stores results and awards XP.

**Document quiz flow:**
User uploads PDF/DOCX → backend extracts and chunks text → user requests quiz → backend concatenates chunks and calls Groq/Gemini → quiz stored and returned. It's naive concatenation, not retrieval — which is the main bottleneck at scale.

**Exam flow:**
Admin creates exam → configures static/dynamic/adaptive/synchronized mode → student joins via exam code → backend validates and creates ExamSession → frontend renders session with timer and violation handling → results logged and reviewed by admin.`
            },
            {
                id: "api-flow",
                title: "API Design",
                content: `Route groups are organized by feature, but there is overlap and legacy drift in several areas.

\`\`\`
POST   /api/auth/register|verify-otp|login|refresh|logout
GET    /api/profile/me
POST   /api/profile/onboarding
GET    /api/roadmaps, /api/roadmaps/:id
POST   /api/progress-tracking/update
GET    /api/xp/leaderboard
POST   /api/quiz/create
PUT    /api/quiz/:id/answer
POST   /api/custom-learning/upload
POST   /api/custom-learning/generate-quiz
POST   /api/content/generate
POST   /api/exams/create
GET    /api/exams/:id/session
POST   /api/exams/:id/submit
GET    /api/exams/admin/*
POST   /api/biometric/upload|verify
POST   /api/camera/start-recording|upload-chunk
\`\`\`

There are both old and new progress routes still running side by side. Some route files are thin wrappers, others have business logic sitting directly in the route handler.`
            },
            {
                id: "bottlenecks",
                title: "Bottlenecks & Weak Spots",
                content: `**The Fixes to be done in next Version**

1. **Feature pile in examController.js** — too much in one controller. Exam creation, session lifecycle, adaptive routing, analytics, and proctoring all live there.

2. **Auth is inconsistent** — cookies, refresh tokens, sessions for OAuth, and localStorage access token. The boundary is not clean and the frontend auth context is partially migrated (AuthContext exists but isn't mounted in main.jsx — most screens still call /api/profile/me directly).

3. **Biometric verification is fake** — similarity is based on base64 string length plus randomness. Works for demo, not real verification.

4. **Proctoring isn't enforced in production** — ProctoringService startup is commented out, violation limit is hardcoded, camera behavior is force-overridden per exam regardless of config.

5. **DELETE /api/content/cache/clear is public** — should not be.

6. **Document quiz uses blind concatenation** — chunks are just joined and fed to the LLM with no retrieval. Works at small scale, breaks badly as documents grow.

7. **File storage is local** — uploads/ directory doesn't survive Vercel deployments. This was noted but not fixed before deploy.`,
                highlight: {
                    type: "warning",
                    text: "The codebase has visible duplication, debug console.log noise throughout, and hardcoded UI assumptions (45 total lessons on dashboard, violation threshold of 3, etc.) that should be API-driven."
                }
            },
            {
                id: "improvements",
                title: "What I'd Do in V2",
                content: `- Split exam logic into smaller services: creation, session, adaptive routing, analytics, proctoring — separate modules, not one controller
- Unify auth: go cookie-first or token-first, not both. Mount one AuthProvider in main.jsx and stop using /api/profile/me everywhere
- Replace local uploads with object storage before any stateless deployment
- Add retrieval to the document quiz pipeline — right now it's just naive chunk concatenation + LLM call
- Replace biometric placeholder with actual face-match or downgrade it to "admin photo approval only"
- Centralize AI provider selection — Groq/Gemini is repeated across multiple services instead of going through one adapter
- Lock down the cache clear and XP reset endpoints properly (marked admin-only but restriction isn't enforced in the controller)
- Clean up duplicate code paths: old auth context, backup components, duplicate model methods, legacy progress routes`
            }
        ]
    },

    {
        slug: "legitmind",
        title: "LegitMind",
        category: "Backend",
        categoryColor: "amber",
        tags: ["Node.js", "React", "AI Auth", "Workflow Automation", "MongoDB"],
        summary: "AI-powered authentication and workflow automation platform. Handles smart task routing, session management, and AI-driven decision logic.",
        readTime: "8 min read",
        lastUpdated: "March 2025",
        links: {
            github: "https://github.com/Kaushal-15",
            demo: null,
        },
        sections: [
            {
                id: "overview",
                title: "Overview",
                content: `LegitMind is a platform built around AI-assisted authentication and workflow automation. The core idea: instead of static rule-based auth flows, decisions adapt based on user context and behavior signals.

The backend handles auth, task routing, and state management. The frontend is a React dashboard for managing workflows, viewing task history, and configuring automation rules.`
            },
            {
                id: "problem",
                title: "Problem",
                content: `Standard auth systems are binary — authenticated or not. Real workflows need more nuance: is this user's behavior consistent? Does this action fit their typical pattern? Should this request be flagged or auto-approved?

The goal was to build a system where auth decisions factor in context, not just credentials. Alongside that, the workflow automation layer needed to route tasks based on those signals.`
            },
            {
                id: "architecture",
                title: "Architecture",
                content: `**Stack:** React (frontend), Node.js + Express (backend), MongoDB (data store).

**Auth layer:** JWT-based with an additional signal scoring step. On each request, a lightweight context check runs — device, IP range, session age, request pattern — and returns a confidence score. Below threshold triggers step-up auth.

**Workflow engine:** Tasks are stored as state machines. Each node has entry conditions and transition rules. The AI layer provides a "should_proceed" signal based on user context and task history.`
            },
            {
                id: "tech-stack",
                title: "Tech Stack",
                items: [
                    { label: "Frontend", value: "React, Tailwind CSS" },
                    { label: "Backend", value: "Node.js, Express" },
                    { label: "Database", value: "MongoDB" },
                    { label: "Auth", value: "JWT, context scoring middleware" },
                    { label: "AI", value: "Groq / Gemini for decision signals" },
                ]
            },
            {
                id: "bottlenecks",
                title: "Bottlenecks",
                content: `The context scoring runs synchronously on every request. At volume, that's a bottleneck. The right fix is async scoring with cached results — not implemented yet.

The workflow state machine is simple right now. Complex branching (parallel paths, conditional merges) isn't supported. That would need a proper DAG engine, not the current linear node structure.

Auth confidence scoring is heuristic-based. There's no actual trained model behind it — it's a set of weighted rules. Works for demo, wouldn't hold up to adversarial inputs.`
            },
            {
                id: "improvements",
                title: "What I'd Change",
                content: `- Move context scoring to async middleware with Redis-cached results per session
- Replace the heuristic confidence model with a trained behavioral anomaly detector
- Add proper workflow branching support — DAG over the current linear chain
- Add an audit trail UI so admins can see why a request was flagged or passed
- Currently no rate limiting on the step-up auth endpoint — that needs fixing`
            }
        ]
    },

    {
        slug: "readmind-architecture",
        title: "ReadMind — Architecture",
        category: "System Design",
        categoryColor: "emerald",
        tags: ["System Design", "AI", "Node.js", "MongoDB", "Document Processing", "REST API"],
        summary: "Architecture breakdown of ReadMind — an AI-powered reading assistant that extracts, chunks, and quizzes from uploaded documents.",
        readTime: "10 min read",
        lastUpdated: "March 2025",
        links: {
            github: "https://github.com/Kaushal-15/reader",
            demo: "https://kaushal-15.github.io/reader/",
        },
        sections: [
            {
                id: "overview",
                title: "Overview",
                content: `ReadMind is a document intelligence tool: users upload PDFs or Word documents, the system extracts and chunks the content, generates summaries and quiz questions using an LLM, and lets users test understanding through an adaptive quiz session.

The core idea is converting passive reading into active recall — upload a doc, get quizzed on it.`
            },
            {
                id: "problem",
                title: "Problem",
                content: `Reading long documents is passive. Retention drops fast without active recall. Existing tools either summarize (passive) or quiz on their own content (not yours).

The gap: no clean tool that takes *your* documents and generates MCQs from them automatically — while also tracking which concepts you're weak on.`
            },
            {
                id: "architecture",
                title: "Architecture",
                content: `**Simplified flow:**

\`\`\`
User → Upload File
     → Backend extracts text (pdf-parse / mammoth)
     → Text chunked into segments (~500 tokens each)
     → Chunks stored in MongoDB (Chunk collection)
     → User requests quiz
     → Backend retrieves chunks, concatenates, sends to LLM
     → Quiz stored and returned
     → User answers questions
     → Session stored with per-question results
\`\`\`

**Data model:**
- **Document** — upload metadata (user, filename, type, status)
- **Chunk** — extracted text segments linked to Document
- **Quiz** — session linked to Document + User, embeds question state
- **QuizAttempt** — per-answer record for weak-spot tracking`,
                diagram: {
                    type: "mermaid",
                    code: `flowchart LR
    U[User] --> Upload[Upload Document]
    Upload --> Extract[Text Extraction]
    Extract --> Chunk[Chunking Service]
    Chunk --> Store[(MongoDB Chunks)]
    U --> RequestQuiz[Request Quiz]
    RequestQuiz --> Retrieve[Retrieve Chunks]
    Store --> Retrieve
    Retrieve --> LLM[Groq / Gemini]
    LLM --> QuizDB[(Quiz Store)]
    QuizDB --> U`
                }
            },
            {
                id: "api-structure",
                title: "API Structure",
                content: `\`\`\`
POST   /api/documents/upload        — multer + extraction + chunking
GET    /api/documents               — list user's documents
DELETE /api/documents/:id           — delete doc + chunks

POST   /api/quiz/generate/:docId    — trigger quiz generation
GET    /api/quiz/:id                — get quiz questions
POST   /api/quiz/:id/answer         — submit per-question answer
GET    /api/quiz/:id/results        — final results + weak areas
\`\`\``
            },
            {
                id: "bottlenecks",
                title: "Bottlenecks",
                content: `**Naive chunk concatenation:** All chunks joined and sent in one prompt. For a 50-page PDF this blows past context limits. Questions end up only covering the first portion of the document — the truncation is silent.

**No retrieval:** No semantic search over chunks. A proper approach embeds chunks, indexes them, and retrieves only relevant ones based on the topic. Current approach treats the whole doc as one blob.

**Blocking extraction:** PDF extraction blocks the request. For large files this causes timeouts. Should be async/queued.

**Local file storage:** uploads/ directory doesn't survive Vercel or any stateless hosting.`,
                highlight: {
                    type: "warning",
                    text: "The core bottleneck is missing retrieval. Without it, quiz quality degrades for anything longer than ~10 pages and context limits become a hard ceiling."
                }
            },
            {
                id: "improvements",
                title: "What I'd Change in V2",
                content: `- **Add retrieval:** Embed chunks, store vectors (Pinecone or pgvector), retrieve by semantic similarity before prompting
- **Queue the pipeline:** BullMQ for async extraction + chunking. Return job ID, let client poll.
- **Object storage:** S3 or Cloudflare R2 instead of local disk
- **JSON validation:** Strict schema check on LLM response before storing — reject and retry once if invalid
- **Deduplication:** Hash on upload, skip reprocessing if content hash already exists for that user`
            }
        ]
    },

    {
        slug: "smart-home-tech",
        title: "Smart Home Tech — Healthcare Platform",
        category: "Backend",
        categoryColor: "indigo",
        tags: ["MERN", "JWT Auth", "AWS EC2", "Docker", "CI/CD", "Healthcare", "IoT"],
        summary: "Full-stack healthcare monitoring platform built during internship. Real-time patient vitals tracking, role-based access, and device-to-cloud connectivity.",
        readTime: "7 min read",
        lastUpdated: "July 2025",
        links: {
            github: "https://github.com/Kaushal-15",
            demo: null,
        },
        sections: [
            {
                id: "overview",
                title: "Overview",
                content: `Built during a 3-month internship at Smart Home Healthcare Solutions. The platform lets healthcare professionals and patients monitor vitals remotely — real-time data from edge devices flowing up to a cloud-hosted dashboard.

Stack: React + Tailwind (frontend), Node.js + Express (backend), MongoDB (data store), deployed on AWS EC2 with Docker and a CI/CD pipeline.`
            },
            {
                id: "problem",
                title: "Problem",
                content: `Physiotherapy and remote patient monitoring traditionally requires in-person visits or proprietary hardware with locked-down software. The goal was a platform that could receive data from generic IoT/edge devices and expose it through a clean interface for both clinicians and patients.

Doctors needed role-gated dashboards with patient lists and alert thresholds. Patients needed a simple vitals view with history. Admin needed device management and user provisioning.`
            },
            {
                id: "architecture",
                title: "Architecture",
                content: `**Frontend:** React 18 + Tailwind CSS. Three distinct dashboard views based on role (admin, doctor, patient). Data polling every 30 seconds — no WebSocket, which was a shortcut that became noticeable with live vitals.

**Backend:** Express REST API. Role-based middleware on every protected route. Device data hits a public ingest endpoint, gets sanitized, then stored.

**Auth:** JWT with roles embedded in token claims. Refresh token stored in HttpOnly cookie. Role check is middleware-level, not per-resource — so role escalation edge cases weren't handled cleanly.

**Deployment:** AWS EC2 (single instance), Docker Compose for service isolation (frontend + backend), Nginx as reverse proxy. CI/CD via GitHub Actions — push to main triggers build and deploy.`,
                diagram: {
                    type: "mermaid",
                    code: `flowchart TD
    Dev[Device / IoT] --> Ingest[/api/ingest]
    Patient[Patient] --> FE[React Frontend]
    Doctor[Doctor] --> FE
    Admin[Admin] --> FE
    FE --> API[Express API]
    API --> Auth{Role Check}
    Auth --> MDB[(MongoDB)]
    API --> Ingest
    Ingest --> MDB`
                }
            },
            {
                id: "tech-stack",
                title: "Tech Stack",
                items: [
                    { label: "Frontend", value: "React 18, Tailwind CSS" },
                    { label: "Backend", value: "Node.js, Express" },
                    { label: "Database", value: "MongoDB" },
                    { label: "Auth", value: "JWT, refresh tokens, role-based middleware" },
                    { label: "Deployment", value: "AWS EC2, Docker Compose, Nginx, GitHub Actions" },
                    { label: "Monitoring", value: "Basic CloudWatch, no APM" },
                ]
            },
            {
                id: "bottlenecks",
                title: "Bottlenecks",
                content: `Polling instead of WebSocket is the main UX problem. 30-second polling makes the "real-time" label feel dishonest for vitals. The fix is straightforward (Socket.io), just wasn't scoped into the internship timeline.

Single EC2 instance with no load balancing. If the instance goes down, the whole platform is down. For an internal prototype this was acceptable; for production it isn't.

The device ingest endpoint is unauthenticated — any POST with a valid device ID format gets stored. There's no device key / token validation. It was flagged but deprioritized.

Data archival isn't implemented. Vitals accumulate forever in MongoDB. A read-heavy dashboard querying all records for a patient history is going to slow down as records grow.`
            },
            {
                id: "improvements",
                title: "What I'd Change",
                content: `- Replace polling with WebSocket (Socket.io) for live vitals — should have been built this way from the start
- Add device authentication — secret key per device, validated on ingest
- Set up a proper alert system — threshold breach triggers a notification, not just a visual indicator
- Add MongoDB TTL index on raw vitals and aggregate into hourly/daily summaries for historical views
- Move to multi-instance with a load balancer before any real patient load`
            }
        ]
    }
];

// Helper to get doc by slug
function getDocBySlug(slug) {
    return LAB_DOCS.find(d => d.slug === slug) || null;
}

// Category filter set
const LAB_CATEGORIES = ["All", "System Design", "Backend", "Frontend Architecture", "UI Recreation"];

// Category → color mapping
const CATEGORY_COLORS = {
    "Backend": "indigo",
    "UI Recreation": "pink",
    "Frontend Architecture": "red",
    "System Design": "emerald",
};
