# NexusCRM
A lightweight CRM for managing clients, deals, and tasks.

NexusCRM is a customer relationship management application built with Next.js. It provides a focused interface for tracking clients, deals, tasks, and user settings, backed by a Prisma-powered database and NextAuth-based authentication.

Use it as a starter CRM, an internal tool, or a foundation for more advanced sales and relationship management workflows.

## Features

- **Authentication & Users**  
  - Email/password login via NextAuth credentials provider  
  - User profile settings (name, timezone, currency)

- **Clients Management**  
  - Create, view, update, and delete clients  
  - Store company, contact details, and status

- **Deals Pipeline**  
  - Track deals linked to clients  
  - Store value, currency, stage, probability, and expected close date

- **Tasks & Activities**  
  - Create and manage tasks related to clients and deals  
  - Due dates, priority, and status tracking

- **Search**  
  - Global search across clients, deals, and tasks

- **Modern UI**  
  - Next.js App Router  
  - Tailwind CSS-based styling  
  - Drag-and-drop utilities via `@dnd-kit` (where used in the UI)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript / React 19
- **Auth:** NextAuth (credentials provider)
- **ORM:** Prisma
- **Database:** Any Prisma-supported SQL database (e.g., MySQL/PostgreSQL) via `DATABASE_URL`
- **Styling:** Tailwind CSS
- **Validation:** Zod
- **Icons & UI:** lucide-react, clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm (or another package manager such as pnpm, yarn, or bun)
- A SQL database (e.g., MySQL/PostgreSQL) with a connection string
- Prisma CLI (installed via `devDependencies`)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/clow99/NexusCRM.git
   cd NexusCRM
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (see [Environment Variables](#environment-variables)).

4. Set up the database (see [Database Setup (Prisma)](#database-setup-prisma)).

### Local Development

Run the development server:

```bash
npm run dev
```

Then open:

- App: http://localhost:3000

You can start editing the main page by modifying `src/app/page.js` (or other routes under `src/app`). The app will auto-reload as you make changes.

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Prisma database connection string
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DB_NAME"

# Optional: NextAuth configuration (example placeholders)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Add any provider-specific or app-specific variables here
# SOME_OTHER_ENV="value"
```

- Do not commit `.env` to version control.
- Ensure `DATABASE_URL` matches your local or remote database.

### Database Setup (Prisma)

1. Generate and sync the database schema:

   ```bash
   npx prisma db push
   ```

2. (Optional) Open Prisma Studio to inspect data:

   ```bash
   npx prisma studio
   ```

If you change the Prisma schema in `prisma/schema.prisma`, re-run `npx prisma db push`.

## Mock Mode

This project does not include a dedicated mock mode by default.  
If you need fixtures or mock data:

- Add seed scripts under `prisma/` (e.g., `prisma/seed.ts`) and run them manually.
- Or create mock API handlers under `src/app/api/` for development-only endpoints.

## Project Structure

High-level structure (paths may be abbreviated):

```text
NexusCRM/
├─ prisma/
│  ├─ schema.prisma          # Prisma data models
│  └─ (other Prisma config)
├─ public/                   # Static assets
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/            # NextAuth + signup routes
│  │  │  ├─ clients/         # /api/clients routes
│  │  │  ├─ deals/           # /api/deals routes
│  │  │  ├─ tasks/           # /api/tasks routes
│  │  │  ├─ search/          # /api/search route
│  │  │  └─ settings/        # /api/settings route
│  │  └─ (UI routes/pages)
│  ├─ lib/
│  │  ├─ auth.js             # NextAuth configuration
│  │  └─ prisma.js           # Prisma client instance
│  └─ (components, utils, etc.)
├─ prisma.config.ts
├─ next.config.mjs
├─ package.json
└─ README.md
```

## Routes

High-level application routes (UI) will depend on the `src/app` structure.  
Common examples (placeholders):

| Route           | Description                    | Auth Required |
|----------------|--------------------------------|--------------|
| `/`            | Dashboard / overview           | Yes          |
| `/clients`     | Clients list and details       | Yes          |
| `/deals`       | Deals pipeline                 | Yes          |
| `/tasks`       | Task list                      | Yes          |
| `/settings`    | User profile & preferences     | Yes          |
| `/auth/login`  | Login page                     | No           |
| `/auth/signup` | Signup page                    | No           |

Adjust these based on your actual `src/app` routes.

## API Endpoints

All endpoints are under `/api` and typically require authentication (except where noted).

### Auth

| Endpoint                 | Method | Description                                           | Auth |
|--------------------------|--------|-------------------------------------------------------|------|
| `/api/auth/[...nextauth]` | GET    | NextAuth handler (sign-in, sign-out, session, etc.)  | Mixed (handled by NextAuth) |
| `/api/auth/signup`      | POST   | Create a new user account                            | No (usually) |

### Clients

| Endpoint           | Method  | Description                                | Auth |
|--------------------|---------|--------------------------------------------|------|
| `/api/clients`     | GET     | List clients for the authenticated user    | Yes  |
| `/api/clients`     | POST    | Create a new client                        | Yes  |
| `/api/clients/:id` | GET     | Get a specific client by ID                | Yes  |
| `/api/clients/:id` | PATCH   | Update a specific client by ID             | Yes  |
| `/api/clients/:id` | DELETE  | Delete a specific client by ID             | Yes  |

### Deals

| Endpoint        | Method | Description                            | Auth |
|-----------------|--------|----------------------------------------|------|
| `/api/deals`    | GET    | List deals for the authenticated user  | Yes  |
| `/api/deals`    | POST   | Create a new deal                      | Yes  |
| `/api/deals/:id`| PATCH  | Update a specific deal by ID           | Yes  |
| `/api/deals/:id`| DELETE | Delete a specific deal by ID           | Yes  |

### Tasks

| Endpoint       | Method | Description                            | Auth |
|----------------|--------|----------------------------------------|------|
| `/api/tasks`   | GET    | List tasks for the authenticated user  | Yes  |
| `/api/tasks`   | POST   | Create a new task                      | Yes  |

### Search & Settings

| Endpoint        | Method | Description                                             | Auth |
|-----------------|--------|---------------------------------------------------------|------|
| `/api/search`   | GET    | Search across clients, deals, and tasks                | Yes  |
| `/api/settings` | PATCH  | Update user settings (name, currency, timezone, etc.)  | Yes  |

## Security Notes

- Never commit real secrets (database passwords, `NEXTAUTH_SECRET`, API keys) to the repository.
- Use `.env` or your deployment platform’s secret manager to store sensitive values.
- Ensure `NEXTAUTH_SECRET` is set in production; without it, sessions are not secure.
- Restrict database access to trusted networks and use strong, unique credentials.
- Most API routes assume a valid authenticated user; do not expose them publicly without proper auth checks.

## Development

Common npm scripts:

- `npm run dev` – Start the development server
- `npm run build` – Create an optimized production build
- `npm run start` – Start the production server (after `npm run build`)
- `npm run lint` – Run ESLint on the codebase

### Typical Dev Flow

1. Start database (e.g., via Docker or local service).
2. Ensure `.env` is configured.
3. Run `npx prisma db push` to sync schema.
4. Run `npm run dev`.
5. Visit http://localhost:3000 and sign up/log in.

## Docker

Docker support is not configured in this repository by default.

To containerize the app, you can:

- Add a `Dockerfile` that:
  - Installs dependencies
  - Builds the Next.js app
  - Runs `next start`
- Optionally add `docker-compose.yml` to run the app alongside a database.

Example commands (once a Dockerfile exists):

```bash
# Build image
docker build -t nexus-crm .

# Run container
docker run -p 3000:3000 --env-file .env nexus-crm
```

(Adjust based on your actual Docker configuration.)

## Cron / Scheduled Scans

There are no built-in cron jobs or scheduled tasks in this project.  
If you need scheduled operations (e.g., task reminders, deal follow-ups):

- Use an external scheduler (e.g., cron, GitHub Actions, a serverless scheduler) that calls your API endpoints.
- Or integrate a job queue / scheduler library in a separate worker service.

## License

License information is not specified in this repository.  
Add a `LICENSE` file (e.g., MIT, Apache-2.0, or your preferred license) and update this section accordingly.