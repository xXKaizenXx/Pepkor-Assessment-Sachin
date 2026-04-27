import dotenv from "dotenv";
import app from "./app";

// Load environment variables before reading values like PORT.
dotenv.config();

// Keep server boot config in one place; fallback helps local development.
const port = Number(process.env.PORT) || 3000;

// Start the HTTP server. All route/middleware behavior is configured in app.ts.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
