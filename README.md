# Customer API (TypeScript + Express + MySQL)

A production-minded REST API for managing customer records with clean layering, strict input validation, and MySQL-backed persistence.

Designed as an assessment-quality backend that is easy to run, easy to review, and easy to extend.

For design decisions, trade-offs, and how this maps to the assessment brief, see [TECHNICAL_WRITEUP.md](TECHNICAL_WRITEUP.md).

---

## Why This Project Stands Out

- Clean architecture with clear separation of concerns (`routes -> controllers -> models`)
- Type-safe backend using TypeScript and `mysql2/promise`
- Full CRUD coverage for the `customers` resource
- Input validation middleware for body and route params
- Parameterized SQL queries to reduce SQL injection risk
- Centralized not-found and global error handling
- Ready-to-test Postman collection included

---

## Tech Stack

- Node.js
- Express 5
- TypeScript
- MySQL 8
- dotenv

---

## Project Structure

```text
.
├── src
│   ├── app.ts
│   ├── server.ts
│   ├── config
│   │   └── db.ts
│   ├── controllers
│   │   └── customerController.ts
│   ├── middleware
│   │   ├── errorHandler.ts
│   │   └── validateCustomer.ts
│   ├── models
│   │   └── customerModel.ts
│   └── routes
│       └── customerRoutes.ts
├── schema.sql
├── pepkor-assessment-collection.json
├── .env.example
├── TECHNICAL_WRITEUP.md
└── README.md
```

---

## Quick Start

### 1) Prerequisites

- Node.js 18+ (recommended: latest LTS)
- MySQL 8+
- npm

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Create `.env` from `.env.example`:

- macOS/Linux:

```bash
cp .env.example .env
```

- Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Then update your values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

### 4) Create database schema

Make sure your target database exists, then run:

```sql
SOURCE schema.sql;
```

---

## Running the API

- Development (hot reload):

```bash
npm run dev
```

- Build:

```bash
npm run build
```

- Start compiled build:

```bash
npm start
```

Default base URL: `http://localhost:3000`

Health check:

```http
GET /health
```

---

## API Reference

Base path: `/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/customers` | Create customer |
| `GET` | `/customers` | List all customers |
| `GET` | `/customers/:id` | Get customer by ID |
| `PUT` | `/customers/:id` | Update customer by ID |
| `DELETE` | `/customers/:id` | Delete customer by ID |

### Request Body (Create/Update)

```json
{
  "first_name": "Sachin",
  "last_name": "Hockey",
  "age": 23,
  "date_of_birth": "2003-02-24"
}
```

### Success Response Examples

Create (`201`):

```json
{
  "message": "Customer created successfully.",
  "data": {
    "id": 1,
    "first_name": "Sachin",
    "last_name": "Hockey",
    "age": 30,
    "date_of_birth": "2003-02-24",
    "created_at": "2026-04-26T09:00:00.000Z",
    "updated_at": "2026-04-26T09:00:00.000Z"
  }
}
```

List (`200`):

```json
{
  "data": [
    {
      "id": 1,
      "first_name": "Sachin",
      "last_name": "Hockey",
      "age": 23,
      "date_of_birth": "2003-02-24",
      "created_at": "2026-04-26T09:00:00.000Z",
      "updated_at": "2026-04-26T09:00:00.000Z"
    }
  ]
}
```

---

## Validation Rules

- `first_name`: required string, non-empty
- `last_name`: required string, non-empty
- `age`: integer between `0` and `130`
- `date_of_birth`: valid date string
- `id` path param: positive integer

---

## Error Handling

The API returns consistent status codes and meaningful messages.

- `200` OK
- `201` Created
- `400` Bad Request (validation failures)
- `404` Not Found (missing resource/route)
- `500` Internal Server Error

Common error examples:

```json
{ "message": "id must be a positive integer." }
```

```json
{ "message": "first_name and last_name are required and cannot be empty." }
```

---

## Database Schema

The `customers` table is defined in `schema.sql`:

- `id` INT, primary key, auto increment
- `first_name` VARCHAR(100), not null
- `last_name` VARCHAR(100), not null
- `age` INT, not null
- `date_of_birth` DATE, not null
- `created_at` TIMESTAMP, default current timestamp
- `updated_at` TIMESTAMP, auto-updated on modification

---

## Testing with Postman

Import `pepkor-assessment-collection` into Postman.

The collection includes all CRUD requests and uses `baseUrl` (default: `http://localhost:3000`) for easy environment switching.

---

## Production Readiness Notes

This implementation is intentionally clean and assessment-friendly. For production, consider adding:

- automated tests (unit/integration)
- request logging and tracing
- API documentation (OpenAPI/Swagger)
- containerization and CI/CD
- authentication and authorization
- migration tooling for schema versioning
