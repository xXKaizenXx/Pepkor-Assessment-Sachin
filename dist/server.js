"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// Load environment variables before reading values like PORT.
dotenv_1.default.config();
// Keep server boot config in one place; fallback helps local development.
const port = Number(process.env.PORT) || 3000;
// Start the HTTP server. All route/middleware behavior is configured in app.ts.
app_1.default.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
