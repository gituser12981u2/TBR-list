// middleware/requestLogger.ts
import {Request, Response, NextFunction} from "express";

export default function requestLogger(
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.log(`${req.method} ${req.path}`);
	next();
}
