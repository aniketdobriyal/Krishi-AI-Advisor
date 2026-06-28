# Krishi AI Advisor 🌾

An AI-powered crop advisory dashboard prototype designed for field supervisors of the **Mandakini Organic Produce Collective** in Uttarakhand, India. 

The application provides supervisors with instant, actionable guidance on crop diseases, organic pest management, and post-harvest compliance, helping bridge the gap when agricultural extension officers are not immediately reachable in remote mountain block fields.

---

## 🌟 Key Features

*   💬 **AI-Powered Advisor Chat**: Interactive conversational interface that queries a public LLM API (**Gemini 1.5 Flash**) configured with custom prompt constraints tailored to Uttarakhand mountain crops and organic farming practices.
*   📴 **Robust Offline Fallback**: In low-connectivity or offline mountainous regions, a built-in search engine automatically scans local disease and pest databases for instant symptom matching and structured responses.
*   🎙️ **Voice Assistance**: Simulates microphone voice dictation with visual soundwave animation and typing feedback to support supervisors dictating queries in field conditions.
*   🔊 **Bilingual Text-to-Speech (TTS)**: Reads advisory sections aloud in clear, synthesized voice formats (supporting both Indian Hindi `hi-IN` and English `en-US`).
*   🌐 **Full Devanagari Localization**: Swaps all user interface cards, databases, settings, alerts, and instructions instantly between English and Hindi.
*   📚 **Interactive Field Guides**:
    *   **Disease Guide**: Crop-filtered directory of regional conditions (Late Blight, Powdery Mildew, Rust, etc.) with organic and biological treatment details.
    *   **Pest Guide**: Reference guide for insect biology, preventions, and control actions.
    *   **Post-Harvest Guide**: Dynamic compliance checklists (Curing, Sorting, Temperature Control, Transit checks) with progress persistence.
*   💾 **Session Logs**: Locally saves diagnostics and chatbot sessions, allowing supervisors to reload previous advisor advice or delete logs.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19 & Vite 8 (ESM setup), Axios
*   **Backend**: Node.js & Express.js MVC Architecture
*   **Styling**: Tailwind CSS v4 (Harmony green-accented theme)
*   **Animations**: Framer Motion 12 (Micro-animations and transitions)
*   **Icons**: Lucide React
*   **Integration**: Google Generative AI Node SDK (`@google/generative-ai`)
*   **Dev Utilities**: Nodemon, CORS, dotenv

---

## 🛡️ Data Privacy & Security Model

> [!NOTE]
> **Secure Credential Model**: As of Week 4, the developer Gemini API key is stored securely in the server-side environment variables (`/backend/.env`). The React frontend no longer exposes or stores developer keys in `localStorage`, satisfying security guidelines. All queries route through our secure Express gateway.

---

## 🤖 Responsible AI & Guardrails

To prevent hallucinations and minimize risk to local crops, the advisor runs under strict guardrails:
1.  **Extension Officer Disclaimer**: Every response includes a mandatory warning that advice should be verified with a licensed extension officer.
2.  **Zero-Guessing Uncertainty Protocol**: If the symptoms provided are insufficient to diagnose a disease with reasonable confidence, the system prompts for more parameters (crop age, symptoms, weather conditions) instead of recommending treatments.
3.  **Strict Organic Focus**: The advisory system is constrained to organic, biological, and non-chemical measures in accordance with the Collective's standards.

---

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm (or yarn)

### Installation & Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/aniketdobriyal/Krishi-AI-Advisor.git
    cd Krishi-AI-Advisor
    ```

2.  **Backend Setup**:
    Navigate to the backend directory:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file by copying the example template:
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and input your Gemini API key:
    ```env
    GEMINI_API_KEY=AI_zaSyYourKeyHere
    PORT=5000
    ```
    Start the backend server:
    ```bash
    npm run dev
    ```
    The server will start listening on [http://localhost:5000](http://localhost:5000).

3.  **Frontend Setup**:
    Open a new terminal window, and navigate to the frontend directory:
    ```bash
    cd frontend
    npm install
    ```
    Start the frontend dev server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Repository Structure

```
Krishi-AI-Advisor/
├── W4_APICollection_TBI-26100505.json            # Postman REST collection
├── W4_FrontendBackendConnection_TBI-26100505.pdf  # PDF Verification Report
├── backend/             # Express.js MVC backend
│   ├── .env.example     # Environment template
│   ├── .gitignore       # Exclusion rules (node_modules, .env)
│   ├── package.json     # Scripts and server dependencies
│   └── src/
│       ├── app.js       # Middleware & App configuration
│       ├── server.js    # Entrypoint to spawn HTTP server
│       ├── config/
│       │   ├── db.js    # In-memory crop advisory database state
│       │   └── gemini.js# Generative AI client initialization
│       ├── controllers/ # HTTP controller handlers
│       ├── services/    # Business services and AI/DB operations
│       ├── routes/      # REST endpoint mappings
│       └── middleware/  # Error handlers and guardrails
└── frontend/            # React Vite client code
    ├── .gitignore       # Client exclusion rules
    ├── package.json     # Client scripts and dependencies
    ├── vite.config.js   # Vite config
    └── src/
        ├── App.jsx      # UI shell, API connections and states
        ├── api.js       # Axios base instance configuration
        ├── main.jsx      # React entrypoint
        ├── data.js       # UI static texts and translations
        └── components/   # Modular dashboard views
```