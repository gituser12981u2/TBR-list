// controllers/userController.ts
require("dotenv").config();
import {HttpException} from "../utils/HttpException";
import {NextFunction, Request, Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import validator from "validator";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new HttpException("Missing JWT secret", 500);
}

export const signup = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {email, password} = req.body;

	if (!email || !validator.isEmail(email)) {
		throw new HttpException("Invalid email", 400);
	}

	if (!password) {
		throw new HttpException("Password must not be empty", 400);
	}

	try {
		const existingUser = await User.findOne({username: email});
		if (existingUser) {
			throw new HttpException(`User "${email}" already exists`, 409);
		}

		const user = new User({username: email, password});
		await user.save();

		const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "90d"});

		res.status(201).json({token});
	} catch (error) {
		next(error);
	}
};

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {email, password} = req.body;

	console.log(req.body);

	try {
		const user = await User.findOne({username: email});
		if (!user) {
			throw new HttpException("Invalid email or password", 401);
		}

		const isMatch = await user.validatePassword(password);
		if (!isMatch) {
			throw new HttpException("Invalid email or password", 401);
		}

		const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "90d"});
		res.json({token});
	} catch (error) {
		next(error);
	}
};
