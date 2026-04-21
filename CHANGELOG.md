# Changelog

## 2026-04-21 — Tahsina Mahdiah

- Server auth APIs implemented (register, login, me) with JWT-based authentication.
- `User.role` defaults to `job_seeker` so registration works without the client supplying a role. _Note: to be discussed further._
- Signup and Login frontend pages implemented and wired to the auth APIs.
- Styling added for the Signup and Login pages via `client/src/css/auth.css`.
- Auth API documentation added under `docs/auth-api.md`.