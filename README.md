# NoteSage

NoteSage is a web application for generating, saving, and sharing study notes using AI. It combines a Next.js frontend with server-side API routes, Clerk authentication, and a MongoDB backend. The app allows users to generate notes from prompts, save them to a personal library, and publish posts to community topics.

Key features

- AI-powered notes generation (server-side LLM integration)
- Save, edit and export notes (PDF)
- Publish notes as posts in topic feeds
- User authentication with Clerk
- Community features: Explore topics, upvote/downvote posts

---

## Tech stack

This project uses the following core libraries and services (links go to their official GitHub repositories or homepages):


<!-- Badges row: colored logo-style labels linking to official sources -->

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://github.com/vercel/next.js)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://github.com/tailwindlabs/tailwindcss)
[![Clerk](https://img.shields.io/badge/Clerk-7C3AED?style=for-the-badge&logo=clerk&logoColor=white)](https://github.com/clerkinc/clerk-js)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/mongodb/mongo)
[![Mongoose](https://img.shields.io/badge/Mongoose-884DFF?style=for-the-badge&logo=mongoose&logoColor=white)](https://github.com/Automattic/mongoose)
[![html2pdf.js](https://img.shields.io/badge/html2pdf.js-FF6D00?style=for-the-badge)](https://github.com/eKoopmans/html2pdf.js)
[![Wysimark](https://img.shields.io/badge/Wysimark-222222?style=for-the-badge)](https://www.npmjs.com/package/@wysimark/react)


This list highlights the main technologies used in the app. Click the badges to go to the official project pages or repos.

---
---

## Table of contents

- [Quick start](#quick-start)
- [Environment](#environment)
- [Scripts](#scripts)
- [Architecture overview](#architecture-overview)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Quick start

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/Soham-Donode/notesage.git
cd notesage
npm install
```

2. Create environment variables (see [Environment](#environment) or copy `.env.example` to `.env.local`).

3. Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

For a production build:

```bash
npm run build
npm run start
```

---

## Screenshots

Add screenshots to `public/screenshots/` and reference them here. Two suggested placeholders are provided below — replace the image paths with real screenshots when available.

Lander / Home page preview

<img width="1796" height="928" alt="Screenshot from 2025-11-10 15-04-58" src="https://github.com/user-attachments/assets/d961eeaa-bfad-4863-a034-93f87c4df579" />

Generation page preview
<img width="1796" height="928" alt="Screenshot from 2025-11-10 15-06-56" src="https://github.com/user-attachments/assets/76b8cf4e-21dc-4837-9010-8124993c9675" />

Notes

- Create `public/screenshots/` and add `lander-preview.png` and `generation-preview.png` (recommended size: 1200×700px).
- Use descriptive captions and alternate text for accessibility.


## Environment

Copy `.env.example` to `.env.local` and fill the values. Do NOT commit secrets to the repository.

Required variables (used throughout the codebase):

- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...  # Clerk client key (exposed to client)
- CLERK_SECRET_KEY=sk_...                  # Clerk server secret (server-only)
- CLERK_WEBHOOK_SECRET=whsec_...           # Clerk webhook verification secret
- GEMINI_API_KEY=...                       # Google/LLM API key used by server-side generation routes
- MONGODB_URI=mongodb+srv://<user>:<password>@cluster.example.net/<db>?retryWrites=true&w=majority

Optional / helpful variables:

- NODE_ENV=development|production
- PORT=3000
- NEXTAUTH_URL=https://your-domain.com  # if deploying with providers that require it

Notes

- Variables prefixed with `NEXT_PUBLIC_` are available in client bundles.
- Keep server-only keys out of client code and Git.

---

## Scripts

- `npm run dev` — Start Next.js in development mode
- `npm run build` — Build for production
- `npm run start` — Start the production server (after build)
- `npm run lint` — Run ESLint

---

## Architecture overview

- Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- Auth: Clerk (sign-up, sign-in, webhooks for user lifecycle)
- Backend: Next.js API routes for notes, posts, generation, refactor, and webhooks
- Database: MongoDB via Mongoose (connection in `lib/mongodb.ts`)
- AI: Server-side integration with a generative model (configured in `app/api/generate/route.ts`)

Key folders

- `app/` — Next.js app routes and pages
- `app/api/` — Serverless API routes (generation, posts, notes, webhooks, etc.)
- `components/` — Reusable React components
- `lib/` — Helpers (MongoDB connector, utilities)
- `models/` — Mongoose models: `User`, `Post`, `Note`

---

## Development notes

- Search overlay: `components/SearchOverlay.tsx` provides a site-wide search UI and is wired to the `NavBar` via the `onSearchClick` prop.
- LLM keys: Generation happens on the server. The routes expect `GEMINI_API_KEY` to be set server-side. There are helper routes to test the key.
- Webhooks: Clerk webhooks are verified using `CLERK_WEBHOOK_SECRET` in `app/api/webhooks/clerk/route.ts`.

Quality gates

- The project enforces ESLint rules which can fail the production build if not satisfied. Run `npm run lint` and fix issues before opening PRs.

---

## Contributing

Contributions are welcome. A minimal workflow:

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make changes and run tests/lint
4. Commit and push: `git push origin feat/your-feature`
5. Open a Pull Request describing your changes

Please include a short description and link to any related issue.

---

## Troubleshooting

- Build fails with ESLint errors: run `npm run lint` and address reported issues. Some TypeScript `any` usages are flagged by `@typescript-eslint/no-explicit-any`.
- `GEMINI_API_KEY` errors: verify the key is valid and that the server has access to it. There is an API route `app/api/test-key/route.ts` to help validate the key.
- Clerk webhooks not verified: ensure `CLERK_WEBHOOK_SECRET` matches the secret in your Clerk dashboard and your webhook endpoint URL is correctly configured.

If you hit issues not listed here, open an issue with logs and reproduction steps.

---

## License

This repository does not include a license file. If you plan to open source it, add a `LICENSE` (for example MIT) and update this section.

---

Last updated: 2025-11-10
# StudyFlow: AI-Powered Notes Generation & Community

StudyFlow is an innovative web application designed to help students generate comprehensive, personalized notes using AI. The platform fosters collaborative learning, allowing students to share notes, form study groups, and connect with peers.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## Features

### Core Feature: AI Notes Generation

- **Personalized Notes:** Provide a subject prompt and select a format (summary, flashcards, Q&A) to generate notes tailored to your learning style.
- **LLM Integration:** Leverages a powerful Large Language Model for high-quality, relevant notes.
- **Save & Organize:** Save generated notes to a personal dashboard for easy access and organization.

### Community & Collaboration

- **Monetized Blogs:** Publish generated notes as blog posts with public previews. Monetize your content and showcase expertise.
- **Study Groups:** Create and join study groups for real-time discussion and collaborative learning.

---

## Tech Stack

**Frontend & Backend**

- **Next.js:** React framework for fast, scalable, server-rendered web apps. Handles UI and backend API routes.
- **Tailwind CSS:** Utility-first CSS framework for custom designs and responsive layouts.

**Database & Backend Services**

- **Supabase:** Open-source Firebase alternative with PostgreSQL, authentication, and real-time features.

**Authentication**

- **Clerk:** User management and authentication service for sign-up, sign-in, and session management.

**LLM Integration**

- **LLM API:** API from a Large Language Model provider (e.g., OpenAI, Anthropic) powers notes generation.

**Other Tools & Libraries**

- **Tiptap:** Headless rich text editor for creating and editing notes and blog posts.
- **Git & GitHub:** Version control and team collaboration with branches and pull requests.

---

## Getting Started

To get a local copy up and running:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   - Create a `.env.local` file in the project root.
   - Add your Clerk, MongoDB, LLM API keys, and webhook secret:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
     CLERK_SECRET_KEY=...
     GEMINI_API_KEY=...
     MONGODB_URI=...
     CLERK_WEBHOOK_SECRET=...
     ```

4. **Set up Clerk webhooks:**

   - In your Clerk Dashboard, go to Webhooks.
   - Add a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`
   - Copy the webhook secret and add it to `CLERK_WEBHOOK_SECRET` in `.env.local`

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Contributing

We welcome contributions! Please follow the standard Git workflow:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'feat: Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a Pull Request.

---

## Roadmap

**Phase 1: Core Functionality (MVP)**

- User authentication and profile management
- Notes generation with LLM integration
- Saving and displaying user-generated notes

**Phase 2: Community Features**

- Publishing notes as public blog posts
- Basic monetization implementation

**Phase 3: Collaboration**

- Real-time study group chat functionality
- Advanced note sharing and collaborative editing

---

This README provides a comprehensive overview of the project for your team and potential collaborators.

---

## Environment

Create a `.env.local` file in the project root to hold secrets and API keys used by the app. This repository's `.gitignore` already ignores `.env*`, so `.env.local` will not be committed by default.

Required variables (use your provider keys):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key (safe to expose to client).
- `CLERK_SECRET_KEY` — Clerk secret key (server-only).
- `GEMINI_API_KEY` — LLM/Google API key used for generation.
- `MONGODB_URI` — MongoDB connection string.

Example (`.env.local`):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
GEMINI_API_KEY=your_llm_key_here
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.example.net/<db>?retryWrites=true&w=majority
```

Quick verification:

- Start the dev server:

```powershell
npm run dev
```

- In Next.js, variables prefixed with `NEXT_PUBLIC_` are available on the client; others are server-only. You can log `process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` from a client component to verify it's loaded.

Security notes:

- Do not commit `.env.local` or secret keys. Rotate any keys you believe were exposed publicly.
- If secrets were accidentally committed, remove them from history (for example, using `git filter-repo` or contacting your Git host support) and rotate the keys.
