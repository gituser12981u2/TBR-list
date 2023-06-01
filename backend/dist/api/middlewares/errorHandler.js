"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function errorHandler(err, req, res, next) {
    console.error(`[Error] ${req.method} ${req.path}`, err);
    const status = err.statusCode || 500;
    const message = err.message || "An unexpected error occurred";
    res.status(status).json({ message });
}
exports.default = errorHandler;
