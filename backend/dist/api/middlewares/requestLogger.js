"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function requestLogger(req, res, next) {
    console.log(`${req.method} ${req.path}`);
    next();
}
exports.default = requestLogger;
