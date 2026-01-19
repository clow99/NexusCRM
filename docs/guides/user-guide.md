# NexusCRM User Guide

NexusCRM is a customer relationship management (CRM) application built with Next.js. It helps you manage clients, deals, tasks, and personal settings in one place.

This guide focuses on how to use the application as an end user (not how to develop or deploy it).

---

## Getting Started

### Accessing the Application

If you are running NexusCRM locally:

- Start the app (your admin or developer may do this for you) with:
  - `npm run dev` for development, or
  - `npm start` for production
- Open your browser and go to:  
  `http://localhost:3000`

If NexusCRM is deployed, your admin will provide a URL (e.g. `https://crm.example.com`).

### Creating an Account (Sign Up)

If self-signup is enabled:

1. Go to the main application URL.
2. Look for a **Sign Up** or **Create Account** option.
3. Provide:
   - Email address
   - Password
   - Any other required fields (e.g. name)
4. Submit the form to create your account.

Behind the scenes, this uses the `/api/auth/signup` endpoint to create a new user.

If you do not see a signup option, your admin may need to create your account.

### Logging In

1. Go to the main application URL.
2. Enter your email and password.
3. Submit to log in.

NexusCRM uses session-based authentication (NextAuth). Once logged in, you can access your clients, deals, tasks, and settings.

### Logging Out

Look for a **Logout** or **Sign Out** option in the navigation or user menu. Clicking it will end your session and return you to the login page.

---

## Core Concepts

NexusCRM organizes your work around four main entities:

- **Clients** – People or organizations you work with.
- **Deals** – Sales opportunities or projects tied to clients.
- **Tasks** – To-dos and follow-ups related to clients or deals.
- **Settings** – Your personal preferences (name, currency, timezone, etc.).

Each record is associated with your user account; you only see your own data.

---

## Working with Clients

Clients represent your contacts or organizations.

### Viewing Clients

- Navigate to the **Clients** section (usually via a sidebar or top navigation).
- You will see a list of existing clients associated with your account.

The list may support:

- Sorting (e.g. by name or status)
- Filtering or searching (see [Search](#searching-across-records))

### Creating a Client

1. Go to the **Clients** section.
2. Click **Add Client**, **New Client**, or similar.
3. Fill in the client details, such as:
   - Name
   - Company
   - Email
   - Phone
   - Website
   - Status (e.g. active, prospect)
4. Save the client.

This uses the `POST /api/clients` endpoint behind the scenes.

### Viewing Client Details

- Click on a client in the list to open its detail view.
- Here you can typically see:
  - Basic info (name, company, contact details)
  - Related deals
  - Related tasks
  - Any associated notes/tags if available in the UI

### Editing a Client

1. Open the client detail view.
2. Click **Edit**.
3. Update the fields you want to change.
4. Save your changes.

This uses `PATCH /api/clients/:id`.

### Deleting a Client

1. Open the client detail view.
2. Click **Delete** (or a trash icon).
3. Confirm the deletion.

This uses `DELETE /api/clients/:id`. Deleting a client may also affect related deals and tasks, depending on how your instance is configured, so proceed carefully.

---

## Working with Deals

Deals represent sales opportunities or projects associated with clients.

### Viewing Deals

- Navigate to the **Deals** section.
- You will see a list (or possibly a board) of deals.

Deals typically include:

- Title
- Associated client
- Value and currency
- Stage (e.g. prospecting, negotiation, closed)
- Probability
- Expected close date

### Creating a Deal

1. Go to the **Deals** section.
2. Click **Add Deal** or **New Deal**.
3. Provide:
   - Title
   - Client (select an existing client)
   - Value and currency
   - Stage
   - Probability
   - Expected close date
4. Save the deal.

This uses `POST /api/deals`.

### Editing a Deal

1. Open the deal detail view.
2. Click **Edit**.
3. Update the fields (stage, value, expected close date, etc.).
4. Save your changes.

This uses `PATCH /api/deals/:id`.

### Deleting a Deal

1. Open the deal detail view.
2. Click **Delete**.
3. Confirm the deletion.

This uses `DELETE /api/deals/:id`. Deleting a deal may also affect related tasks or activities.

---

## Working with Tasks

Tasks help you track follow-ups, calls, emails, and other to-dos.

### Viewing Tasks

- Navigate to the **Tasks** section.
- You will see a list of tasks associated with your user.

Tasks typically include:

- Title
- Due date
- Priority
- Status (e.g. open, in progress, completed)
- Related client and/or deal

### Creating a Task

1. Go to the **Tasks** section.
2. Click **Add Task** or **New Task**.
3. Provide:
   - Title
   - Due date
   - Priority
   - Status
   - (Optional) Related client
   - (Optional) Related deal
4. Save the task.

This uses `POST /api/tasks`.

### Editing a Task

1. Open the task detail view or inline editor.
2. Update fields such as status, due date, or priority.
3. Save your changes.

This uses `PATCH /api/tasks/:id` if implemented; otherwise, updates may be handled via the main tasks API route.

### Completing or Deleting a Task

- To mark a task as done, change its **Status** to a completed state (e.g. “Completed”).
- To delete a task:
  1. Open the task.
  2. Click **Delete**.
  3. Confirm.

---

## Searching Across Records

NexusCRM provides a unified search endpoint to help you quickly find information.

### Using Search

If a search bar is present in the UI:

1. Click the search input (often in the header or navigation).
2. Type a keyword (e.g. client name, deal title).
3. View matching results across:
   - Clients
   - Deals
   - Tasks

Behind the scenes, this uses `GET /api/search`.

If you do not see search in the UI, your instance may not expose it yet.

---

## Managing Your Settings

Use the **Settings** section to customize your experience.

### Accessing Settings

- Look for a **Settings** link or a user/profile menu (often with your name or avatar).
- Open it to view your personal settings.

### Updating Profile and Preferences

Typical settings include:

- **Name** – How your name appears in the app.
- **Timezone** – Used for displaying dates and times correctly.
- **Currency** – Used for deal values and financial fields.

To update:

1. Open **Settings**.
2. Edit the fields you want to change.
3. Save your changes.

This uses `PATCH /api/settings`.

Changes apply to your account only and do not affect other users.

---

## Data and Security Notes

- Most actions (viewing and editing clients, deals, tasks, settings) require you to be logged in.
- Each record (client, deal, task) is associated with your user account; other users cannot see your data unless your admin has configured shared access.
- Make sure to log out when using NexusCRM on a shared or public computer.

---

## Troubleshooting

### I Cannot Log In

- Check that your email and password are correct.
- If you recently signed up, ensure the account was created successfully.
- If the problem persists, contact your administrator; the authentication service (NextAuth) or database may be misconfigured.

### My Data Is Missing

- Confirm you are logged in with the correct account.
- Use the search feature to look for the client, deal, or task.
- If you suspect data was deleted, contact your administrator; deletions via `/api/clients/:id`, `/api/deals/:id`, or tasks endpoints are permanent.

### Timezone or Currency Looks Wrong

- Go to **Settings** and verify your **Timezone** and **Currency**.
- Update them and save. Refresh the page to ensure changes take effect.

---

## Where to Get Help

If you encounter issues not covered here:

- Contact your system administrator or the person who deployed NexusCRM.
- Provide:
  - A description of what you were trying to do
  - Any error messages shown in the UI
  - The approximate time the issue occurred

This information helps diagnose problems with authentication, database connectivity, or API routes.