// Engineering Lab — Content Data
// To add a new doc: push a new object into LAB_DOCS following the same shape.

const LAB_DOCS = [
    {
        slug: "learning-ai",
        title: "Learning.ai",
        category: "Backend",
        categoryColor: "indigo",
        tags: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT", "Adaptive Quiz"],
        summary: "Full-stack learning platform: roadmaps, adaptive quizzes, document-to-quiz pipeline, and an exam subsystem with proctoring hooks.",
        readTime: "12 min read",
        lastUpdated: "March 2025",
        links: {
            github: "https://github.com/Kaushal-15/Learning.AI",
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
        slug: "url-shortener-design",
        title: "URL Shortener — System Design",
        category: "System Design",
        categoryColor: "emerald",
        tags: ["System Design", "Node.js", "Redis", "API Design", "High Availability", "High Level Design [HLD]"],
        summary: "A scalable, highly available URL shortening service designed to handle millions of redirects with minimal latency while prioritizing system reliability over strict consistency.",
        readTime: "8 min read",
        lastUpdated: "March 2026",
        links: {
            github: null,
            demo: null,
        },
        sections: [
            {
                id: "overview",
                title: "Overview",
                content: `A classic distributed systems problem: designing a URL shortener that maps long URLs to short aliases. As an AI-analyzed architecture, the primary objective is to guarantee seamless redirection while maintaining a tiny footprint per URL. The system operates under heavy read loads, serving redirects on demand while keeping write operations localized and fully asynchronous to ensure at least 99.9% availability.In short in a Real Interview the URL Shortner might seem easy but every API design and High Level Design matters and how you express them in that terms,here i have added a sample to it on my experiences on reading blogs and Articles.`
            },
            {
                id: "problem",
                title: "Problem & Constraints",
                content: `The system must provide very fast redirection, ideally responding within **10–100 ms** to ensure a smooth user experience. It should be highly available — if the service goes down, all shortened links stop working, which makes availability strictly more vital than strong consistency.

**Traffic Projections:**
The system should scale effortlessly to handle a massive baseline of requests:
- **~100 million reads** (redirects) per day.
- **~10 million writes** (creations) per day.

This **10:1** read-to-write ratio heavily informs our caching and replication strategies.`
            },
            {
                id: "architecture",
                title: "High Level Design (HLD)",
                content: `**Core Architecture:**

1. **API Gateway:** Entry point handling rate limiting and routing.
2. **Short URL Generator (Write Path):** Assigns unique slugs. Uses an isolated Key Generation Service (Base62 encoding on pre-generated UUIDs/Counters) to prevent collision overhead on the DB.
3. **Redirection Service (Read Path):** Fast lookups fetching from Cache first, falling back to the DB on misses.
4. **Data Store:** NoSQL (Cassandra/DynamoDB) for highly scalable, key-value style fast reads.
5. **Cache Tier:** Redis or Memcached clusters caching heavily trafficked short-links.

**Write Flow:** User submits long URL → Rate Limiter checks limits → Shortener generates slug → Stores mapping in DB → Returns short URL.

**Read Flow:** User clicks short URL → Gateway routes to Redirection Service → Cache lookup (if misses: DB lookup & Cache update) → 301/302 Redirect to Long URL.`,
                diagram: {
                    type: "mermaid",
                    code: `flowchart TD
    U[User] --> |POST /api/v1/urls| API[API Gateway / Load Balancer]
    U --> |GET /:slug| API
    
    API --> |Write Request| WS[URL Generation Service]
    API --> |Read Request| RS[Redirection Service]
    
    WS --> |Check Collision / Generate| ZK[Key Generation Service]
    WS --> |Insert| DB[(Cassandra DB)]
    
    RS --> |Cache Lookup| Cache[(Redis Cluster)]
    RS --> |Cache Miss Lookup| DB
    Cache -.-> |Return Mapping| RS
    
    DB -.-> |Async Replicate| Cache
    
    subgraph Storage Tier
        Cache
        DB
    end`
                }
            },
            {
                id: "api-design",
                title: "API Design",
                content: `**1. Create Short URL**

\`\`\`http
POST /api/v1/urls
{
  "LongUrl": "https://www.amazon.com/some-product-url",
  "custom_name": "optional",
  "expiration": "optional"
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "shortUrl": "tiny.url/12345678"
}
\`\`\`

**Error Codes:** 
- \`400 Bad Request\`: Invalid URL body.
- \`409 Conflict\`: Custom alias already taken.
- \`429 Too Many Requests\`: Global or IP-based rate limit exceeded.
- \`500 Internal Server Error\`

**2. Redirect to Long URL**

\`\`\`http
GET /:slug
\`\`\`

**Response (301/302 Redirect):** 
\`\`\`http
HTTP 301 (or 302) Redirect
Location: https://www.amazon.com/some-product-url
\`\`\`

*Note: Using **301 Moved Permanently** allows browser caching (faster UX, less server load) while **302 Found** forces a server trip every time (better analytics tracking).*

**Error Codes:**
- \`404 Not Found\`: Slug does not exist.
- \`410 Gone\`: The link existed but has since expired or been deleted.
- \`429 Too Many Requests\`
- \`500 Internal Server Error\``
            },
            {
                id: "bottbottlenecks",
                title: "Bottlenecks & Edge Cases",
                content: `**Slug Collision:** Random generation poses collision risks at scale. Generating slugs offline through an isolated Key Generation Service (KGS) completely eliminates latency and DB contention.
                
**Cache Eviction:** Given 100M daily reads, cache memory is finite. We deploy an LRU (Least Recently Used) policy to flush dormant URLs and prioritize hot links.

**Malicious Activity:** URL shorteners are prime targets for spam. We must execute deep URL validation, maintain blocklists, and implement distributed rate limiting at the API Gateway level to thwart bot networks.`,
                highlight: {
                    type: "warning",
                    text: "The primary design failure point is usually token exhaustion or DB locking when generating slugs sequentially. Pre-allocating ranges using a service like ZooKeeper is the safest architectural pattern."
                }
            },

            {
                id: "Summary",
                title: "Summary",
                content: `The Url shortner Design is a classical medium level problem.The system should scale both vertically and horizontally for Robust access.
                **R/W Ratio:**The read are more higher than Writes so that ratio between them is 10:1
                **Availability:**Availability is more important than consistency,the system should be available 24/7
                **Scalability:**The system should be able to handle millions of requests per day,this is most important part of the system ensure it works properly
                **Latency:**The system should be able to handle requests in milliseconds`,
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
