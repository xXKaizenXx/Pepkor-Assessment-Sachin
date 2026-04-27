# Technical Write-Up: Customer Management API

## Objective

I set out to build a small but solid CRUD API in Node.js and TypeScript, backed by MySQL. It manages customer records (name, age, date of birth) and I wanted the usual guarantees: sensible validation, predictable errors, and timestamps I do not have to remember to set in application code.

## Architectural Approach

I went with a layered layout because it matches how I think about a request: surface area first, then rules, then persistence. Keeping transport, validation, and data access in separate places has saved me pain on larger projects, so I applied the same idea here even at assessment size.

- **Routes:** Where I define the API shape and wire middleware before the controller runs.
- **Controllers:** Where I translate HTTP into calls to the model and shape responses so callers get a consistent JSON contract.
- **Models:** Where I keep SQL. I like the rest of the stack not caring whether the store is MySQL or something else later; the queries live in one place.
- **Middleware:** Where I validate early and handle errors in one pipeline so controllers stay short and boring in a good way.

## Why this folder layout and libraries

**Folder structure:** Everything sits under `src/` in folders that mirror those layers (`routes`, `controllers`, `models`, `middleware`, `config`). If you are tracing a bug or onboarding someone, you can walk the path from the route file to the query without digging through a single giant module. I split **`app.ts`** and **`server.ts`** on purpose: `app.ts` is the Express instance—JSON body parsing, mounting routers, error handlers. `server.ts` loads env and calls `listen`. That way I can import the app (for tests or tooling) without opening a port, and boot stays obvious when I open the entry file.

**Libraries:** I picked **Express** because it is what most Node teams already know; for a straight REST CRUD I did not need the ceremony of a larger framework. **`mysql2`** with promises gives me `async`/`await` against MySQL with a driver that is actively maintained, and I still write SQL myself so I can see exactly what runs and keep parameters bound. **`dotenv`** keeps host, port, and credentials out of the repo; local, staging, and production each supply their own env, which is how I would actually run this. For day-to-day coding I use **`ts-node-dev`** so I get quick restarts; for anything I would ship, **`npm run build`** runs `tsc` and I run `node dist/server.js` so production is plain Node on compiled JS—no surprises.

## Key Technical Decisions

- **TypeScript end to end:** I wanted types at boundaries between layers so refactors surface in the editor instead of at runtime. It also reads as documentation for whoever picks this up next.
- **Raw SQL with `mysql2/promise`:** I am fine with ORMs when the team standardizes on one; here I wanted transparency and a small dependency footprint. Parameterized queries give me injection safety without hiding the SQL.
- **Fail-fast validation:** I validate in middleware before hitting the database. Bad payloads return `400` immediately, which saves round trips and makes client mistakes obvious.
- **Timestamps in MySQL:** I let `created_at` and `updated_at` default and update in the schema. Even if something touches the row outside this API, the row still carries a trustworthy audit trail.

## Data Model

I kept the `customers` table straightforward:

- `id` as an auto-increment primary key
- `first_name` and `last_name` as the canonical name fields
- `age` and `date_of_birth` to support the business rules around age
- `created_at` / `updated_at` via `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE` so I am not duplicating that logic in TypeScript

## Error Handling and Reliability

I added a global error handler at the end of the Express stack so nothing uncaught leaks out as a raw stack trace to the client.

- **`400`:** validation and bad input, with messages I would want if I were integrating against this API
- **`404`:** missing customer when the id does not exist
- **`500`:** anything unexpected; I still log and respond in a controlled shape

## Verification Workflow

- **Postman collection:** I included it so you can run through create, read, update, and delete without guessing URLs or bodies.
- **`/health`:** A lightweight check that the process is up—useful for load balancers or sanity after a deploy.
- **`npm run build`:** I rely on the TypeScript compile step as a gate; if types fail, the build fails, which is cheap insurance before deployment.

## Trade-Offs and Future Roadmap

For the scope of this assessment I deliberately stopped where the architecture is clear and the code is easy to read. If I were taking this toward production with a team, these are the things I would tackle next:

- **Tests and CI:** Unit tests around validation and model behaviour, plus integration tests against a real MySQL (or container), wired into CI on every PR.
- **Migrations:** A proper migration tool (Knex, Flyway-style, or similar) so schema changes are versioned like code.
- **Observability:** Structured logs (Pino or Winston) and request correlation IDs instead of ad hoc `console.log`.
- **Containers:** Docker for the API and database, with `docker-compose` for a one-command local environment that matches prod more closely.
- **API docs and hardening:** OpenAPI/Swagger generated or hand-maintained alongside auth (for example JWT) and rate limiting at the edge.

