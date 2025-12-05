"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const cors_2 = require("./config/cors");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(express_1.default.json());
// Setup routes
(0, routes_1.default)(app);
// Error handling middleware (must be last)
app.use(error_middleware_1.default);
exports.default = app;
