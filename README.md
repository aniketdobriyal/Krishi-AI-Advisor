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
*   MongoDB Instance (Local running at `mongodb://127.0.0.1:27017` or MongoDB Atlas Cluster)

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
    Open the `.env` file and input your Gemini API key and MongoDB URI connection string:
    ```env
    GEMINI_API_KEY=AI_zaSyYourKeyHere
    MONGO_URI=mongodb://127.0.0.1:27017/krishi-ai-advisor
    PORT=5000
    ```
    Start the backend server:
    ```bash
    npm run dev
    ```
    The server will connect to MongoDB, automatically seed default collections (Crops, Diseases, Pests, PostHarvest Guides, default History) if empty, and start listening on [http://localhost:5000](http://localhost:5000).

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

## 🗄️ Database Integration & Choice (Week 5)

### Database Choice: MongoDB Atlas
MongoDB Atlas was selected for the **Krishi AI Advisor** for several reasons:
- **Flexible Document Model**: Allows seamless storage of complex and nested structures such as advisory message histories and embedded dialog details without rigid SQL joins.
- **Mongoose ODM Integration**: Provides strong schema validation, hooks, and clean MVC separation for data structures in Node.js.
- **Reliable Persistence**: Replaces in-memory storage arrays so supervisor data survives server reloads and browser refreshes.
- **Free Tier Availability**: Provides scalable, zero-cost cloud databases perfect for field testing and remote block supervisor deployments.

### Database Setup Instructions
1. **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register.
2. **Create Cluster**: Create a free-tier shared cluster (M0) in your preferred region.
3. **Database User**: Navigate to *Database Access* and create a user with read/write privileges.
4. **Network Access**: Add IP `0.0.0.0/0` (allow access from anywhere) or whitelist your server's current IP.
5. **Get URI**: Click *Connect*, choose *Drivers (Node.js)*, copy the connection string.
6. **Configure ENV**: Paste it in `/backend/.env` under the variable `MONGO_URI` (replacing password and dbname placeholders).

---

## 🔌 REST API Endpoints

The Express backend exposes the following REST APIs under the `/api` prefix (all persistence is now database-backed via Mongoose):

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/crops` | Retrieves crops from MongoDB | `200` |
| **GET** | `/api/diseases` | Retrieves all plant diseases from MongoDB | `200` |
| **GET** | `/api/diseases/:id` | Retrieves details of a specific disease by ID | `200`, `404` |
| **GET** | `/api/pests` | Retrieves all pests from MongoDB | `200` |
| **GET** | `/api/post-harvest` | Retrieves post-harvest guides from MongoDB | `200` |
| **POST** | `/api/chat` | AI Advisor prompt (queries Gemini with DB context, fallback offline) | `200`, `400` |
| **GET** | `/api/history` | Retrieves saved chat sessions from MongoDB | `200` |
| **POST** | `/api/history` | Saves or updates a chat session in MongoDB | `200`, `201`, `400` |
| **DELETE** | `/api/history/:id` | Deletes a saved chat session from MongoDB | `204`, `404` |
| **GET** | `/api/search?q=` | Case-insensitive regex search across DB collections | `200`, `400` |
| **GET** | `/api/config` | Returns whether the Gemini API key is configured | `200` |

---

## 🗺️ Schema Diagram

Here is the professional entity relationship/schema diagram showing all collections, fields, and relationships designed and stored in MongoDB Atlas:

![Krishi AI Advisor Database Schema Diagram](./W5_SchemaDiagram_TBI-26100505.png)

The schema diagram is also exported to the root directory as:
- Portable Document Format: [W5_SchemaDiagram_TBI-26100505.pdf](./W5_SchemaDiagram_TBI-26100505.pdf)
- High-Resolution Image: [W5_SchemaDiagram_TBI-26100505.png](./W5_SchemaDiagram_TBI-26100505.png)

---

## 📁 Repository Structure

```
Krishi-AI-Advisor/
├── W4_APICollection_TBI-26100505.json            # Postman REST collection
├── W4_FrontendBackendConnection_TBI-26100505.pdf  # Week 4 PDF Verification Report
├── W5_SchemaDiagram_TBI-26100505.pdf             # Week 5 Database Schema (PDF)
├── W5_SchemaDiagram_TBI-26100505.png             # Week 5 Database Schema (PNG)
├── W5_CRUDVerification_TBI-26100505.pdf          # Week 5 CRUD Verification Report (PDF)
├── backend/             # Express.js MVC backend
│   ├── .env.example     # Environment template
│   ├── .gitignore       # Exclusion rules (node_modules, .env)
│   ├── package.json     # Scripts and server dependencies
│   └── src/
│       ├── app.js       # Middleware & App configuration
│       ├── server.js    # Entrypoint, DB connection and startup
│       ├── config/
│       │   ├── db.js    # Seed database contents
│       │   ├── mongoose.js # MongoDB connection module
│       │   ├── seed.js  # Seeder function to auto-populate collections
│       │   └── gemini.js# Generative AI client initialization
│       ├── models/      # Mongoose Schemas and Models (Crop, Disease, Pest, PostHarvest, History)
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