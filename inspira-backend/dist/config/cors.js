"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = exports.corsOptions = void 0;
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    "http://localhost:3000", // Frontend URL
    // Add any additional allowed origins here
];
exports.corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // allow cookies / authorization headers
};
// Optional: in case you want to use middleware directly
exports.corsMiddleware = (0, cors_1.default)(exports.corsOptions);
