# Getting Started with NexusCRM

This tutorial walks you through setting up NexusCRM locally and exploring the core features: clients, deals, tasks, and user settings.

---

## 1. Prerequisites

Before you begin, make sure you have:

- **Node.js** (LTS recommended)
- **npm** (comes with Node.js)
- A **database** supported by Prisma (e.g., MySQL, PostgreSQL; example below uses MySQL)
- **Git** (to clone the repository)

---

## 2. Clone the Repository

```bash
git clone https://github.com/clow99/NexusCRM.git
cd NexusCRM
```

---

## 3. Install Dependencies

From the project root:

```bash
npm install
```

This installs all dependencies defined in `package.json`, including:

- Next.js
- React
- Prisma
- NextAuth
- Tailwind CSS

---

## 4. Configure Environment Variables

Create a `.env` file in the project root (next to `package.json`) and add at least:

```bash
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

Replace `user`, `password`, `localhost`, `3306`, and `mydb` with your actual database credentials and name.

Notes:

- `DATABASE_URL` is required for Prisma to connect to your database.
- Ensure the database exists and is reachable.

If the repository includes an `.env.example` file, copy from it:

```bash
cp .env.example .env
# then edit .env
```

---

## 5. Set Up the Database with Prisma

From the project root, run the Prisma migration command appropriate for this project (for example):

```bash
npx prisma migrate dev
```

This will:

- Create the database schema defined in `prisma/schema.prisma`
- Apply migrations to your database

If the project uses a different command (e.g., via `package.json` scripts), prefer that instead.

---

## 6. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

By default, the app will be available at:

- http://localhost:3000

If the port is in use, Next.js will prompt you to use another port.

---

## 7. Create a User Account

NexusCRM uses **NextAuth** with a credentials provider.

1. Open your browser and go to:  
   `http://localhost:3000`
2. Look for a **Sign Up** or **Register** option (the UI may vary).
3. Alternatively, you can hit the signup API directly (for testing):

   - Endpoint: `POST /api/auth/signup`
   - Body (JSON example):

     ```json
     {
       "email": "user@example.com",
       "password": "your-secure-password",
       "name": "Your Name"
     }
     ```

4. After signup, log in using your email and password.

Most API routes require authentication, so ensure you can log in successfully before proceeding.

---

## 8. Explore the Core Features

Once logged in, you can start using the CRM features.

### 8.1 Manage Clients

Clients represent your contacts or organizations.

- Navigate to the **Clients** section in the UI.
- Typical actions:
  - **Create** a client (name, company, email, phone, status, etc.)
  - **View** client details
  - **Edit** or **delete** clients

Relevant API routes:

- `GET /api/clients` – list clients
- `POST /api/clients` – create a client
- `GET /api/clients/:id` – get a specific client
- `PATCH /api/clients/:id` – update a client
- `DELETE /api/clients/:id` – delete a client

### 8.2 Manage Deals

Deals track potential revenue opportunities.

- Go to the **Deals** section.
- Typical actions:
  - **Create** a deal linked to a client
  - Set **value**, **currency**, **stage**, **probability**, **expected close date**
  - Update deal stage as it progresses

Relevant API routes:

- `GET /api/deals` – list deals
- `POST /api/deals` – create a deal
- `PATCH /api/deals/:id` – update a deal
- `DELETE /api/deals/:id` – delete a deal

### 8.3 Manage Tasks

Tasks help you track follow-ups and to-dos.

- Open the **Tasks** section.
- Typical actions:
  - **Create** tasks linked to a client and/or deal
  - Set **due date**, **priority**, and **status**
  - Mark tasks as completed

Relevant API routes:

- `GET /api/tasks` – list tasks
- `POST /api/tasks` – create a task

### 8.4 Search Across Records

Use the search functionality to quickly find records.

- Look for a **Search** input in the UI.
- You can search across clients, deals, and tasks.

Relevant API route:

- `GET /api/search` – search across entities

### 8.5 Update User Settings

Customize your profile and preferences.

- Navigate to **Settings** or **Profile**.
- Typical options:
  - **Name**
  - **Timezone**
  - **Currency**

Relevant API route:

- `PATCH /api/settings` – update user settings

---

## 9. Production Build

When you are ready to test a production build:

1. Build the app:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

The app will again be available at `http://localhost:3000` (or another configured port).

---

## 10. Troubleshooting

- **Database connection errors**
  - Verify `DATABASE_URL` in `.env`
  - Confirm the database is running and accessible
  - Re-run `npx prisma migrate dev` if schema changes were made

- **Authentication issues**
  - Ensure you have successfully created a user via `/api/auth/signup` or the UI
  - Confirm cookies/session are enabled in your browser

- **Prisma client errors in development**
  - The project uses a global Prisma client to avoid multiple instances in dev; restart the dev server if you see client initialization errors.

If issues persist, check:

- The browser console for frontend errors
- The terminal running `npm run dev` for backend or Next.js errors

---

You now have NexusCRM running locally and know how to create users, manage clients, deals, and tasks, and adjust your settings. From here, you can explore the codebase under `src/` to customize or extend the CRM to your needs.