# HireMe API

Base URL: `http://localhost:9000`
All endpoints accept and return JSON.

## Response envelope

Every response follows a consistent shape:

```json
// Success
{
  "success": true,
  "data": { "...": "..." }
}

// Error
{
  "success": false,
  "error": { "message": "..." }
}
```

HTTP status codes still reflect the outcome (2xx, 4xx, 5xx). Clients should
branch on `success` and read either `data` or `error.message`.

## Authentication

Protected endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are issued by `POST /api/auth/register` and `POST /api/auth/login` and
expire after `JWT_EXPIRES_IN` (default `7d`). Missing or invalid tokens return
`401` with the envelope error shape.

---

## Endpoints

### `GET /`

Health check. Returns the plain string `Backend is running` (not wrapped in the
envelope — this route exists only to verify the server is up).

---

### `POST /api/auth/register`

Create a new account. The new user's `role` defaults to `job_seeker`.

**Request body**

| Field             | Type   | Required | Notes                              |
| ----------------- | ------ | -------- | ---------------------------------- |
| `firstName`       | string | yes      |                                    |
| `lastName`        | string | yes      |                                    |
| `email`           | string | yes      | Stored lowercased; must be unique. |
| `password`        | string | yes      | Minimum 8 characters.              |
| `confirmPassword` | string | no       | If provided, must equal `password`.|

**Success — `201 Created`**

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "…",
      "firstName": "Ada",
      "lastName": "Lovelace",
      "email": "ada@example.com",
      "role": "job_seeker"
    }
  }
}
```

**Errors**

| Status | `error.message`                                |
| ------ | ---------------------------------------------- |
| 400    | `All fields are required.`                     |
| 400    | `Password must be at least 8 characters.`      |
| 400    | `Passwords do not match.`                      |
| 409    | `An account with that email already exists.`  |
| 500    | `Server error creating account.`               |

---

### `POST /api/auth/login`

Exchange credentials for a JWT.

**Request body**

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | yes      |
| `password` | string | yes      |

**Success — `200 OK`**

```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "…",
      "firstName": "Ada",
      "lastName": "Lovelace",
      "email": "ada@example.com",
      "role": "job_seeker"
    }
  }
}
```

**Errors**

| Status | `error.message`                        |
| ------ | -------------------------------------- |
| 400    | `Email and password are required.`     |
| 401    | `Invalid email or password.`           |
| 500    | `Server error during login.`           |

---

### `GET /api/auth/me`

Return the authenticated user's profile. **Requires `Authorization` header.**

**Success — `200 OK`**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "…",
      "firstName": "Ada",
      "lastName": "Lovelace",
      "email": "ada@example.com",
      "role": "job_seeker"
    }
  }
}
```

**Errors**

| Status | `error.message`              |
| ------ | ---------------------------- |
| 401    | `Missing auth token.`        |
| 401    | `Invalid or expired token.`  |
| 404    | `User not found.`            |
| 500    | `Server error.`              |

---

## User roles

The `role` field is one of:

- `job_seeker` (default for new sign-ups)
- `recruiter`
- `career_advisor`
- `system_admin`

Role is included in JWT claims and in every `user` object returned by the API.

---

## API structure

Each feature is split across three layers so responsibilities stay separate and
routes stay tiny. New features should follow the same layout.

```
server/
├── server.js                      # app setup + route mounting
├── routes/<feature>Routes.js      # URL → handler wiring
├── controllers/<feature>Controller.js  # request/response logic
├── middleware/                    # cross-cutting concerns (auth, etc.)
└── models/<Model>.js              # Mongoose schemas
```

### 1. Route file — declares the URLs

A route file only maps HTTP paths to controller functions and decides which
middleware runs first. It contains no business logic.

```js
// server/routes/authRoutes.js
const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);   // protected

module.exports = router;
```

It's then mounted in `server.js`:

```js
app.use("/api/auth", authRoutes);
```

### 2. Controller — does the work and returns the envelope

Controllers read `req`, talk to models, and respond using the envelope helpers.
Every success uses `ok(data)`, every failure uses `fail(message)`:

```js
function ok(data)        { return { success: true, data }; }
function fail(message)   { return { success: false, error: { message } }; }

async function login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json(fail("Email and password are required."));
    }
    // ...verify user + password...
    return res.json(ok({ token, user: publicUser(user) }));
}
```

Rules of thumb for controllers:

- Validate inputs up front and return `400` with `fail(...)` on bad input.
- Wrap the body in `try/catch` and return `500` with `fail("Server error …")`
  on unexpected errors.
- Never return raw Mongoose documents — map through a `publicUser`-style
  helper so fields like `passwordHash` never leak.

### 3. Middleware — protecting a route with `verifyToken`

Middleware is a function `(req, res, next) => …` that runs **before** a
controller. Think of it like a Python decorator: drop it into the route
definition to require a valid JWT on that URL.

```js
// server/middleware/authMiddleware.js
function verifyToken(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        return res.status(401).json({ success: false, error: { message: "Missing auth token." } });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId   = payload.sub;    // available to downstream handlers
        req.userRole = payload.role;
        next();
    } catch {
        return res.status(401).json({ success: false, error: { message: "Invalid or expired token." } });
    }
}
```

#### Step-by-step: protecting a route and showing a user's profile

Follow these steps to add any protected endpoint. We'll use the existing
`GET /api/auth/me` (show the signed-in user's profile) as the worked example.

##### Step 1 — Write the controller (reads `req.userId`, never trusts client input)

The handler assumes `verifyToken` has already run, so it reads the caller's
id from `req.userId` rather than from the URL or body. It loads the user from
the database and returns a sanitized version through the `publicUser` helper.

```js
// server/controllers/authController.js
function publicUser(user) {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
    };
}

async function me(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json(fail("User not found."));
        return res.json(ok({ user: publicUser(user) }));
    } catch (err) {
        console.error("me error:", err);
        return res.status(500).json(fail("Server error."));
    }
}

module.exports = { /* ...others..., */ me };
```

##### Step 2 — Import `verifyToken` in the route file

```js
// server/routes/authRoutes.js
const { verifyToken } = require("../middleware/authMiddleware");
const { me } = require("../controllers/authController");
```

##### Step 3 — Put `verifyToken` **between the path and the handler**

Order matters. `verifyToken` must appear before the controller in the
argument list — Express runs middleware left to right.

```js
router.post("/register", register);         // public
router.post("/login",    login);            // public
router.get("/me",        verifyToken, me);  // protected
```

That's it on the server — any route declared this way now requires a valid
JWT. The middleware handles the `401`s automatically; the controller only
runs for authenticated callers.

##### Step 4 — Call it from the frontend with the `Authorization` header

```js
const token = localStorage.getItem("token");

const res = await axios.get(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
});

const { user } = res.data.data;   // { id, firstName, lastName, email, role }
```

##### Step 5 — Handle the `401` case

If the token is missing, expired, or tampered with, the server responds:

```json
{ "success": false, "error": { "message": "Invalid or expired token." } }
```

The client should surface `err.response?.data?.error?.message` and send the
user back to `/login`.

#### Rules of thumb for every protected route

- **Derive the user from the token, not from client input** — use
  `req.userId`, never a body/query parameter, or any logged-in user could
  read someone else's data.
- **Look up fresh data every call** — the JWT carries an id, but the database
  is the source of truth.
- **Never return the raw Mongoose document** — route it through a helper like
  `publicUser` so `passwordHash` and other internals stay server-side.

### 4. Adding a new feature — the checklist

1. `models/<Model>.js` — define the Mongoose schema.
2. `controllers/<feature>Controller.js` — implement handlers using `ok` /
   `fail`, read `req.userId` when auth is required.
3. `routes/<feature>Routes.js` — map URLs to handlers, add `verifyToken` (and
   any role check) where appropriate.
4. `server.js` — `app.use("/api/<feature>", <feature>Routes)`.
5. Document the new endpoints in `docs/` following the same sections used
   above (request body, success example, error table).
