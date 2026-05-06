# How to Run HireMe

## Prerequisites

- **Node.js** (v18 or newer recommended) — [download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** — for cloning the repo
- A **MongoDB** database. Two options:
  - A free MongoDB Atlas cluster (cloud) — easiest
  - A local `mongod` install (for a self-hosted setup)

---

## 1. Clone the repo

```bash
git clone https://github.com/blessonbinoy2005/HireMe.git
cd HireMe
```

---

## 2. Install dependencies

The project has two parts — `client/` (React frontend) and `server/` (Express backend). Each has its own `package.json`.

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

## 3. Set up environment variables

The backend requires a `.env` file in `server/` with three values:

```bash
PORT=9000
MONGO_URI=<MongoDB connection string>
JWT_SECRET=<long random string>
JWT_EXPIRES_IN=7d
```

### How to fill them in

- **`PORT`** — leave at `9000` unless that port is in use.
- **`MONGO_URI`** — the MongoDB connection string.
  - For MongoDB Atlas: copy from the cluster's "Connect" → "Drivers" page. Looks like `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/hiremeDB?...`
  - For local Mongo: `mongodb://localhost:27017/hiremeDB`
- **`JWT_SECRET`** — any long random string. Generate one with `openssl rand -base64 32`. Keep it private.
- **`JWT_EXPIRES_IN`** — how long login tokens stay valid. `7d` (7 days) is fine.

Create the file:

```bash
cd server
touch .env
# then open .env in an editor and paste in the values above
```

---

## 4. Run the project

Open **two terminals** — one for the backend, one for the frontend.

### Terminal 1: Backend

```bash
cd server
npm run dev
```

The terminal should show:
```
Server running on port 9000
MongoDB connected
```

If the server logs `Failed to connect to MongoDB`, check the `MONGO_URI` value.

### Terminal 2: Frontend

```bash
cd client
npm start
```

The browser should open automatically to `http://localhost:3000`. Otherwise, visit it manually.

---

## 5. Known issues & troubleshooting

### `Failed to connect to MongoDB` on backend start
The `MONGO_URI` is invalid or unreachable. Verify the connection string. For MongoDB Atlas, confirm the current IP is whitelisted under Network Access.

### `EADDRINUSE: address already in use :::9000`
Another process is bound to port 9000. Either kill the existing process — `lsof -i :9000` to find the PID, then `kill <pid>` — or change `PORT` in `server/.env`.

### Frontend loads but every API request returns 401
The JWT in `localStorage` was issued under a different secret and is no longer valid. Log out and log back in to issue a new token.
