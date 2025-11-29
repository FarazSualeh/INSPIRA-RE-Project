"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const config_1 = require("./config");
const routes_1 = require("./routes");
const error_middleware_1 = require("./middleware/error.middleware");
const client_1 = require("./prisma/client");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to the database
(0, client_1.connectToDatabase)();
// Setup routes
(0, routes_1.setupRoutes)(app);
// Error handling middleware
app.use(error_middleware_1.errorHandler);
// Start the server
const PORT = config_1.config.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
