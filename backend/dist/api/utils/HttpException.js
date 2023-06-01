"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
// api/utils/HttpException.ts
class HttpException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.HttpException = HttpException;
