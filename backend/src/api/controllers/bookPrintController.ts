// api/controllers/bookPrintController.ts
import {Request, Response, NextFunction} from "express";
import BookPrint from "../models/bookPrint";
import {getBookCoverFromOpenLibrary} from "./openLibController";
import {IUser} from "../models/user";

export const addBookPrint = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {title, author} = req.body;
		const user = req.user as IUser;

		// getting the book covers
		const bookCovers = await getBookCoverFromOpenLibrary(title, author);

		if (!bookCovers) {
			res.status(404).json({message: "Book cover not found"});
			return;
		}

		const newBookPrint = new BookPrint({
			title,
			author,
			user: user._id,
			coverImageUrl: bookCovers.mainCover,
			// more book info from open library
		});

		console.log(newBookPrint);

		const savedBookPrint = await newBookPrint.save();

		console.log(savedBookPrint);

		res.json(savedBookPrint);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getAllBookPrintsForUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as IUser;
		const userBooks = await BookPrint.find({user: user._id});

		console.log(userBooks);

		res.json(userBooks);
	} catch (err) {
		next(err);
	}
};

export const getBookPrintById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {id} = req.params;
		const bookPrint = await BookPrint.findById(id);
		if (!bookPrint) {
			return res.status(404).json({message: "Book not found"});
		}
		res.json(bookPrint);
	} catch (err) {
		next(err);
	}
};

export const updateBookPrint = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {id} = req.params;
		const {title, author} = req.body;

		const updatedBookPrint = await BookPrint.findByIdAndUpdate(
			id,
			{
				$set: {
					title,
					author,
				},
			},
			{new: true}
		);

		if (!updatedBookPrint) {
			return res.status(404).json({message: "Book not found"});
		}
		res.json(updatedBookPrint);
	} catch (err) {
		next(err);
	}
};

export const deleteBookPrint = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {id} = req.params;
		const user = req.user as IUser;

		const bookPrint = await BookPrint.findById(id);
		if (!bookPrint) {
			return res.status(404).json({message: "Book not found"});
		}

		if (bookPrint.user.toString() !== user._id.toString()) {
			return res
				.status(403)
				.json({message: "Not authorized to delete this book print"});
		}

		await bookPrint.deleteOne({_id: id});

		res.json({message: "Book deleted successfully"});
	} catch (err) {
		next(err);
	}
};
