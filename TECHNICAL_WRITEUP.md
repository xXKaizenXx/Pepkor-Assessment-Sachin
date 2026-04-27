# Technical Write-Up: Customer Management API

## Objective

The goal was to develop a robust, type-safe CRUD API using Node.js and TypeScript, backed by a MySQL instance. The system manages customer records (names, age, DOB) while ensuring data integrity through automated timestamps and strict validation.

## Architectural Approach

I opted for a layered architecture, with clear separation between transport, validation, and persistence responsibilities. I have found this to be the most effective way to keep responsibilities decoupled and the codebase maintainable as it scales.

- **Routes:** Defined the API surface area and orchestrated middleware.
- **Controllers:** Handled the transport layer by managing HTTP requests, extracting input, and returning consistent response shapes.
- **Models:** Isolated data access logic. By keeping SQL queries here, the rest of the application remains agnostic of the underlying database implementation.
- **Middleware:** Integrated early-exit validation and centralized error handling to keep controller logic thin and focused.

## Key Technical Decisions

- **TypeScript for predictability:** I used TypeScript throughout to enforce strict contracts across layers. This reduces runtime errors and makes the code self-documenting for other developers.
- **Direct SQL with `mysql2/promise`:** While ORMs have their place, I chose raw SQL with parameterized queries for this project. This allows for maximum transparency, better performance tuning, and protection against SQL injection.
- **Fail-fast validation:** I implemented specialized middleware to intercept requests. If a payload is malformed, the API rejects it immediately with a `400 Bad Request`, preventing unnecessary database hits.
- **Database-level timestamps:** I offloaded management of `created_at` and `updated_at` to the MySQL schema. This keeps data auditability consistent even if records are modified outside the API.

## Data Model

The `customers` table is designed for efficiency:

- `id`: primary key (auto-increment)
- `first_name` / `last_name`: standardized string fields
- `age` / `date_of_birth`: stored to support age-verification logic
- `created_at` / `updated_at`: managed via `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE`

## Error Handling and Reliability

I implemented a global error handler as a final safety net so unexpected failures do not destabilize request handling.

- **Validation errors (`400`):** clear, actionable feedback for consumers
- **Resource handling (`404`):** proper responses for missing records
- **Safety net (`500`):** catch-all handling for unexpected failures

## Verification Workflow

- **Postman collection:** Included to demonstrate the full CRUD lifecycle
- **Health checks:** A `/health` endpoint is available to verify service availability
- **Build pipeline:** The project includes a standard TypeScript build step (`npm run build`) to ensure type-checking passes before deployment

## Trade-Offs and Future Roadmap

For this technical assessment, I prioritized a clean, readable implementation that demonstrates core architectural competency. To move this closer to a production-ready standard aligned with modern enterprise workflows, the next steps are:

- **Automated testing and CI/CD:** Implement a comprehensive test suite (unit and integration) and integrate it into CI so every PR is validated before merge.
- **Schema evolution and migrations:** Introduce a migration tool (for example, Knex.js or TypeORM migrations) so database changes are version-controlled and consistent across environments.
- **Advanced observability and logging:** Move from basic console logging to structured logging (Winston or Pino), with correlation IDs for request tracing.
- **Containerization and scalability:** Dockerize both the API and MySQL, and use `docker-compose` to align local and deployment environments.
- **API standards and security:** Generate OpenAPI/Swagger documentation and introduce security controls such as JWT authentication and rate limiting.
