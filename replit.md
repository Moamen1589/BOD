# replit.md

## Overview

This is a corporate website for **"ولادة حلم للاستشارات والأبحاث" (Birth of a Dream Consulting & Research)**, a Saudi Arabian consulting firm specializing in empowering non-profit organizations. The site is an Arabic RTL (right-to-left) multi-page application with a landing page (hero, about, services, digital solutions, why-us, testimonials, contact) plus dedicated sections for blog, work library, and digital solutions. It includes a full admin CMS dashboard for managing all content. Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Feb 2026)
- **Major site restructuring**: Added blog (المدونة), work library (مكتبة الأعمال), and digital solutions (حلولنا الرقمية) sections
- **Blog section**: News/articles/newsletters with category filtering at /blog and /blog/:slug
- **Work Library**: Portfolio of completed projects across 5 categories (strategic planning, procedural guides, annual plans, community initiatives, motion graphics) at /work-library and /work-library/:slug
- **Digital Solutions**: Platforms, case studies, and publications at /solutions and /solutions/:slug
- **New admin pages**: /admin/blog, /admin/work-library, /admin/solutions with full CRUD UI
- **Navbar restructured**: "مكتبة الأعمال" dropdown (5 categories + view all), "حلولنا الرقمية" dropdown (platforms + types), "المدونة" link, "من نحن" dropdown
- **Database schema expanded**: Added work_items and digital_solutions tables, added category field to articles
- **Dashboard updated**: Shows stats for blog posts, work items, solutions, services, and messages
- **Old articles system removed**: Replaced by blog system with news/article/newsletter categories
- **All purple colors removed** from site, replaced with orange/gold throughout all components
- **Services section**: 9 seeded services from bod.com.sa, admin CRUD, public pages at /services and /services/:slug
- **Color scheme**: Orange (#FF6900) primary branding
- **Navbar design**: Rounded black floating design (rounded-2xl, bg-brand-dark/95, backdrop-blur, fixed top-4)
- **Scroll animations**: IntersectionObserver-based animations on all sections
- **Admin CMS Dashboard**: Full admin panel at `/admin` with login, dashboard stats, content management
- **Contact form**: Connected to backend API (/api/contact) storing messages in PostgreSQL
- **Session-based auth**: bcryptjs password hashing, connect-pg-simple session store
- **Font**: Almarai (Arabic) with Inter (Latin)

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Uses `wouter` for client-side routing
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with custom brand colors defined in `tailwind.config.ts`:
  - `brand-gold` (#FF6900) - primary orange
  - `brand-gold-dark` (#E85D00) - darker orange for text
  - `brand-dark` (#242423) - primary text
  - `brand-gray` (#73748C) - secondary text
  - `brand-light` (#FCFCFC) - light background
  - `brand-light-gold` (#FFF3E8) - orange tinted background
- **Fonts**: Almarai (Arabic) and Inter (Latin) loaded from Google Fonts
- **Language/Direction**: Arabic (RTL) — HTML lang is set to "ar" with dir="rtl"
- **Animations**: Scroll-triggered animations via `useScrollAnimation` hook (IntersectionObserver, 15% threshold)
- **Component Structure**: Page-level components in `client/src/pages/`, section components in `client/src/components/`, UI primitives in `client/src/components/ui/`, admin pages in `client/src/pages/admin/`
- **Public Pages**: Landing (Box.tsx), /blog, /blog/:slug, /work-library, /work-library/:slug, /solutions, /solutions/:slug, /services, /services/:slug
- **Admin Pages**: Login, Dashboard, Blog, WorkLibrary, Solutions, Services, Messages, Settings
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`, `@assets/` maps to `attached_assets/`

### Backend
- **Framework**: Express.js running on Node.js with TypeScript
- **API Pattern**: RESTful API with `/api` prefix. Routes in `server/routes.ts`
- **Authentication**: Session-based auth with bcryptjs password hashing, connect-pg-simple session store
- **Storage Layer**: `DatabaseStorage` class in `server/storage.ts` using Drizzle ORM for PostgreSQL queries
- **API Routes**:
  - Public: `/api/blog`, `/api/work-library`, `/api/solutions`, `/api/services`, `/api/contact`
  - Admin: `/api/admin/blog`, `/api/admin/work-library`, `/api/admin/solutions`, `/api/admin/services`, `/api/admin/messages`, `/api/admin/settings`, `/api/admin/dashboard`
  - Auth: `/api/admin/login`, `/api/admin/logout`, `/api/admin/me`

### Database
- **ORM**: Drizzle ORM for both schema definition and runtime queries
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM syntax
- **Tables**:
  - `users` - id (UUID), username, password, role (admin/editor)
  - `contact_messages` - id (serial), name, phone, email, purpose, message, isRead, createdAt
  - `site_settings` - id (serial), key (unique), value, updatedAt
  - `services` - id (serial), title, slug (unique), description, deliverables (text[]), icon, sortOrder, published
  - `articles` - id (serial), title, slug (unique), excerpt, content, category (news/article/newsletter), imageUrl, publishDate, published, createdAt
  - `work_items` - id (serial), title, slug (unique), description, content, category (strategic-planning/procedural-guides/annual-plans/community-initiatives/motion-graphics), imageUrl, fileUrl, published, createdAt
  - `digital_solutions` - id (serial), title, slug (unique), description, content, solutionType (platform/case-study/publication), imageUrl, link, published, createdAt
- **Initial Setup**: Tables created automatically on server start via `server/db.ts` initDb()
- **Seed Data**: Admin user, 9 services, 6 blog posts, 10 work items, 8 digital solutions
- **Connection**: Uses `DATABASE_URL` environment variable

### Build & Scripts
- `npm run dev` — Start development server with HMR
- `npm run build` — Build frontend with Vite and bundle server with esbuild
- `npm run start` — Run production build
- `npm run check` — TypeScript type checking
- `npm run db:push` — Push Drizzle schema to database

### Key Design Decisions
1. **Shared schema between client and server**: The `shared/` directory contains types used by both frontend and backend
2. **Drizzle ORM**: Used for both schema definition and runtime queries
3. **Session-based admin auth**: Uses express-session with connect-pg-simple for persistent sessions
4. **Floating navbar**: Navbar positioned fixed with top-4, rounded-2xl, black background with backdrop-blur
5. **Scroll animations**: IntersectionObserver-based with CSS transitions and stagger delays
6. **Category-based filtering**: Blog, work library, and solutions all support category/type filtering via query params

## External Dependencies

- **Database**: PostgreSQL via Drizzle ORM. Requires `DATABASE_URL` environment variable
- **Session Store**: `connect-pg-simple` for PostgreSQL-backed session storage
- **Auth**: `bcryptjs` for password hashing
- **Fonts**: Google Fonts CDN (Almarai and Inter font families)
- **Logo**: Loaded from bod.com.sa CDN
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`

## Admin Access
- Default credentials: admin / admin123 (should be changed after first login)
- Admin panel URL: `/admin`
- Session persists for 24 hours
