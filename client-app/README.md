# URL Shortener - Frontend App

This is the **React frontend** for the URL Shortener application built using **Next.js** and **TypeScript**.  
It allows users to register, log in, shorten URLs, manage slugs, view visit stats, and track clicks — all via a user-friendly interface.

---

## Features

- User registration and login (JWT-based)
- Submit long URLs with optional custom slugs
- Copy shortened URLs to clipboard
- Update or delete existing shortened links
- View visit count + last visit date
- Paginated dashboard with top URLs
- Validation: URLs, slugs, emails, passwords
- Styled with **Material UI** (MUI)
- Session persistence via `localStorage`
- Redirect unauthenticated users to login
- Client-side form validation
- Smooth error and toast handling
- 404 page for unmatched routes
- Dynamic redirection via `/r/[slug]`

---

## Core Libraries & Tools

| Library                 | Purpose                       |
| ----------------------- | ----------------------------- |
| **Next.js**             | React framework, routing      |
| **React**               | UI library                    |
| **TypeScript**          | Type safety                   |
| **Axios**               | HTTP requests to backend      |
| **Material UI**         | Component styling             |
| **jwt-decode**          | Parse JWT tokens              |
| **localStorage**        | Persist auth session          |
| **@mui/lab**            | LoadingButton for UX feedback |

---

## Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev
```

## Environment configuration

The app expects an `.env.local` file with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

The variable `NEXT_PUBLIC_API_URL` should be the URL where the `server` API is running.


## Scaffolding structure

```
src/
├── components/        // Reusable UI: Layout, Header, Toast, Cards
├── context/           // AuthContext for login/register/session
├── lib/               // Shared logic (validation, API wrapper)
├── pages/             // Next.js routes: login, register, dashboard, etc.
└── services/          // API calls
```