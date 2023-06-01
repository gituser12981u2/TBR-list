"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/routes/openLibRoutes.ts
const express_1 = __importDefault(require("express"));
const openLibController_1 = require("../controllers/openLibController");
const router = express_1.default.Router();
router.get("/bookcovers", openLibController_1.fetchBookCovers);
exports.default = router;
