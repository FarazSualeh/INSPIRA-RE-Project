"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const students_routes_1 = __importDefault(require("./students.routes"));
const teachers_routes_1 = __importDefault(require("./teachers.routes"));
const activities_routes_1 = __importDefault(require("./activities.routes"));
const assignments_routes_1 = __importDefault(require("./assignments.routes"));
const router = (0, express_1.Router)();
// Set up routes
router.use('/auth', auth_routes_1.default);
router.use('/students', students_routes_1.default);
router.use('/teachers', teachers_routes_1.default);
router.use('/activities', activities_routes_1.default);
router.use('/assignments', assignments_routes_1.default);
exports.default = router;
