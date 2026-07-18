# 💰 Finance Intelligence App

**Comprehensive Next.js-powered platform to track your expenses, analyze your finances, and leverage Gemini AI to parse receipts and unlock insights.**

> _This project is GitHub-ready and portfolio-ready. Suitable for showcasing full-stack, AI, and modern web skills._

---

## 🚀 Highlight Features (Resume-Ready)

- **Gemini AI Receipt Analysis**: Upload receipt images and auto-extract amount, date, category, merchant, and summaries—powered by Google Gemini LLMs (see `/actions/transaction.js`)
- **Next.js 15 Fullstack**: Modern SSR/SSG/Client mix for seamless navigation; includes Next.js App Router
- **Secure Auth & User Management**: Clerk Auth integration (sign-up, login, secure API/data access)
- **Prisma/PostgreSQL Data Layer**: Robust models for accounts, transactions, budgets, and users
- **Dynamic Account and Transaction Management**: Create and edit multiple accounts; categorize, search, and summarize transactions
- **Budget Alerts and Tracking**: Set budgets with instant warnings and visual progress bars (see UI components)
- **Rich UI/UX**: Responsive, themeable UI (Tailwind, Radix UI, Lucide, Sonner notifications, modern hero section)
- **Email Notifications**: (resend integration ready for transactional emails)
- **ArcJet Security/Ratelimit**: Battle-tested rate limiting on sensitive endpoints
- **Category System**: Pre-defined and customizable categories for expenses and income
- **Open for Collaboration**: Modular, testable, with clear separation between actions, database, and UI

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI, Lucide
- **Backend**: Node.js 20, Prisma ORM, PostgreSQL
- **AI/ML**: Google Gemini AI (API integration, `google-genai` python for easy API key tests too)
- **Cloud/Infra**: Vercel ready, email via Resend, security via ArcJet
- **Auth**: Clerk
- **Utilities**: Zod (validation), dayjs/date-fns, Sonner (toasts)

---

## ✨ Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/YOUR_GITHUB/financeProject.git
   cd financeProject
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn
   ```
3. **Setup environment variables:**
   - Copy `.env.example` to `.env` and fill out:
     - `DATABASE_URL`/`DIRECT_URL` (see Supabase, Render, or local Postgres)
     - `CLERK_SECRET_KEY`, `CLERK_PUBLIC_KEY`
     - `ARCJET_KEY`, `RESEND_API_KEY`, etc.
     - `GEMINI_API_KEY` (**for Google Gemini features, use free/dev key from Google**)
4. **Database migration:**
   ```sh
   npx prisma migrate deploy # (or npx prisma migrate dev)
   ```
5. **Dev server:**
   ```sh
   npm run dev
   # Visit http://localhost:3000
   ```

---

## 🤖 Gemini AI API Key Verification (Python)
(optional, for easy resume/demo/testing):

```sh
pip install -r requirements.txt
python test_gemini_key.py
```
If your Gemini key works you’ll get a friendly reply from Gemini in the console.

---

## 🏆 What Sets This Project Apart?
- **Resume-Ready AI Feature**: Show interviewers fully-working AI-powered expense/receipt parsing (Gemini via both Python and Node)
- **Enterprise-Style Engineering**: Modular actions layer, protected endpoints, strong types, test separation, cloud-native
- **Plug & Play for Startups**: Just add Stripe/PayPal integration and you have a product!
- **Demo Focused**: Try demo login, create/test/seed data, and explore dashboard right away

## 🖥️ Demo: Core User Flows
1. **Sign up/login** (Clerk, social, or demo)
2. **Create an account** (Current/Savings)
3. **Add and categorize a transaction** (manual or via receipt image)
4. **Set and track budgets**
5. **Get visual feedback and recommendations** via the dashboard

---

## 📝 Contributing & Collaboration
- Fork, branch, and PR!
- All sensitive config in `.env` (and `.env` is gitignored)
- See `/components`, `/actions`, `/lib`, `/data`, `/prisma`, `/public` for modular code structure
- Add Gemini, AI, or OpenAI features, and send a PR!

---

## 📄 Example .env (never commit your real keys!)
See `.env.example` for the keys/structure:
```
DATABASE_URL=postgresql://... # your db
DIRECT_URL=postgresql://... # for Prisma migration
CLERK_SECRET_KEY=...
CLERK_PUBLIC_KEY=...
RESEND_API_KEY=...
GEMINI_API_KEY=...
ARCJET_KEY=...
```

---

## 📚 Further Reading/Docs
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.dev/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

**Build with intelligence, showcase with confidence.**

---
