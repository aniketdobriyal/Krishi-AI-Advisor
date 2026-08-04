# Contributing Guidelines – Krishi AI Advisor 🌾

Thank you for contributing to the **Krishi AI Advisor** project! This guide outlines the setup procedures, coding standards, and submission workflow.

---

## 🛠️ Local Development Setup

1. **Fork and Clone repository**:
   ```bash
   git clone https://github.com/your-username/Krishi-AI-Advisor.git
   cd Krishi-AI-Advisor
   ```

2. **Backend Installation**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env to add your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
   npm run dev
   ```

3. **Frontend Installation**:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

---

## 📐 Code Style Guidelines

- **JavaScript / React**:
  - Follow modern ECMAScript standard (ES Modules).
  - Use Functional Components with React Hooks.
  - Keep components modular, accessible, and clean.
- **Styling**:
  - Use standard design tokens (Harmony green theme) in Tailwind CSS / Vanilla CSS.
  - Ensure mobile responsiveness for all card layouts and touch controls.
- **Backend Architecture**:
  - Maintain clean MVC architecture separation (`routes/` -> `controllers/` -> `services/` -> `models/`).
  - Secure sensitive endpoints with `verifyToken` middleware.

---

## 🧪 Testing & Verification

Before submitting a Pull Request, run local verification:
```bash
# In frontend directory
npm run lint
npm run build
```

Ensure no syntax errors or breaking changes are introduced.

---

## 🚀 Pull Request Workflow

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit your changes: `git commit -m 'feat: Add amazing feature'`
3. Push to the branch: `git push origin feature/amazing-feature`
4. Open a Pull Request on GitHub describing your changes and verification steps.
