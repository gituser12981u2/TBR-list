// middleware/errorHandler.ts
import {Request, Response, NextFunction} from "express";

export default function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	console.error(`[Error] ${req.method} ${req.path}`, err);
	const status = err.statusCode || 500;
	const message = err.message || "An unexpected error occurred";
	res.status(status).json({message});
}
