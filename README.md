# URL Shortener Application

The URL shortener application was built with:

- **Frontend:** Next.js + React + TypeScript
- **Backend:** NestJS + TypeScript + Prisma
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose

Users can register, log in, create short links with custom slugs, track visits, and manage their URLs via a clean web interface.

---

## Project structure

```
url-shortener/
├── client-app/ # Frontend (Next.js + MUI)
├── server/ # Backend API (NestJS + Prisma)
├── docker-compose.yml
└── README.md
```

## How to run the app (Dockerized)

Make sure Docker is installed, then from the root folder:

```bash
docker-compose up --build
```

This will spin up:

| Service  | URL                                            | Description             |
| -------- | ---------------------------------------------- | ----------------------- |
| Frontend | [http://localhost:3001](http://localhost:3001) | React app (client-app)  |
| Backend  | [http://localhost:3000](http://localhost:3000) | NestJS API (server)     |
| Database | `postgres\://localhost:5432`                   | PostgreSQL 14 container |

---

> For further information, take a look at the `README.md` files for both `client-app` and `server`.

Made with ❤️ by Pedro Sierra.