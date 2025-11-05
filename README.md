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
