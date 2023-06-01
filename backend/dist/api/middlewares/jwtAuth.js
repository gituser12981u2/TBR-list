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
// middleware/jwtAuth.ts
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const user_1 = __importDefault(require("../models/user"));
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};
const jwtStrategy = new passport_jwt_1.Strategy(options, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findById(jwtPayload.id);
        if (user) {
            return done(null, user);
        }
        // If user is not found
        return done(null, false, { message: "Token not valid" });
    }
    catch (error) {
        return done(error, false);
    }
}));
passport_1.default.use(jwtStrategy);
exports.default = passport_1.default.authenticate("jwt", { session: false });
