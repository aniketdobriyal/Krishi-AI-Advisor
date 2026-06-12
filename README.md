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

*   **Core**: React 19 & Vite 8 (ESM setup)
*   **Styling**: Tailwind CSS v4 (Harmony green-accented SaaS theme)
*   **Animations**: Framer Motion 12 (Micro-animations and layout transitions)
*   **Icons**: Lucide React
*   **Integration**: Client-side Gemini API Integration (`@google/generative-ai`)

---

## 🛡️ Data Privacy & Security Model

> [!IMPORTANT]
> **Credential Storage Policy**: For demonstration purposes, the Gemini developer API key is stored locally inside the user's browser (`localStorage`). No conversation transcripts, personal details, or API keys are transmitted to any external backend databases. 
> 
> *For production deployments, API queries must route through a secure backend service where credentials are stored safely in server-side environment variables instead of exposing them to the client.*

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

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/aniketdobriyal/Krishi-AI-Advisor.git
    cd Krishi-AI-Advisor
    ```

2.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

To build the static application assets:
```bash
npm run build
```
Vite will package compilation assets into a single clean JS bundle and CSS file under the `/dist` directory.

---

## 📁 Repository Structure

```
Krishi-AI-Advisor/
├── .gitignore            # Git exclusion rules
├── README.md             # Project documentation (this file)
└── frontend/             # React Vite client code
    ├── .gitignore        # Client exclusion rules
    ├── index.html        # Main HTML entry
    ├── package.json      # Dependencies and scripts
    ├── vite.config.js    # Vite configuration
    ├── public/           # Static icons and assets
    └── src/
        ├── App.jsx       # Layout shell and core state router
        ├── index.css     # Tailwind imports and animations
        ├── main.jsx      # React entrypoint
        ├── data.js       # Localized crop, disease, and post-harvest database
        ├── gemini.js     # Gemini API handler & offline fallback parser
        └── components/   # Modular dashboard views
            ├── DashboardOverview.jsx   # Stats cards, warnings & bulletins
            ├── ChatAssistant.jsx       # Chat window, Voice & TTS synthesis
            ├── Guides.jsx              # Disease details modals & checklists
            ├── ChatHistoryView.jsx     # Saved conversation lists
            └── SettingsView.jsx        # Credentials and temperature adjustments
```