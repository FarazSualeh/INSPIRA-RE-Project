"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
const client_1 = __importDefault(require("./prisma/client"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mount all routes under /api (or just "/" if you prefer)
app.use("/api", routes_1.default);
// Error handling middleware (after routes)
app.use(error_middleware_1.default);
const PORT = config_1.default.port || 5000;
client_1.default
    .$connect()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
