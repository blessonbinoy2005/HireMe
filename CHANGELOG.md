# Changelog

## 2026-04-25, Tahsina Mahdiah

- Added the job seeker profile page at /profile.
- Added GET and PUT /api/profile, both behind verifyToken.
- Expanded JobSeekerProfile: headline, currentStatus (enum), country, education[], experience[]. Dropped employmentStatus.
- Profile page has six sections: Account, About, Location, Contact & Resume, Education, Experience. Each section edits independently and saves via the same PUT endpoint.
- Education and Experience are repeatable lists with add/remove and a "current" toggle that disables the end date.
- Country picker uses a dropdown of ISO countries.
- Date fields use the browser's native date picker.
- Added a shared useProfileSave hook so the cards share the PUT logic.

## 2026-04-21, Tahsina Mahdiah

- Added auth APIs: register, login, me. JWT auth.
- User.role defaults to job_seeker so registration doesn't fail without one. To be discussed.
- Built Signup and Login pages, wired to the APIs.
- Styled the auth pages (auth.css).
- Wrote auth API docs in docs/auth-api.md.
- Added a shared Navbar via MainLayout. No need to add it on each page.
- Updated Navbar styling to match the prototype, added a Tracker link.
- Moved shared tokens and base styles into main.css. Cleaned up font issues in auth.css.
- Added AuthContext so login/logout updates the UI right away.
- Navbar shows a profile chip + dropdown when signed in instead of Log in / Sign up.
