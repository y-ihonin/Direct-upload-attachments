# Direct-upload-attachments

Full-stack app for direct file uploads: a **React** frontend and an **Express** backend.

## Project structure

```
.
├── frontend/          # React + TypeScript + Vite
├── backend/           # Express API server
├── package.json       # Root scripts (run both apps together)
└── README.md
```

## Tech stack

| Part     | Stack                                      |
| -------- | ------------------------------------------ |
| Frontend | React 19, TypeScript, Vite                 |
| Backend  | Express 5, CORS, dotenv, nodemon           |

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- npm

## Getting started

### 1. Install dependencies

From the project root:

```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Run the app

**Both frontend and backend** (recommended):

```bash
npm run dev
```

**Separately:**

```bash
# Backend — http://localhost:5000
npm run start:backend

# Frontend — http://localhost:5173
npm run start:frontend
```

## API

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| GET    | `/api/status`  | Health check; confirms the API is up |

Example response:

```json
{
  "message": "Backend is working, Express is ready to upload files!"
}
```

## Environment variables

Create a `.env` file in `backend/` if you need to override the default port:

```env
PORT=5000
```

The backend allows CORS from `http://localhost:5173` (Vite dev server).

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start frontend and backend     |
| `npm run start:frontend`| Start Vite dev server only     |
| `npm run start:backend` | Start Express server only      |

Frontend-only scripts (run from `frontend/`):

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Development server       |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## License

See [LICENSE](LICENSE).
