"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
// server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const errorHandler_1 = __importDefault(require("./api/middlewares/errorHandler"));
const bookPrintRoutes_1 = __importDefault(require("./api/routes/bookPrintRoutes"));
const userRoutes_1 = __importDefault(require("./api/routes/userRoutes"));
const openLibRoutes_1 = __importDefault(require("./api/routes/openLibRoutes"));
const user_1 = __importDefault(require("./api/models/user"));
const database_1 = __importDefault(require("./config/database"));
const jwtAuth_1 = __importDefault(require("./api/middlewares/jwtAuth"));
const requestLogger_1 = __importDefault(require("./api/middlewares/requestLogger"));
function createServer() {
    dotenv_1.default.config();
    (0, database_1.default)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: true, credentials: true }));
    app.use(express_1.default.json());
    // Logging middleware
    app.use(requestLogger_1.default);
    // Passport setup
    const options = {
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    };
    const jwtStrategy = new passport_jwt_1.Strategy(options, passportCallback);
    passport_1.default.use(jwtStrategy);
    app.use(passport_1.default.initialize());
    // Routes
    app.use("/api", userRoutes_1.default);
    app.use("/api/bookprints", jwtAuth_1.default, bookPrintRoutes_1.default);
    app.use("/api/openlib", openLibRoutes_1.default);
    app.use(errorHandler_1.default);
    const PORT = process.env.SERVER_PORT
        ? parseInt(process.env.SERVER_PORT)
        : 3001;
    const IP = process.env.SERVER_IP || "0.0.0.0";
    app.listen(PORT, IP, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    // Passport JWT callback
    function passportCallback(jwtPayload, done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(jwtPayload.id);
                return user ? done(null, user) : done(null, false);
            }
            catch (err) {
                return done(err, false);
            }
        });
    }
}
exports.createServer = createServer;
if (require.main === module) {
    createServer();
}
