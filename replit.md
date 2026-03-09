# replit.md

## Overview

This is a corporate website for **"ولادة حلم للاستشارات والأبحاث" (Birth of a Dream Consulting & Research)**, a Saudi Arabian consulting firm specializing in empowering non-profit organizations. The site is a full-stack Arabic (RTL) web application with a public-facing marketing site and a full admin CMS dashboard for content management. It features multiple content sections: services, blog (news/articles/newsletters), work library (portfolio), and digital solutions (platforms/case studies/publications).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` for lightweight client-side routing
- **State Management**: TanStack React Query for server state (fetch, cache, mutations)
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom brand colors defined in `tailwind.config.ts`:
  - `brand-gold` (#FF6900) — primary orange
  - `brand-gold-dark` (#E05D00) — darker orange for hover/text
  - `brand-dark` (#242423) — primary text color
  - `brand-gray` (#73748C) — secondary text
  - `brand-light` (#FCFCFC) — light backgrounds
  - `brand-light-gold` (#FFF3E8) — orange-tinted backgrounds
- **Fonts**: Almarai (Arabic) and Inter (Latin) loaded from Google Fonts
- **Language/Direction**: Arabic RTL — HTML lang="ar" with dir="rtl"
- **Animations**: Scroll-triggered animations via `useScrollAnimation` hook using IntersectionObserver (15% threshold)
- **Component Structure**:
  - Page components: `client/src/pages/`
  - Section components: `client/src/components/` (HeroSection, AboutSection, ServicesSection, etc.)
  - UI primitives: `client/src/components/ui/` (shadcn components)
  - Admin pages: `client/src/pages/admin/`
- **Public Pages**: Landing (`Box.tsx`), `/services`, `/services/:slug`, `/blog`, `/blog/:slug`, `/work-library`, `/work-library/:slug`, `/solutions`, `/solutions/:slug`
- **Admin Pages**: `/admin/login`, `/admin` (dashboard), `/admin/messages`, `/admin/settings`, `/admin/services`, `/admin/blog`, `/admin/work-library`, `/admin/solutions`

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed via `tsx` in dev and bundled with `esbuild` for production
- **API Design**: RESTful JSON API under `/api/*` prefix
- **Key API Routes**:
  - `POST /api/contact` — contact form submissions
  - `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — admin authentication
  - CRUD endpoints for `/api/services`, `/api/blog`, `/api/work-library`, `/api/solutions`, `/api/messages`, `/api/settings`
- **Authentication**: Session-based auth with `express-session` and `connect-pg-simple` session store in PostgreSQL. Passwords hashed with `bcryptjs`. Admin routes protected by `requireAuth` middleware.
- **Seeding**: Server auto-seeds admin user, services, work items, blog posts, and digital solutions on startup

### Database
- **Database**: PostgreSQL (via Neon serverless driver for connection, `pg` Pool for sessions/queries)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` — shared between client and server
- **Schema Push**: `drizzle-kit push` (no migration files, direct schema push)
- **Tables**:
  - `users` — admin accounts (UUID primary key, username, password, role)
  - `contact_messages` — contact form submissions (name, phone, email, purpose, message, isRead)
  - `site_settings` — key-value settings store
  - `services` — consulting services (title, slug, description, deliverables JSON array, icon, sortOrder, published)
  - `articles` — blog posts (title, slug, excerpt, content, category [news/article/newsletter], imageUrl, publishDate, published)
  - `work_items` — portfolio items (title, slug, category, description, content, imageUrl, published)
  - `digital_solutions` — digital platforms/case studies/publications (title, slug, type, description, content, link, imageUrl, published)
- **Validation**: Zod schemas generated from Drizzle table definitions via `drizzle-zod` (`createInsertSchema`)

### Build & Deployment
- **Dev**: `tsx server/index.ts` with Vite middleware for HMR
- **Build**: Vite builds frontend to `dist/public/`, esbuild bundles server to `dist/index.js`, CJS wrapper at `dist/index.cjs`
- **Production**: `node dist/index.cjs` serves static files from `dist/public/` with Express
- **Path Aliases**: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`

### Storage Layer
- **Pattern**: Repository/storage pattern with `IStorage` interface in `server/storage.ts`
- **Implementation**: `DatabaseStorage` class using Drizzle ORM queries
- All database operations go through the `storage` singleton, making it easy to swap implementations

## External Dependencies

- **Database**: PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- **Neon**: `@neondatabase/serverless` is installed (Neon-compatible PostgreSQL)
- **Session Store**: `connect-pg-simple` stores sessions in PostgreSQL
- **Google Fonts**: Almarai and Inter fonts loaded from Google Fonts CDN
- **External Assets**: Company logo loaded from `bod.com.sa` domain
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev only)
- **Key NPM Packages**:
  - `drizzle-orm` + `drizzle-kit` — ORM and schema management
  - `express` + `express-session` — HTTP server and sessions
  - `bcryptjs` — password hashing
  - `zod` + `drizzle-zod` — runtime validation
  - `@tanstack/react-query` — data fetching/caching
  - `wouter` — client-side routing
  - `recharts` — charting (admin dashboard)
  - `embla-carousel-react` — carousel component
  - `react-day-picker` — calendar component
  - `vaul` — drawer component
  - `lucide-react` — icon library
  - `date-fns` — date formatting
  - `nanoid` — ID generation