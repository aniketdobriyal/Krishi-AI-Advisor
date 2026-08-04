# API Reference – Krishi AI Advisor 🌾

Base URL (Local): `http://localhost:5000/api`  
Base URL (Production): `https://krishi-ai-advisor.onrender.com/api`

---

## 🔐 Authentication Endpoints

### 1. Register User
- **POST** `/auth/register`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Rajesh Kumar",
    "email": "rajesh@mandakini.org",
    "password": "Password123!",
    "role": "supervisor"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "66a8b...",
      "name": "Rajesh Kumar",
      "email": "rajesh@mandakini.org",
      "role": "supervisor"
    }
  }
  ```

### 2. Login User
- **POST** `/auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "rajesh@mandakini.org",
    "password": "Password123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "66a8b...",
      "name": "Rajesh Kumar",
      "email": "rajesh@mandakini.org",
      "role": "supervisor"
    }
  }
  ```

### 3. Get Authenticated User Profile
- **GET** `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "id": "66a8b...",
    "name": "Rajesh Kumar",
    "email": "rajesh@mandakini.org",
    "role": "supervisor"
  }
  ```

---

## 🌾 Core Data Endpoints

### 4. Get All Crops
- **GET** `/crops`
- **Auth Required**: No
- **Response (200 OK)**: Array of Crop objects.

### 5. Get Diseases Directory
- **GET** `/diseases`
- **Auth Required**: No
- **Query Params**: `?cropId=tomato` (optional filter)
- **Response (200 OK)**: Array of Disease objects.

### 6. Get Pest Directory
- **GET** `/pests`
- **Auth Required**: No
- **Response (200 OK)**: Array of Pest objects.

### 7. Get Post-Harvest Guides
- **GET** `/post-harvest`
- **Auth Required**: No
- **Response (200 OK)**: Array of Post-Harvest Guide objects.

---

## 💬 AI Advisory & History Endpoints

### 8. Submit Advisory Query
- **POST** `/chat`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**:
  ```json
  {
    "prompt": "My tomato plants have black spots on lower leaves",
    "temperature": 0.2
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "response": {
      "problem": "Late Blight",
      "causes": "High humidity...",
      "actions": "Apply Trichoderma viride or Copper Oxychloride...",
      "precautions": "Avoid overhead watering...",
      "disclaimer": "Verify with local extension officer."
    },
    "isOffline": false,
    "modelUsed": "Gemini 3.6 Flash"
  }
  ```

### 9. Get User Chat Sessions
- **GET** `/history`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Array of user's saved diagnostic chat sessions.

### 10. Save/Update Chat Session
- **POST** `/history`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Request Body**: Chat session object containing title and messages.
- **Response (200 OK / 201 Created)**: Saved Chat Session object.

### 11. Delete Chat Session
- **DELETE** `/history/:id`
- **Auth Required**: Yes (`Authorization: Bearer <token>`)
- **Response (204 No Content)**

---

## 🔍 Utilities & Monitoring

### 12. Global Search
- **GET** `/search?q=blight`
- **Auth Required**: No
- **Response (200 OK)**: Search results grouped by category.

### 13. Weather Risk Alerts
- **GET** `/weather`
- **Auth Required**: No
- **Response (200 OK)**: Current weather warnings and agricultural advice.

### 14. Configuration Status
- **GET** `/config`
- **Auth Required**: No
- **Response (200 OK)**:
  ```json
  {
    "hasGeminiKey": true
  }
  ```
