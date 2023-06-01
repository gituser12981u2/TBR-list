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
exports.login = exports.signup = void 0;
// controllers/userController.ts
require("dotenv").config();
const HttpException_1 = require("../utils/HttpException");
const user_1 = __importDefault(require("../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new HttpException_1.HttpException("Missing JWT secret", 500);
}
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !validator_1.default.isEmail(email)) {
        throw new HttpException_1.HttpException("Invalid email", 400);
    }
    if (!password) {
        throw new HttpException_1.HttpException("Password must not be empty", 400);
    }
    try {
        const existingUser = yield user_1.default.findOne({ username: email });
        if (existingUser) {
            throw new HttpException_1.HttpException(`User "${email}" already exists`, 409);
        }
        const user = new user_1.default({ username: email, password });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "90d" });
        res.status(201).json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = yield user_1.default.findOne({ username: email });
        if (!user) {
            throw new HttpException_1.HttpException("Invalid email or password", 401);
        }
        const isMatch = yield user.validatePassword(password);
        if (!isMatch) {
            throw new HttpException_1.HttpException("Invalid email or password", 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "90d" });
        res.json({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
