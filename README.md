# Study Mate

Study Mate is a two-part platform that helps students create study profiles, discover compatible study partners, and exchange collaboration requests. The project ships with a React/Vite frontend and an Express/Firebase powered backend that live on Vercel.

<p align="center">
  <img src="public/thumbnail.png" alt="Study Mate preview" width="600"/>
</p>

---

## ✨ High-level Features

### Frontend (Vite + React + Tailwind)
- Modern landing page with hero, partner highlights, and CTA.
- “Find Partners” page with search (by subject) and sorting (rating, name, experience level).
- Partner detail view that shows profile, availability, rating, and lets you send/cancel partner requests.
- Auth-aware navbar that shows login/register, or profile avatar with dropdown + logout.
- Profile management (view/update personal info, delete account).
- Create/Update Partner profile page (name, subject, level, study mode, availability, bio).
- Dark mode support via custom ThemeContext.

### Backend (Express + Firebase Admin + MongoDB)
- JWT + Firebase token based authentication and authorization.
- Full CRUD for users and partner profiles.
- Partner request workflow (send, cancel, list, automatic status updates).
- Request metadata stored in a dedicated `requests` collection.
- Vercel-friendly API with `/api/auth/*` and `/api/partners/*` routes.

---

## 🧱 Tech Stack

| Layer      | Tools                                                                   |
| ---------- | ----------------------------------------------------------------------- |
| Frontend   | Vite, React 18, React Router, Tailwind CSS, Lucide Icons, React Toastify |
| Backend    | Node.js, Express.js, MongoDB/Mongoose, Firebase Admin, JWT              |
| Hosting    | Vercel (frontend + backend)                                             |
| Auth       | Firebase Authentication (client) + custom JWT (server)                  |

---

## ⚙️ Prerequisites

- Node.js ≥ 18
- npm or yarn
- Firebase project (for client auth + server admin SDK)
- MongoDB URI (Atlas or self-hosted)

---

## 🚀 Getting Started

### 1. Clone both repos

```bash
git clone https://github.com/<you>/StudyMate-frontend.git
git clone https://github.com/<you>/StudyMate-backend.git
```



### 2. Install dependencies

```bash
# Frontend
cd StudyMate-frontend
npm install

# Backend
cd ../StudyMate-backend
npm install
```

### 4. Run locally

```bash
# Backend (http://localhost:5000)
npm run dev

# Frontend (http://localhost:5173)
npm run dev
```

### 5. Build for production

```bash
# Frontend bundle
cd StudyMate-frontend
npm run build

# Backend serverless build (Vercel)
cd ../StudyMate-backend
npm run build
```

---

## 🔐 Key API Endpoints (Backend)

| Method | Endpoint                               | Description                           |
| ------ | -------------------------------------- | ------------------------------------- |
| POST   | `/api/auth/register`                   | Register a user (Firebase + MongoDB)  |
| POST   | `/api/auth/login`                      | Login with Firebase token             |
| GET    | `/api/auth/me`                         | Get current user profile              |
| PUT    | `/api/auth/me`                         | Update current user profile           |
| DELETE | `/api/auth/me`                         | Delete user + associated partner      |
| POST   | `/api/auth/request/send/:partnerId`    | Send partner request                  |
| DELETE | `/api/auth/request/cancel/:partnerId`  | Cancel partner request                |
| GET    | `/api/auth/requests?type=sent|received`| List requests                         |
| GET    | `/api/partners`                        | List partner cards                    |
| GET    | `/api/partners/:id`                    | Partner detail                        |
| POST   | `/api/partners`                        | Create partner profile                |
| PUT    | `/api/partners/:id`                    | Update partner profile                |

> Error responses follow `{ "success": false, "msg": "Reason" }` format with standard HTTP status codes.

---

## 🧩 Frontend Architecture Highlights

- `src/context/AuthContext.jsx`: Wraps Firebase auth + backend JWT, exposes helper methods (`login`, `register`, `sendRequest`, etc.).
- `src/context/ThemeContext.jsx`: Handles light/dark mode with persistence.
- `src/services/api.js`: Axios wrapper with base URL detection, auth header injection, and toast-based error handling.
- `src/pages/FindPartners/FindPartners.jsx`: Fetch + local filter/sort logic.
- `src/components/PartnerDetail/PartnerDetail.jsx`: Shows profile detail, manages request state.
- `src/pages/MyProfile/MyProfile.jsx`: Editable profile form, pre-filled with merged Firebase + MongoDB data.

---

## 🧪 Suggested Testing Checklist

### Frontend
- [ ] Authentication redirection (visit protected routes when logged out).
- [ ] Partner search by subject and sorting by experience level.
- [ ] Navbar dropdown (profile + logout) vs login/register buttons.
- [ ] Create partner profile, then update and verify fields.
- [ ] Send & cancel partner request from detail view.

### Backend
- [ ] Registration + login + token reuse.
- [ ] `send` + `cancel` endpoint logs and MongoDB `requests` entries.
- [ ] Partner CRUD endpoints (including authorization guards).
- [ ] Rate limiting / error responses (optional).

---

## 📦 Deployment Notes

- Both frontend and backend are Vercel-ready.
- Backend expects `/api` prefix in Vercel routing (e.g., `vercel.json` should rewrite `/api/*` to server entry).
- Frontend uses `VITE_API_BASE_URL`; set it to the deployed backend origin (no trailing slash).

---

## 🧭 Roadmap / Ideas

- Realtime presence indicator via Firestore / WebSocket.
- Accept/Reject partner requests and integrate a messaging room.
- Email notifications for received requests.
- Advanced filters (availability window, location radius).
- Unit/integration tests (React Testing Library, Vitest, Jest).

---

## 🤝 Contributing

1. Fork the repo(s)
2. Create a feature branch `git checkout -b feature/amazing`
3. Commit your changes `git commit -m "feat: add amazing feature"`
4. Push to branch `git push origin feature/amazing`
5. Open a Pull Request

---

## 📄 License

MIT © 2025 Study Mate Team

---

_“শেখার সেরা উপায় হলো একসাথে শেখা.”_

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
