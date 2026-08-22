# PixelForge DOCUMENTATION

### Project Description
PixelForge is an AI-powered image restyling platform. Users upload a source image, select a curated artistic style preset, choose an image-edit capable OpenAI model, and generate a transformed result through server-side image edits.

### Business Problem Solved
Many users want stylized, “gallery-ready” images but don’t want to manually learn complex editing workflows or write image-generation prompts. PixelForge provides a structured studio UI and enforces per-user monthly generation quotas.

### Target Users
- Creative users who want to restyle personal photos
- Teams evaluating AI-based image styling workflows
- Portfolio/portfolio-like usage cases requiring a simple generation pipeline

### Key Benefits
- Curated, prompt-backed style presets (no manual prompt authoring required)
- Studio workflow with original-vs-result preview
- Per-plan monthly generation quotas
- Generation history stored per authenticated user
- Uses ImageKit for image storage and OpenAI for image editing

<img width="1902" height="912" alt="image" src="https://github.com/user-attachments/assets/7dd1f6a8-c150-4c7e-85fa-4e67bbab0ae5" />


---

# 1. EXECUTIVE SUMMARY

- **Project Purpose:** Provide an AI studio for turning an uploaded image into a stylized result using OpenAI image edits.
- **Core Features:**
  1. Clerk-based authentication and protected studio route
  2. Image upload to ImageKit using short-lived upload credentials
  3. Curated style presets mapped to OpenAI prompts
  4. Server-side OpenAI image edit generation and result upload to ImageKit
  5. Persisted generation history in a PostgreSQL database (Drizzle ORM)
  6. Monthly generation quotas based on Clerk subscription plan
  7. Sentry integration for error reporting and logging
- **Technology Summary:**
  - Frontend: Next.js App Router (React 19), Tailwind CSS, Radix UI, Clerk React components
  - Backend: Next.js route handlers (server actions via API routes), Node runtime
  - Data: PostgreSQL with Drizzle ORM
  - External services: OpenAI (via `@ai-sdk/openai`), ImageKit (`@imagekit/*`), Sentry (`@sentry/nextjs`)
- **Architecture Overview:**
  - Browser UI → Next.js route handlers → OpenAI → ImageKit → PostgreSQL → JSON response → browser preview/history updates
- **Business Value:**
  - Low-friction creative workflow (upload → style → generate)
  - Controlled cost exposure via monthly quotas
  - Auditable/user-specific history for later retrieval and download

---

# 2. PROJECT OVERVIEW

- **Project Name:** PixelForge
- **Objective:** Enable authenticated users to generate stylized images from uploads using OpenAI image edits while enforcing monthly quotas.
- **Scope (based on implemented routes/components):**
  - Home page (static marketing content)
  - Protected Studio page at `/studio`
  - API routes under `/api/` for:
    - Upload credentials to ImageKit (`GET /api/upload`)
    - Generate edited image (`POST /api/generate-image`)
    - A test route for Sentry (`GET /api/sentry-example-api`)
- **Main Functionalities (detected):**
  1. Upload image (client uploads to ImageKit)
  2. Select style preset and model
  3. Generate edited image (server)
  4. View history cards and open a history preview dialog
  5. Download generated results
- **Business Use Case:** Convert user photos to stylistic variants with consistent curated styles and stored history.
- **Target Audience:** Authenticated end users of the studio.

---

# 3. TECHNOLOGY STACK

## Frontend
- **Framework:** Next.js (App Router)
- **Runtime:** Browser (React 19)
- **UI/Styling:** Tailwind CSS, Radix UI (components), custom `ui/*` components (e.g., Button, Skeleton)
- **Auth UI:** Clerk (`@clerk/nextjs`)
- **Animation:** `motion` (present in dependencies)
- **State Management:** React Context via `context/StudioWorkbenchContext.tsx`

## Backend
- **Runtime:** Node.js (Next.js route handlers)
- **Framework:** Next.js App Route Handlers
- **Core API routes:**
  - `app/api/generate-image/route.ts`
  - `app/api/upload/route.ts`
  - `app/api/sentry-example-api/route.ts`
- **Observability:** Sentry (`@sentry/nextjs`)
- **Image Processing:** `sharp` (used for reading image metadata and inferring size)
- **AI Integration:** `@ai-sdk/openai` (`generateImage`, `createOpenAI`)

## Database
- **Database Type:** PostgreSQL
- **ORM:** Drizzle ORM
- **Storage Strategy:**
  - Image binaries are not stored in DB; Image URLs and metadata are stored in DB.
  - Generation results are uploaded to ImageKit; DB persists URLs and metadata.

## Authentication
- **Implementation Detected:** Clerk authentication using `@clerk/nextjs/server`.
- **Mechanisms used in code:**
  - `auth()` is called in protected API routes to obtain `userId` and `has` (subscription plan info).
  - `clerkMiddleware` protects `/studio` via `auth.protect()`.
- **Tokens:** The code does not manually implement JWT validation; Clerk handles it internally.

## DevOps & Deployment
- **Sentry:** configured via `next.config.ts` using `withSentryConfig` and `tunnelRoute: "/monitoring"`.
- **No explicit CI/CD workflow files are provided in the visible repository listing**; deployment steps should rely on environment variables and standard Next.js build/start.

---

# 4. FEATURES LIST

## Feature 1: Protected Studio Route
- **Purpose:** Restrict studio access to authenticated users.
- **User Benefit:** Only signed-in users can generate images.
- **Related Components:**
  - `proxy.ts` (Clerk middleware matcher and `auth.protect()` for `/studio`)

## Feature 2: Image Upload via ImageKit Signed Upload Credentials
- **Purpose:** Enable secure client uploads to ImageKit.
- **User Benefit:** Fast uploads and CDN-hosted image URLs.
- **Related Components:**
  - `app/api/upload/route.ts` (issues `token`, `expire`, `signature`)
  - `context/StudioWorkbenchContext.tsx` (calls `/api/upload` and uploads through `@imagekit/next`)

## Feature 3: Curated Style Presets
- **Purpose:** Map style selection to a server-side prompt.
- **User Benefit:** Consistent results without prompt engineering.
- **Related Components:**
  - `lib/style-presets.ts` (style list and prompt text)
  - `components/studio/controls-panel.tsx` (style selection UI)
  - `lib/style-presets.ts` `getStylePreset()` used by generation route

## Feature 4: OpenAI Image Edit Generation
- **Purpose:** Generate a stylized result from an uploaded image using OpenAI image-edit capable models.
- **User Benefit:** One-click generation.
- **Related Components:**
  - `app/api/generate-image/route.ts` (quota checks, validation, `generateImage`, uploads result)
  - `lib/openai.ts` (creates OpenAI provider using `OPEN_AI_API_KEY`)
  - `lib/openai-image-models.ts` (supported models: `gpt-image-1`, `gpt-image-1.5`)

## Feature 5: Monthly Generation Quotas by Plan
- **Purpose:** Limit expensive AI usage per user monthly.
- **User Benefit:** Prevents unlimited generation; enforces plan-based limits.
- **Related Components:**
  - `lib/generation-quota.ts` (plan keys and limits)
  - `DB/generations.ts` (`countGenerationsSince`)
  - `app/api/generate-image/route.ts` (uses `getMonthlyGenerationLimit` and returns 429 when exceeded)

## Feature 6: Generation History & Downloads
- **Purpose:** Persist and display past generations.
- **User Benefit:** Review and download prior results.
- **Related Components:**
  - `DB/schema.ts` (`generations` table schema)
  - `DB/generations.ts` (`createGeneration`, `listUserGenerationSummaries`)
  - `components/studio/preview-panel.tsx` (history cards grid)
  - `components/studio/history-preview-dialog.tsx` (modal preview + download)
  - `components/studio/workbench-ui.tsx` (download helper UI)

---

# 5. FOLDER STRUCTURE

```text
pixelforge/
├── app/
│   ├── api/
│   │   ├── generate-image/
│   │   │   └── route.ts
│   │   ├── upload/
│   │   │   └── route.ts
│   │   └── sentry-example-api/
│   │       └── route.ts
│   ├── studio/
│   │   └── page.tsx
│   ├── sentry-example-page/
│   │   └── page.tsx
│   ├── global-error.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── home/
│   │   ├── GalleryShowcaseSection.tsx
│   │   ├── GridBackground.tsx
│   │   ├── HomeHeroSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── Testimonials.tsx
│   │   └── TestimonialsColumns.tsx
│   ├── studio/
│   │   ├── controls-panel.tsx
│   │   ├── history-preview-dialog.tsx
│   │   ├── preview-panel.tsx
│   │   ├── workbench-ui.tsx
│   │   └── workbench.tsx
│   └── ui/
│       ├── button.tsx
│       └── skeleton.tsx
├── context/
│   └── StudioWorkbenchContext.tsx
├── DB/
│   ├── generations.ts
│   ├── index.ts
│   └── schema.ts
├── lib/
│   ├── clerk-modal-appearance.ts
│   ├── clerk-pricing-appearence.ts
│   ├── constants.ts
│   ├── generation-quota.ts
│   ├── imagekit.ts
│   ├── openai-image-models.ts
│   ├── openai.ts
│   ├── style-presets.ts
│   ├── types.ts
│   └── utils.ts
├── public/
│   └── (static images/videos used by UI)
├── proxy.ts
├── drizzle.config.ts
├── next.config.ts
├── package.json
└── PROJECT_DOCUMENTATION.md
```

Explain important parts:
1. `app/api/*/route.ts`: REST-like route handlers returning JSON.
2. `context/StudioWorkbenchContext.tsx`: central client workflow for upload + generation.
3. `lib/*`: shared configuration (style presets, limits, OpenAI/ImageKit helpers).
4. `DB/*`: Drizzle schema and generation persistence.

---

# 6. SYSTEM ARCHITECTURE

Architecture Pattern: **Client + Next.js API route handlers** with external services.

Request Lifecycle (text diagram):

```text
User
 │
 ▼
Frontend (Next.js Studio UI)
 │
 ▼
API Layer (Next.js Route Handlers)
 │
 ▼
OpenAI Image Edit
 │
 ▼
ImageKit (upload source/result + URLs)
 │
 ▼
Database (Drizzle/PostgreSQL: generation metadata)
 │
 ▼
Response (JSON)
```

Data Flow (high level):
1. Client requests `/api/upload` → receives signed upload parameters.
2. Client uploads original image to ImageKit → gets `sourceImageUrl`.
3. Client calls `POST /api/generate-image` with `sourceImageUrl`, `styleSlug`, `model`.
4. Server validates auth + quota, fetches source image, infers edit size using `sharp`.
5. Server calls `generateImage()` (OpenAI image edit).
6. Server uploads result image to ImageKit → saves DB record → returns `imageBase64` + metadata.

Communication Model:
- JSON over fetch for API calls
- Binary images handled via:
  - client→ImageKit upload
  - server→OpenAI using image buffer

---

# 7. DATABASE DESIGN

## generations
- **Purpose:** Store per-user generation history and ImageKit URLs.
- **Location:** `DB/schema.ts`

Fields (from schema):

| Field | Type | Constraints |
| ----- | ---- | ----------- |
| id | UUID | Primary key, defaultRandom() |
| clerkUserId | text | Not null |
| originalFileName | text | Nullable |
| sourceImageUrl | text | Not null |
| resultImageUrl | text | Not null |
| styleSlug | text | Not null |
| styleLabel | text | Not null |
| model | text | Not null |
| promptUsed | text | Not null |
| createdAt | timestamp (tz) | defaultNow(), not null |
---

# 8. ENTITY RELATIONSHIP DIAGRAM (ERD)

```text
generations
├── id (UUID, PK)
├── clerkUserId (text, not null)
├── originalFileName (text, nullable)
├── sourceImageUrl (text, not null)
├── resultImageUrl (text, not null)
├── styleSlug (text, not null)
├── styleLabel (text, not null)
├── model (text, not null)
├── promptUsed (text, not null)
└── createdAt (timestamp with timezone, not null)

(Implicit) Clerk User
   │
   │ 1:N (not enforced by DB schema in code)
   ▼
   generations
```

---

# 9. SECURITY ARCHITECTURE

## Authentication
- **Clerk is used** for authentication.
- **API protection:**
  - `GET /api/upload`: uses `auth()` and returns 401 if no `userId`.
  - `POST /api/generate-image`: uses `auth()` and returns 401 if no `userId`.

## Authorization
- **Quota enforcement:** Server enforces plan-based monthly generation limits based on `has({ plan: ... })` from Clerk session.

## Session/Token Strategy
- Tokens are managed by Clerk.
- The code does not implement custom JWT parsing/verification.

## Route Protection (Middleware)
- `proxy.ts` uses `clerkMiddleware`.
- It protects routes matching `/studio(.*)` by calling `auth.protect()`.

## Validation
- `POST /api/generate-image` validates:
  - `sourceImageUrl` presence
  - `sourceMimeType` in `ACCEPTED_SOURCE_IMAGE_MIME_TYPES` (`image/jpeg`, `image/png`, `image/webp`)
  - `styleSlug` exists via `getStylePreset()`
  - `model` is present

## Encryption
- No application-level encryption is implemented.

---

# 10. AUTHENTICATION FLOW

```text
User opens /studio
   │
   ▼
Clerk Middleware (proxy.ts) protects /studio
   │
   ▼
User signs in via Clerk UI
   │
   ▼
Frontend calls GET /api/upload
   │
   ▼
Server calls auth() (Clerk)
   │
   ▼
If userId exists → ImageKit signed upload credentials returned
   │
   ▼
Frontend uploads source image to ImageKit
   │
   ▼
Frontend calls POST /api/generate-image
   │
   ▼
Server calls auth() (Clerk)
   │
   ▼
Quota check + generation
   │
   ▼
JSON response (imageBase64 + savedGeneration)
```

---

# 11. APPLICATION FLOW

```text
App Start (Next.js RootLayout)
   │
   ▼
Load routes (/ and /studio)
   │
   ▼
User opens Studio (/studio)
   │
   ▼
Clerk auth protection ensures user is signed in
   │
   ▼
Studio page loads initialHistory + initialQuota
   │
   ▼
Workbench UI renders:
  - Controls panel
  - Preview panel
  - History cards
   │
   ▼
User uploads file
   │
   ▼
Client requests ImageKit upload credentials (/api/upload)
   │
   ▼
Client uploads to ImageKit → gets sourceImageUrl
   │
   ▼
User selects style + model and submits form
   │
   ▼
POST /api/generate-image
   │
   ▼
OpenAI edit → upload result to ImageKit → save DB
   │
   ▼
Client updates state (result preview + history + quota)
```

---

# 12. BACKEND INTERNAL FLOW

Backend flow for `POST /api/generate-image`:

```text
Request (POST /api/generate-image)
  │
  ▼
Next.js Route Handler
  │
  ▼
auth() (Clerk) checks userId
  │
  ▼
Quota enforcement (getMonthlyGenerationLimit + countGenerationsSince)
  │
  ▼
Request validation (sourceImageUrl, mime type, style preset, model)
  │
  ▼
Fetch source image from sourceImageUrl
  │
  ▼
sharp metadata → infer edit size
  │
  ▼
generateImage() (OpenAI image edit)
  │
  ▼
Upload result buffer to ImageKit
  │
  ▼
createGeneration() writes DB record
  │
  ▼
Return JSON to client
```

---

# 13. FRONTEND INTERNAL FLOW

Frontend flow inside Studio:

```text
Entry: /studio page.tsx (server component)
   │
   ▼
Render <StudioWorkbench />
   │
   ▼
StudioWorkbenchProvider initializes context
   │
   ▼
Render StudioControlsPanel + StudioPreviewPanel
   │
   ▼
User selects file
   │
   ▼
Context: getImageKitAuthParams() → upload() to ImageKit
   │
   ▼
User selects style and model
   │
   ▼
User submits form
   │
   ▼
Context fetches POST /api/generate-image
   │
   ▼
Update state: result, history, quota
   │
   ▼
Re-render preview and history UI
```

---

# 14. API DOCUMENTATION

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| ------ | -------- | ----------- | ------------- | ------------ | -------- |
| GET | /api/upload | Get ImageKit upload credentials | Yes | None | `{ token, expire, signature, publicKey }` |
| POST | /api/generate-image | Generate styled image (OpenAI edit) | Yes | `{ sourceImageUrl, sourceMimeType, originalFileName, styleSlug, model }` | `{ imageBase64, mimeType, promptUsed, style, model, savedGeneration }` |
| GET | /api/sentry-example-api | Test endpoint that throws error for Sentry | No | None | Throws error (no normal JSON success) |

## GET /api/upload

- **Purpose:** Issue signed parameters for client-side upload to ImageKit.
- **Auth Requirements:** Yes (Clerk `auth()`)
- **Middleware Used:** Not directly; server-side `auth()` is used in route handler.
- **Request Parameters:** None

**Success Response (example):**

```json
{
  "token": "upload_token_string",
  "expire": 1234567890,
  "signature": "signature_string",
  "publicKey": "public_key_string"
}
```

**Error Response:**

```json
{ "error": "Unauthorized" }
```

**
Written By Yash
