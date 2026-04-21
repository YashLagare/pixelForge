# PROJECT_DOCUMENTATION.txt

## 1. Project Overview

**Project Name:** PixelForge
<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/177d9941-426b-4d83-91ca-372c112ff35d" />


**Purpose:** PixelForge is an AI-powered image restyling platform that allows users to upload images and transform them into various artistic styles using OpenAI's image generation models. It provides a studio interface for users to apply curated style presets to their photos, creating gallery-ready results.

**High-level System Summary:** 
PixelForge is a full-stack web application built with Next.js that integrates AI image generation capabilities. Users can upload images, select from predefined artistic styles (like Storybook 3D, Anime Cel, Clay Render, etc.), and generate transformed versions using OpenAI's GPT Image models. The platform includes user authentication, generation quotas based on subscription tiers, and a history of generated images.

**Business Problem Solved:** 
Addresses the need for accessible AI-powered image styling without requiring users to have advanced design skills or expensive software. Provides a user-friendly interface for applying professional artistic transformations to personal photos.

## 2. Technology Stack

### Frontend
- **Framework:** Next.js 16.1.6 (React 19.2.3)
- **Libraries:** 
  - Clerk (@clerk/nextjs 7.0.8) - Authentication
  - Tailwind CSS 4 - Styling
  - Radix UI - UI components
  - Lucide React - Icons
  - Motion - Animations
  - Shadcn/ui - Component library
- **State Management:** React Context (StudioWorkbenchContext)
- **UI Framework:** Custom components with Tailwind CSS and Radix UI

### Backend
- **Runtime:** Node.js (via Next.js API routes)
- **Framework:** Next.js API Routes
- **Database:** PostgreSQL (Neon serverless)
- **Authentication:** Clerk
- **Major Packages:**
  - Drizzle ORM 0.45.2 - Database queries
  - @ai-sdk/openai 3.0.50 - OpenAI integration
  - @imagekit/next 2.1.5 - Image storage
  - @sentry/nextjs 10.46.0 - Error monitoring
  - Sharp - Image processing

## 3. Features List (FULL)

1. **User Authentication** - Sign up/sign in via Clerk with modal-based auth
2. **Image Upload** - Upload JPG, PNG, WEBP images to ImageKit
3. **Style Presets** - 6 curated artistic styles:
   - Storybook 3D
   - Anime Cel
   - Clay Render
   - Pixart
   - Voxel Block
   - Marble Sculpture
4. **AI Image Generation** - OpenAI GPT Image 1 and 1.5 models
5. **Generation History** - View past generations with previews
6. **Quota Management** - Monthly limits based on subscription tiers:
   - Free: 3 generations/month
   - Pro: 70 generations/month
   - Studio: 140 generations/month
7. **Real-time Preview** - Live preview of uploaded and generated images
8. **Error Monitoring** - Sentry integration for error tracking
9. **Responsive Design** - Mobile and desktop optimized interface
10. **Video Backgrounds** - Hero and showcase videos for visual appeal

## 4. Folder Structure Explanation

- **app/** - Next.js App Router directory
  - **api/** - API route handlers
    - **generate-image/** - Main image generation endpoint
    - **upload/** - ImageKit upload authentication
    - **sentry-example-api/** - Sentry testing endpoint
  - **studio/** - Studio page for image generation
  - **global-error.tsx** - Global error boundary
  - **layout.tsx** - Root layout with Clerk provider
  - **page.tsx** - Home page

- **components/** - React components
  - **home/** - Landing page sections (hero, gallery, pricing, etc.)
  - **studio/** - Studio interface components (workbench, controls, preview)
  - **ui/** - Reusable UI components (button, skeleton)

- **context/** - React Context providers
  - **StudioWorkbenchContext.tsx** - State management for studio

- **DB/** - Database related files
  - **generations.ts** - Database operations for generations table
  - **index.ts** - Drizzle database instance
  - **schema.ts** - Database schema definitions

- **lib/** - Utility libraries
  - **clerk-modal-appearance.ts** - Clerk UI customization
  - **constants.ts** - App constants and configuration
  - **generation-quota.ts** - Quota management logic
  - **imagekit.ts** - ImageKit upload utilities
  - **openai.ts** - OpenAI provider setup
  - **style-presets.ts** - Artistic style definitions
  - **types.ts** - TypeScript type definitions
  - **utils.ts** - General utilities

- **public/** - Static assets (test images)

## 5. System Architecture

**Client-Server Architecture:**
- Frontend: Next.js React application running in browser
- Backend: Next.js API routes handling server-side logic
- Database: PostgreSQL hosted on Neon
- External Services: OpenAI API, ImageKit, Clerk, Sentry

**Request Lifecycle:**
1. User uploads image → Client validates and uploads to ImageKit
2. User selects style and model → Client sends generation request to /api/generate-image
3. Server validates auth and quota → Fetches image from ImageKit
4. Server calls OpenAI API → Receives generated image
5. Server uploads result to ImageKit → Saves metadata to database
6. Server returns result → Client displays generated image

**Data Communication Model:**
- RESTful API endpoints with JSON payloads
- Image data handled via URLs (stored in ImageKit)
- Authentication via Clerk JWT tokens
- Real-time state updates via React Context

## 6. DFD (Data Flow Diagram) Explanation

### Level 0
**Actors:** End Users, OpenAI API, ImageKit Service, Neon Database, Clerk Auth Service

**High-level Data Exchange:**
- User ↔ Frontend Application (image uploads, style selections, results display)
- Frontend ↔ Backend API (generation requests, auth validation, quota checks)
- Backend ↔ OpenAI API (image generation requests)
- Backend ↔ ImageKit (image storage/retrieval)
- Backend ↔ Neon DB (generation history storage)
- Backend ↔ Clerk (user authentication)

### Level 1
**Authentication Process:**
1. User clicks Sign In → Clerk modal opens
2. User provides credentials → Clerk validates
3. Clerk returns JWT token → Stored in client
4. Subsequent requests include JWT → Backend verifies with Clerk

**CRUD Operations:**
- **Create:** Image generation (POST /api/generate-image)
- **Read:** Generation history (fetched on studio load)
- **Update:** None (immutable generation records)
- **Delete:** None (no deletion functionality)

**Data Processing Flow:**
1. Image Upload: File → ImageKit → URL stored in context
2. Generation Request: Context data → API → OpenAI processing → Result URL
3. History Display: DB query → Context state → UI rendering

## 7. ERD (Entity Relationship Diagram) Explanation

**Entities:**

**generations** (Main entity)
- id: UUID (Primary Key)
- clerkUserId: TEXT (Foreign Key to Clerk user)
- originalFileName: TEXT (nullable)
- sourceImageUrl: TEXT
- resultImageUrl: TEXT
- styleSlug: TEXT
- styleLabel: TEXT
- model: TEXT
- promptUsed: TEXT
- createdAt: TIMESTAMP

**Relationships:**
- One-to-Many: Clerk User → generations (one user can have many generations)
- No other direct relationships in database schema

**Fields Explanation:**
- **id:** Unique identifier for each generation
- **clerkUserId:** Links generation to authenticated user
- **originalFileName:** Original uploaded filename (for reference)
- **sourceImageUrl/resultImageUrl:** ImageKit URLs for source and generated images
- **styleSlug/styleLabel:** Style preset identifier and display name
- **model:** OpenAI model used (gpt-image-1 or gpt-image-1.5)
- **promptUsed:** Actual prompt sent to OpenAI
- **createdAt:** Generation timestamp

## 8. SECURITY ARCHITECTURE

**Authentication Mechanism:**
- Clerk-based authentication with JWT tokens
- Modal-based sign-in/sign-up flow
- Session management handled by Clerk

**Authorization:**
- API routes check `auth()` from Clerk
- User ID required for all generation operations
- Quota enforcement based on subscription plans

**Protected Routes:**
- /studio page requires authentication
- /api/generate-image requires valid user session
- /api/upload requires valid user session

**Password Encryption:**
- Handled by Clerk (not implemented in application code)

**Middleware Validation:**
- Clerk auth middleware on API routes
- Input validation for file types, required fields
- Quota checks before processing

**Token Management Strategy:**
- JWT tokens issued by Clerk
- Automatic token refresh handled by Clerk client
- Tokens validated on each API request

## 9. JWT AUTH FLOW (Diagram Explanation)

**Step-by-step Flow:**

1. **Login Request:** User clicks "Sign In" → Clerk modal opens → User enters credentials → Credentials sent to Clerk servers

2. **Credential Validation:** Clerk validates email/password → If valid, generates JWT token → Token contains user ID and session info

3. **JWT Generation:** Clerk creates signed JWT with user claims → Token has expiration time (typically 1 hour)

4. **Token Returned:** JWT sent to client → Stored automatically by Clerk React SDK

5. **Storage:** Token stored in httpOnly cookies (secure) and localStorage (for client access)

6. **Protected API Request:** User initiates generation → Client includes Authorization header with JWT → Request sent to /api/generate-image

7. **JWT Verification Middleware:** Server calls `auth()` from Clerk → Clerk validates JWT signature and expiration → Returns user object if valid

8. **Access Granted/Denied:** If valid, proceed with generation → If invalid/expired, return 401 Unauthorized

**Text Diagram:**
```
User → Sign In Modal → Clerk Server → JWT Created → Client Storage → Generate Request → API Route → auth() Check → Process Generation
```

**Token Expiration:** 1 hour default, auto-refreshed by Clerk SDK

**Security Risks Handled:**
- Token tampering prevented by cryptographic signing
- Expiration prevents indefinite access
- Secure storage in httpOnly cookies
- CORS protection on API routes

**Why Middleware is Needed:** Ensures every API request is authenticated before processing, preventing unauthorized access to expensive AI generation operations.

## 10. APPLICATION FLOW (STEPWISE)

1. **App Startup:** Next.js server starts → Database connection established → Clerk provider initialized

2. **Route Loading:** User visits / → Home page loads with hero section, gallery, pricing

3. **Authentication Check:** User clicks "Get Started" → If not signed in, Clerk modal opens → After auth, redirect to /studio

4. **Studio Load:** Studio page fetches user generation history and quota → Workbench component renders with controls and preview panels

5. **Image Upload:** User selects file → File validated for type/size → Uploaded to ImageKit → Preview displayed

6. **Style Selection:** User chooses style preset and model → Selection stored in context state

7. **Generation Request:** User clicks generate → Form submits → API call to /api/generate-image

8. **API Processing:** Server validates auth and quota → Fetches uploaded image → Calls OpenAI API → Uploads result → Saves to DB

9. **Result Display:** Generated image returned → Displayed in preview panel → Added to history

10. **State Update:** Context state updated → UI re-renders → Quota counter decrements

## 11. BACKEND INTERNAL FLOW

**Route → Middleware → Controller → Service → Model → Database → Response**

**Example: /api/generate-image POST**

1. **Route:** app/api/generate-image/route.ts receives POST request

2. **Middleware:** `auth()` from Clerk validates JWT token → Returns 401 if invalid

3. **Controller:** Route handler validates request body (sourceImageUrl, styleSlug, model) → Checks quota via countGenerationsSince()

4. **Service:** Calls OpenAI generateImage() with processed prompt and image buffer → Handles API errors

5. **Model:** uploadBufferToImageKit() uploads result → createGeneration() saves metadata to DB

6. **Database:** Drizzle ORM executes INSERT into generations table

7. **Response:** JSON with imageBase64, generation metadata returned to client

## 12. FRONTEND INTERNAL FLOW

**App Entry Point:** app/layout.tsx wraps with ClerkProvider

**Routing:** Next.js App Router handles / and /studio routes

**State Management:** StudioWorkbenchContext manages:
- File upload state
- Style/model selections  
- Generation results
- History and quota data
- Loading/error states

**API Integration:** 
- Fetch calls to /api/upload for ImageKit auth
- Fetch calls to /api/generate-image for generation
- Error handling with user-friendly messages

**Component Hierarchy:**
- StudioWorkbenchProvider (context)
  - StudioWorkbenchForm (form wrapper)
    - StudioControlsPanel (style/model selectors, upload)
    - StudioPreviewPanel (image previews)
    - HistoryPreviewDialog (modal for history)

## 13. AUTO API DOCUMENTATION

### API Endpoint Table

| Method | Endpoint | Description | Auth Required | Request Body | Response |
| ------ | -------- | ----------- | ------------- | ------------ | -------- |
| GET | /api/upload | Get ImageKit upload credentials | Yes | None | token, expire, signature, publicKey |
| POST | /api/generate-image | Generate styled image | Yes | sourceImageUrl, sourceMimeType, originalFileName, styleSlug, model | imageBase64, mimeType, promptUsed, style, model, savedGeneration |
| GET | /api/sentry-example-api | Test Sentry error monitoring | No | None | Throws error for testing |

### /api/upload

**Purpose:** Provides authentication parameters for uploading images to ImageKit

**HTTP Method:** GET

**Route Path:** /api/upload

**Authentication required:** Yes (Clerk JWT)

**Middleware used:** Clerk auth()

#### Request
- **Body parameters:** None
- **Query parameters:** None
- **URL params:** None

#### Response
**Success response example:**
```json
{
  "token": "upload_token_string",
  "expire": 1234567890,
  "signature": "signature_string", 
  "publicKey": "public_key_string"
}
```

**Error response example:**
```json
{ "error": "Unauthorized" }
```

#### Flow
Route → auth() middleware → getUploadAuthParams() → Return ImageKit credentials

### /api/generate-image

**Purpose:** Generates a styled version of an uploaded image using OpenAI

**HTTP Method:** POST

**Route Path:** /api/generate-image

**Authentication required:** Yes (Clerk JWT)

**Middleware used:** Clerk auth(), quota validation

#### Request
**Body parameters:**
- sourceImageUrl (string, required): ImageKit URL of uploaded source image
- sourceMimeType (string, required): MIME type (image/jpeg, image/png, image/webp)
- originalFileName (string, optional): Original filename
- styleSlug (string, required): Style preset identifier
- model (string, required): OpenAI model (gpt-image-1 or gpt-image-1.5)

**Query parameters:** None

**URL params:** None

#### Response
**Success response example:**
```json
{
  "imageBase64": "base64_encoded_image",
  "mimeType": "image/png",
  "promptUsed": "Transform the uploaded image...",
  "style": { "slug": "storybook-3d", "label": "Storybook 3D" },
  "model": "gpt-image-1",
  "savedGeneration": {
    "id": "uuid",
    "clerkUserId": "user_id",
    "sourceImageUrl": "https://...",
    "resultImageUrl": "https://...",
    "styleSlug": "storybook-3d",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error response examples:**
```json
{ "error": "Unauthorized" }
{ "error": "Monthly generation limit reached (3 images). Upgrade your plan or try again next month.", "code": "QUOTA_EXCEEDED", "limit": 3, "used": 3 }
{ "error": "Please upload an image first." }
{ "error": "Only JPG, PNG, and WEBP files are supported." }
{ "error": "Please choose a style." }
{ "error": "Missing OPENAI_API_KEY." }
```

#### Flow
Route → auth() → Quota check → Fetch source image → Infer image size → Generate prompt → Call OpenAI API → Upload result to ImageKit → Save to DB → Return result

### /api/sentry-example-api

**Purpose:** Test endpoint that throws an error for Sentry monitoring

**HTTP Method:** GET

**Route Path:** /api/sentry-example-api

**Authentication required:** No

**Middleware used:** None

#### Request
- **Body parameters:** None
- **Query parameters:** None
- **URL params:** None

#### Response
Always throws error for testing purposes

#### Flow
Route → Log to Sentry → Throw SentryExampleAPIError

## 14. Dependencies Installation

### Backend Setup
1. cd /path/to/pixelforge
2. npm install
3. Set up .env file with required variables
4. npm run db:push (to create database schema)
5. npm run dev

**Important dependencies:**
- @ai-sdk/openai: OpenAI API integration
- drizzle-orm: Database ORM
- @neondatabase/serverless: PostgreSQL connection
- @clerk/nextjs: Authentication
- @imagekit/nodejs: Image storage
- @sentry/nextjs: Error monitoring
- sharp: Image processing

### Frontend Setup
1. cd /path/to/pixelforge  
2. npm install
3. npm run dev

**Main libraries:**
- next: React framework
- react/react-dom: React core
- @clerk/nextjs: Auth components
- tailwindcss: Styling
- radix-ui: UI primitives
- lucide-react: Icons
- motion: Animations

## 15. Environment Variables

Based on code analysis, the following environment variables are required:

- **DATABASE_URL**: PostgreSQL connection string for Neon database
- **OPEN_AI_API_KEY**: OpenAI API key for image generation
- **NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY**: Public key for ImageKit image storage
- **IMAGEKIT_PRIVATE_KEY**: Private key for ImageKit uploads
- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Clerk authentication public key
- **CLERK_SECRET_KEY**: Clerk authentication secret key
- **CI**: Optional, for Sentry deployment (set to true in CI)

## 16. How To Run Project

**Prerequisites:**
- Node.js installed
- npm or yarn package manager
- PostgreSQL database (Neon recommended)

**Step-by-step setup:**

1. **Clone/download the project**
   ```bash
   cd /path/to/pixelforge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy .env.example to .env (if exists) or create .env
   - Fill in all required variables (DATABASE_URL, OPEN_AI_API_KEY, etc.)

4. **Set up database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   - Navigate to http://localhost:3000
   - Sign up for an account
   - Access the studio at /studio

**For production deployment:**
- Set CI=true for Sentry
- Deploy to Vercel/Netlify with environment variables configured

## 17. Runtime Flow (After Startup)

**Server Initialization:**
- Next.js starts on port 3000
- Database connection established via Drizzle
- Clerk provider initialized
- Sentry error monitoring active

**API Communication:**
- Frontend makes authenticated requests to /api/* endpoints
- Image uploads go through ImageKit with temporary credentials
- Generation requests include source image URL and style parameters

**Authentication Checks:**
- All studio and API routes check Clerk authentication
- JWT tokens validated on each request
- Quota limits enforced before AI processing

**Data Rendering:**
- Home page displays static content with auth-dependent navigation
- Studio page loads user history and quota data server-side
- Real-time updates handled via React state management

## 18. Common Errors & Fixes

**Database connection failed:**
- Check DATABASE_URL format and credentials
- Ensure Neon database is active
- Run `npm run db:push` to sync schema

**OpenAI API errors:**
- Verify OPEN_AI_API_KEY is set correctly
- Check API key has sufficient credits
- Handle rate limiting (429 errors)

**ImageKit upload failed:**
- Check IMAGEKIT_PRIVATE_KEY and NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
- Verify ImageKit account has storage quota
- Check file size limits (default 25MB)

**Authentication issues:**
- Verify CLERK_SECRET_KEY and NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- Check Clerk application is published
- Clear browser cookies if token issues

**Build errors:**
- Ensure Node.js version >= 18
- Run `npm install` to update dependencies
- Check TypeScript compilation errors

## 19. Developer Notes

**Scalability Improvements:**
- Implement Redis caching for generation history
- Add image CDN optimization
- Consider queue system for high-volume generation requests

**Performance Suggestions:**
- Lazy load generation history
- Implement image compression before upload
- Add service worker for offline image caching

**Security Improvements:**
- Add rate limiting per user/IP
- Implement image content moderation
- Add audit logging for generation requests

**Architecture Notes:**
- Single Next.js app handles both frontend and API
- Serverless database (Neon) scales automatically
- External services (OpenAI, ImageKit) handle heavy processing
- Clerk manages authentication complexity

This documentation provides a complete technical overview of the PixelForge application, covering all aspects from high-level architecture to detailed API specifications. The codebase follows modern Next.js patterns with proper separation of concerns and robust error handling.
