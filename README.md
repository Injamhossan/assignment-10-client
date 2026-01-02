# Study Mate

Study Mate is a collaborative platform designed to help students discover compatible study partners, manage learning profiles, and track their networking activity. This project features a polished, premium React frontend and a robust Express/MongoDB backend.

<p align="center">
  <img src="public/thumbnail.png" alt="Study Mate preview" width="800"/>
</p>

## 🌐 Live Demo
[https://studymate-ih.netlify.app/](https://studymate-ih.netlify.app/)

---

## ✨ Key Features

### 🎨 Frontend (Vite + React + Tailwind + Recharts)
- **Premium UI/UX**: A modern, responsive design system with custom theme tokens, refined typography (`Outfit` & `Inter`), and glassmorphism effects.
- **Real-time Dashboard**: Interactive **Area Charts** visualizing profile activity (Views, Requests) and live statistics cards.
- **Smart Search**: "Find Partners" page with advanced filtering by subject and sorting by rating/experience.
- **Partner Management**: Detailed partner profiles with capabilities to send, view, and cancel connection requests instantly.
- **Authentication**: Secure Firebase integration (Google + Email/Password) with persistent sessions and protected routes.
- **Dark Mode**: Fully integrated dark/light theme switching that persists across sessions.
- **Interactive Components**: Custom carousels, testimonials, and process flow visualizations.

### 🛠 Backend (Express + MongoDB)
- **Secure API**: JWT-based authentication middleware ensuring data privacy.
- **Request Workflow**: Dedicated endpoints for sending, canceling, and retrieving connection requests.
- **Scalable Data**: MongoDB schemas for Users, Partners, and Requests with efficient querying.
- **Vercel Ready**: Optimized for serverless deployment on Vercel.

---

## 🧱 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide React, Framer Motion (ready), React Toastify |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, Firebase Admin SDK |
| **Authentication** | Firebase Client SDK (Frontend) + Custom JWT Verification (Backend) |
| **Deployment** | Netlify (Frontend) + Vercel (Backend) |

---

## 🚀 Getting Started

### 1. Clone the repositories
```bash
git clone https://github.com/Injamhossan/assignment-10-client.git
git clone https://github.com/Injamhossan/assignment-10-server.git
```

### 2. Install dependencies
```bash
# Frontend
cd assignment-10-client
npm install

# Backend
cd ../assignment-10-server
npm install
```

### 3. Environment Setup
Create `.env.local` in `assignment-10-client` and `.env` in `assignment-10-server` with the following variables:

**Client (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_apiKey=YOUR_FIREBASE_API_KEY
VITE_authDomain=YOUR_FIREBASE_AUTH_DOMAIN
VITE_projectId=YOUR_FIREBASE_PROJECT_ID
...
```

**Server (.env)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run locally
```bash
# Backend (http://localhost:5000)
npm run dev

# Frontend (http://localhost:5173)
npm run dev
```

---

## 🔐 API Reference Highlights

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | | |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get current user's full profile |
| **Partners** | | |
| `GET` | `/api/partners` | Get all partners (supports sorting/filtering) |
| `GET` | `/api/partners/:id` | Get specific partner details |
| `POST` | `/api/partners` | Create a new partner profile |
| **Requests** | | |
| `POST` | `/api/auth/request/send/:partnerId` | Send a connection request |
| `DELETE` | `/api/auth/request/cancel/:partnerId` | Cancel a sent request |

---

## � License
MIT © 2025 Study Mate Team

_“The best way to learn is to learn together.”_
