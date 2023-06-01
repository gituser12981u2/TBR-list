// server.ts
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import {Strategy as JwtStrategy, ExtractJwt} from "passport-jwt";

import errorHandler from "./api/middlewares/errorHandler";
import bookPrintRoutes from "./api/routes/bookPrintRoutes";
import userRoutes from "./api/routes/userRoutes";
import openLibRoutes from "./api/routes/openLibRoutes";
import User from "./api/models/user";
import connectDb from "./config/database";
import jwtAuth from "./api/middlewares/jwtAuth";
import requestLogger from "./api/middlewares/requestLogger";

export function createServer() {
	dotenv.config();
	connectDb();

	const app = express();
	app.use(cors({origin: true, credentials: true}));
	app.use(express.json());

	// Logging middleware
	app.use(requestLogger);

	// Passport setup
	const options = {
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET,
	};
	const jwtStrategy = new JwtStrategy(options, passportCallback);
	passport.use(jwtStrategy);
	app.use(passport.initialize());

	// Routes
	app.use("/api", userRoutes);
	app.use("/api/bookprints", jwtAuth, bookPrintRoutes);
	app.use("/api/openlib", openLibRoutes);

	app.use(errorHandler);

	const PORT = process.env.SERVER_PORT
		? parseInt(process.env.SERVER_PORT)
		: 3001;
	const IP = process.env.SERVER_IP || "0.0.0.0";
	app.listen(PORT, IP, () => {
		console.log(`Server is running on port ${PORT}`);
	});

	// Passport JWT callback
	async function passportCallback(
		jwtPayload: any,
		done: (error: any, user?: any) => void
	) {
		try {
			const user = await User.findById(jwtPayload.id);
			return user ? done(null, user) : done(null, false);
		} catch (err) {
			return done(err, false);
		}
	}
}

if (require.main === module) {
	createServer();
}
