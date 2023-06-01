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
exports.deleteBookPrint = exports.updateBookPrint = exports.getBookPrintById = exports.getAllBookPrintsForUser = exports.addBookPrint = void 0;
const bookPrint_1 = __importDefault(require("../models/bookPrint"));
const openLibController_1 = require("./openLibController");
const addBookPrint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author } = req.body;
        const user = req.user;
        // getting the book covers
        const bookCovers = yield (0, openLibController_1.getBookCoverFromOpenLibrary)(title, author);
        if (!bookCovers) {
            res.status(404).json({ message: "Book cover not found" });
            return;
        }
        const newBookPrint = new bookPrint_1.default({
            title,
            author,
            user: user._id,
            coverImageUrl: bookCovers.mainCover,
            // more book info from open library
        });
        console.log(newBookPrint);
        const savedBookPrint = yield newBookPrint.save();
        console.log(savedBookPrint);
        res.json(savedBookPrint);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
exports.addBookPrint = addBookPrint;
const getAllBookPrintsForUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userBooks = yield bookPrint_1.default.find({ user: user._id });
        console.log(userBooks);
        res.json(userBooks);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllBookPrintsForUser = getAllBookPrintsForUser;
const getBookPrintById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const bookPrint = yield bookPrint_1.default.findById(id);
        if (!bookPrint) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(bookPrint);
    }
    catch (err) {
        next(err);
    }
});
exports.getBookPrintById = getBookPrintById;
const updateBookPrint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, author } = req.body;
        const updatedBookPrint = yield bookPrint_1.default.findByIdAndUpdate(id, {
            $set: {
                title,
                author,
            },
        }, { new: true });
        if (!updatedBookPrint) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(updatedBookPrint);
    }
    catch (err) {
        next(err);
    }
});
exports.updateBookPrint = updateBookPrint;
const deleteBookPrint = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = req.user;
        const bookPrint = yield bookPrint_1.default.findById(id);
        if (!bookPrint) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (bookPrint.user.toString() !== user._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this book print" });
        }
        yield bookPrint.deleteOne({ _id: id });
        res.json({ message: "Book deleted successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteBookPrint = deleteBookPrint;
