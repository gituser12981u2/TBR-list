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
exports.fetchBookCovers = exports.getBookCoverFromOpenLibrary = void 0;
const axios_1 = __importDefault(require("axios"));
const getBookCoverFromOpenLibrary = (title, author) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const openLibRes = yield axios_1.default.get(`http://openlibrary.org/search.json?title=${title}&author=${author}`);
        const openLibData = openLibRes.data;
        if (openLibData.docs.length === 0) {
            return null;
        }
        const bookId = openLibData.docs[0].cover_i; // get id of first book
        // Generate the URLs
        const mainCover = `http://covers.openlibrary.org/b/id/${bookId}-M.jpg`;
        const otherCovers = Array.from({ length: 4 }, (_, i) => `http://covers.openlibrary.org/b/id/${bookId}-${i + 1}.jpg`);
        return { mainCover, otherCovers };
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
exports.getBookCoverFromOpenLibrary = getBookCoverFromOpenLibrary;
const fetchBookCovers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author } = req.query;
    if (typeof title !== "string" || typeof author !== "string") {
        res.status(400).json({ message: "Invalid title or author" });
        return;
    }
    try {
        const bookCovers = yield (0, exports.getBookCoverFromOpenLibrary)(title, author);
        if (!bookCovers) {
            return res.status(404).json({ message: "Book cover not found" });
        }
        res.json(bookCovers);
    }
    catch (err) {
        next(err);
    }
});
exports.fetchBookCovers = fetchBookCovers;
