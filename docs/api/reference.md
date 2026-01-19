# NexusCRM API Reference

This document describes the public HTTP API routes exposed by NexusCRM.

All routes are implemented using Next.js App Router API routes under `src/app/api`. Most routes require authentication via NextAuth (session cookie).

---

## Authentication

### `GET /api/auth/[...nextauth]`

Handles all NextAuth authentication flows (sign in, sign out, session, callbacks, etc.).

- **Auth**: Not required for sign-in; required for session-related operations.
- **Notes**: This is a NextAuth dynamic route. You typically interact with it via the NextAuth client (e.g., `next-auth/react`) rather than calling it directly.

---

### `POST /api/auth/signup`

Create a new user account.

- **Auth**: Not required
- **Request Body** (JSON)

  ```json
  {
    "email": "user@example.com",
    "password": "plain-text-password",
    "name": "Optional Name"
  }
  ```

- **Responses**
  - `201 Created` – User created
  - `400 Bad Request` – Missing/invalid fields
  - `409 Conflict` – Email already in use
  - `500 Internal Server Error` – Unexpected error

---

## Clients

### `GET /api/clients`

Fetch a list of clients for the authenticated user.

- **Auth**: Required
- **Query Parameters** (may vary; only use those implemented in code)
  - Common patterns include pagination or simple filtering, but only use what you see in the route implementation.
- **Responses**
  - `200 OK` – Returns an array of client objects
  - `401 Unauthorized` – Not authenticated

---

### `POST /api/clients`

Create a new client.

- **Auth**: Required
- **Request Body** (JSON – typical fields)

  ```json
  {
    "name": "Client Name",
    "company": "Company Inc.",
    "email": "client@example.com",
    "phone": "+1 555 123 4567",
    "website": "https://example.com",
    "status": "active"
  }
  ```

- **Responses**
  - `201 Created` – Returns the created client
  - `400 Bad Request` – Validation error
  - `401 Unauthorized` – Not authenticated

---

### `GET /api/clients/:id`

Fetch a single client by ID.

- **Auth**: Required
- **Path Parameters**
  - `id` – Client ID
- **Responses**
  - `200 OK` – Returns the client object
  - `404 Not Found` – Client not found or not owned by user
  - `401 Unauthorized` – Not authenticated

---

### `PATCH /api/clients/:id`

Update an existing client.

- **Auth**: Required
- **Path Parameters**
  - `id` – Client ID
- **Request Body** (JSON – partial update; only send fields to change)

  ```json
  {
    "name": "Updated Name",
    "company": "Updated Company",
    "email": "updated@example.com",
    "phone": "+1 555 987 6543",
    "website": "https://updated.com",
    "status": "inactive"
  }
  ```

- **Responses**
  - `200 OK` – Returns the updated client
  - `400 Bad Request` – Validation error
  - `404 Not Found` – Client not found or not owned by user
  - `401 Unauthorized` – Not authenticated

---

### `DELETE /api/clients/:id`

Delete a client.

- **Auth**: Required
- **Path Parameters**
  - `id` – Client ID
- **Responses**
  - `204 No Content` – Deleted successfully
  - `404 Not Found` – Client not found or not owned by user
  - `401 Unauthorized` – Not authenticated

---

## Deals

### `GET /api/deals`

Fetch a list of deals for the authenticated user.

- **Auth**: Required
- **Responses**
  - `200 OK` – Returns an array of deal objects
  - `401 Unauthorized` – Not authenticated

---

### `POST /api/deals`

Create a new deal.

- **Auth**: Required
- **Request Body** (JSON – typical fields)

  ```json
  {
    "clientId": "client-id",
    "title": "Deal Title",
    "value": 10000,
    "currency": "USD",
    "stage": "prospecting",
    "probability": 0.5,
    "expectedCloseDate": "2025-01-31"
  }
  ```

- **Responses**
  - `201 Created` – Returns the created deal
  - `400 Bad Request` – Validation error
  - `401 Unauthorized` – Not authenticated

---

### `PATCH /api/deals/:id`

Update an existing deal.

- **Auth**: Required
- **Path Parameters**
  - `id` – Deal ID
- **Request Body** (JSON – partial update)

  ```json
  {
    "title": "Updated Deal Title",
    "value": 12000,
    "stage": "negotiation",
    "probability": 0.7,
    "expectedCloseDate": "2025-02-15"
  }
  ```

- **Responses**
  - `200 OK` – Returns the updated deal
  - `400 Bad Request` – Validation error
  - `404 Not Found` – Deal not found or not owned by user
  - `401 Unauthorized` – Not authenticated

---

### `DELETE /api/deals/:id`

Delete a deal.

- **Auth**: Required
- **Path Parameters**
  - `id` – Deal ID
- **Responses**
  - `204 No Content` – Deleted successfully
  - `404 Not Found` – Deal not found or not owned by user
  - `401 Unauthorized` – Not authenticated

---

## Tasks

### `GET /api/tasks`

Fetch a list of tasks for the authenticated user.

- **Auth**: Required
- **Responses**
  - `200 OK` – Returns an array of task objects
  - `401 Unauthorized` – Not authenticated

---

### `POST /api/tasks`

Create a new task.

- **Auth**: Required
- **Request Body** (JSON – typical fields)

  ```json
  {
    "title": "Follow up call",
    "clientId": "client-id",
    "dealId": "deal-id",
    "dueDate": "2025-01-20T10:00:00.000Z",
    "priority": "high",
    "status": "open"
  }
  ```

- **Responses**
  - `201 Created` – Returns the created task
  - `400 Bad Request` – Validation error
  - `401 Unauthorized` – Not authenticated

---

## Search

### `GET /api/search`

Search across clients, deals, and tasks.

- **Auth**: Required
- **Query Parameters**
  - `q` – Search query string (exact name may vary; confirm in implementation)
- **Responses**
  - `200 OK` – Returns aggregated search results
  - `400 Bad Request` – Missing/invalid query
  - `401 Unauthorized` – Not authenticated

---

## Settings

### `PATCH /api/settings`

Update user settings (e.g., name, currency, timezone).

- **Auth**: Required
- **Request Body** (JSON – partial update)

  ```json
  {
    "name": "New Name",
    "timezone": "America/New_York",
    "currency": "USD"
  }
  ```

- **Responses**
  - `200 OK` – Returns updated user settings
  - `400 Bad Request` – Validation error
  - `401 Unauthorized` – Not authenticated

---

## Data Models (Conceptual)

These reflect the main Prisma models used by the API. Field names and types should be confirmed in the Prisma schema.

### User

Represents an application user.

- **Core fields**: `id`, `email`, `passwordHash`, `name`, `timezone`, `currency`
- **Relations**: `clients`, `deals`, `tasks`, `notes`, `tags`

### Client

Represents a client/contact.

- **Core fields**: `id`, `userId`, `name`, `company`, `email`, `phone`, `website`, `status`
- **Relations**: `deals`, `tasks`, `notes`, `tags`

### Deal

Represents a sales opportunity.

- **Core fields**: `id`, `userId`, `clientId`, `title`, `value`, `currency`, `stage`, `probability`, `expectedCloseDate`
- **Relations**: `notes`, `tasks`, `activities`

### Task

Represents a to‑do item linked to a client and/or deal.

- **Core fields**: `id`, `userId`, `clientId`, `dealId`, `title`, `dueDate`, `priority`, `status`
- **Relations**: `user`, `client`

---

## Notes

- All authenticated routes rely on NextAuth session handling; ensure cookies are sent with requests when calling from non-browser clients.
- Database access is handled via Prisma; ensure `DATABASE_URL` is configured before using the API.