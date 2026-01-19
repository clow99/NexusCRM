# Architecture Overview

NexusCRM is a full‑stack CRM application built on the Next.js App Router. It combines a React-based UI, API routes, and a Prisma-backed database into a single monorepo.

This document provides a high-level view of the system architecture, major components, and how they interact.

---

## High-Level Architecture

NexusCRM follows a typical modern Next.js architecture:

- **Frontend**: React components rendered via Next.js (App Router) with server and client components.
- **Backend**: Next.js API routes under `src/app/api` providing a JSON API.
- **Authentication**: NextAuth credentials provider for login/session management.
- **Data Layer**: Prisma ORM connecting to a relational database (configured via `DATABASE_URL`).
- **Styling/UI**: Tailwind CSS v4 and utility helpers (`clsx`, `tailwind-merge`), plus iconography via `lucide-react`.
- **State & Interactions**: Local React state, drag-and-drop via `@dnd-kit/*`, and client-side form handling/validation where needed.

All of this is packaged as a single Next.js application started with `next dev` / `next start`.

---

## Application Layers

### 1. Presentation Layer (Next.js App Router)

- Located primarily under `src/app`.
- Uses Next.js 16 App Router conventions:
  - Route segments map to pages and layouts.
  - Server components handle data fetching where appropriate.
  - Client components handle interactive UI (e.g., drag-and-drop, forms).

Key responsibilities:

- Render dashboards and detail views for:
  - Clients
  - Deals
  - Tasks
  - User settings
- Provide UX for:
  - Authentication (login/signup)
  - CRUD operations on CRM entities
  - Search and filtering
  - Kanban/board-style interactions (via `@dnd-kit`)

UI technologies:

- **React 19** for component-based UI.
- **Tailwind CSS 4** for utility-first styling.
- **lucide-react** for icons.
- **clsx** and **tailwind-merge** to compose and deduplicate class names.

### 2. API Layer (Next.js Route Handlers)

The backend API is implemented using Next.js route handlers under `src/app/api`. These handlers:

- Parse HTTP requests.
- Enforce authentication/authorization (via NextAuth session checks).
- Call Prisma to read/write data.
- Return JSON responses.

Available routes:

- **Authentication**
  - `GET /api/auth/:...nextauth`  
    NextAuth handler for login, logout, sessions, etc.
  - `POST /api/auth/signup`  
    Creates a new user account (e.g., hashing password with `bcryptjs` and persisting via Prisma).

- **Clients**
  - `GET /api/clients` – List clients for the authenticated user.
  - `POST /api/clients` – Create a new client.
  - `GET /api/clients/:id` – Fetch a specific client.
  - `PATCH /api/clients/:id` – Update a client.
  - `DELETE /api/clients/:id` – Delete a client.

- **Deals**
  - `GET /api/deals` – List deals.
  - `POST /api/deals` – Create a new deal.
  - `PATCH /api/deals/:id` – Update a deal.
  - `DELETE /api/deals/:id` – Delete a deal.

- **Tasks**
  - `GET /api/tasks` – List tasks.
  - `POST /api/tasks` – Create a new task.

- **Search**
  - `GET /api/search` – Search across clients, deals, and tasks.

- **Settings**
  - `PATCH /api/settings` – Update user settings (e.g., name, currency, timezone).

These route handlers typically:

1. Validate the HTTP method.
2. Retrieve the current user/session.
3. Validate input (often using `zod` schemas).
4. Call the Prisma client.
5. Return structured JSON or appropriate error responses.

### 3. Authentication & Authorization

Authentication is handled via **NextAuth**:

- Configuration is defined in `src/lib/auth.js`.
- Uses a **credentials provider**:
  - Accepts email/password.
  - Verifies credentials (e.g., via `bcryptjs` against stored password hashes).
- Session data is used in API routes and server components to:
  - Restrict access to authenticated users.
  - Scope data to the current user (e.g., `userId` filters in Prisma queries).

Most API routes assume an authenticated user; unauthenticated requests should be rejected or redirected at the UI level.

---

## Data Layer

### Prisma Client

- Prisma is configured via:
  - `prisma/schema.prisma` (models and relations).
  - `prisma.config.ts` (Prisma tooling configuration).
- The Prisma client is initialized and exported from `src/lib/prisma.js`.
  - Implemented to avoid multiple instances in development (a common Next.js/Prisma pattern).

Environment:

- `DATABASE_URL` (required) defines the database connection string.  
  Example: `mysql://user:password@localhost:3306/mydb`

### Core Data Models

The following summarizes key Prisma models and their roles.

#### User

Represents an application user.

- Fields (conceptual):
  - `email`
  - `passwordHash`
  - `name`
  - `timezone`
  - `currency`
- Relations:
  - `clients`
  - `deals`
  - `tasks`
  - `notes`
  - `tags`

Used for:

- Authentication and session identity.
- Personalization (timezone, currency).
- Ownership of CRM data (all core entities are scoped by `userId`).

#### Client

Represents a customer or contact.

- Fields:
  - `userId`
  - `name`
  - `company`
  - `email`
  - `phone`
  - `website`
  - `status`
- Relations:
  - `deals`
  - `tasks`
  - `notes`
  - `tags`

Used for:

- Storing contact information.
- Linking deals and tasks to a specific client.

#### Deal

Represents a sales opportunity.

- Fields:
  - `userId`
  - `clientId`
  - `title`
  - `value`
  - `currency`
  - `stage`
  - `probability`
  - `expectedCloseDate`
- Relations:
  - `notes`
  - `tasks`
  - `activities`

Used for:

- Pipeline/kanban views.
- Revenue forecasting (value, probability, expected close date).
- Associating tasks and notes with an opportunity.

#### Task

Represents an actionable item.

- Fields:
  - `userId`
  - `clientId` (optional, depending on schema)
  - `dealId` (optional, depending on schema)
  - `title`
  - `dueDate`
  - `priority`
  - `status`
- Relations:
  - `user`
  - `client`
  - (potentially) `deal`

Used for:

- Tracking follow-ups and to-dos.
- Associating work with clients and deals.

---

## Cross-Cutting Concerns

### Validation

- **zod** is used to define schemas for request payloads and possibly for form validation.
- Typical flow:
  - Parse `req.body` or query params.
  - Validate with a `zod` schema.
  - Return 400 responses on validation errors.

### Drag and Drop / Interactions

- **@dnd-kit/core**, **@dnd-kit/sortable**, and **@dnd-kit/utilities** power drag-and-drop interactions, such as:
  - Reordering items in lists.
  - Moving deals between stages in a pipeline view.

These are implemented in client components and backed by API calls to persist ordering or stage changes.

---

## Deployment & Runtime

- Built and served as a standard Next.js app:
  - `npm run build` – Production build.
  - `npm run start` – Start production server.
- The same codebase serves:
  - Server-rendered pages.
  - API routes.
- Prisma connects to the database at runtime using `DATABASE_URL`.

---

## Gotchas and Considerations

- **Database configuration**:  
  Ensure `DATABASE_URL` is correctly set before running migrations or starting the app.
- **Prisma client reuse**:  
  The Prisma client is initialized in a way that avoids multiple instances in development; avoid re-creating clients outside `src/lib/prisma.js`.
- **Authentication**:  
  Most API routes expect an authenticated user. If you add new routes, integrate NextAuth session checks consistently.
- **Model changes**:  
  When updating Prisma models:
  - Update `schema.prisma`.
  - Run `prisma migrate` as appropriate.
  - Adjust API handlers and UI components to match new fields/relations.

This overview should give you enough context to navigate the codebase, understand how data flows from the UI to the database, and extend NexusCRM safely.