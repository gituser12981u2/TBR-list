// api/controllers/openLibController.ts
import {Request, Response, NextFunction} from "express";
import axios from "axios";

export const getBookCoverFromOpenLibrary = async (
	title: string,
	author: string
) => {
	try {
		const openLibRes = await axios.get(
			`http://openlibrary.org/search.json?title=${title}&author=${author}`
		);
		const openLibData = openLibRes.data;

		if (openLibData.docs.length === 0) {
			return null;
		}

		const bookId = openLibData.docs[0].cover_i; // get id of first book

		// Generate the URLs
		const mainCover = `http://covers.openlibrary.org/b/id/${bookId}-M.jpg`;
		const otherCovers = Array.from(
			{length: 4},
			(_, i) => `http://covers.openlibrary.org/b/id/${bookId}-${i + 1}.jpg`
		);

		return {mainCover, otherCovers};
	} catch (err) {
		console.error(err);
		return null;
	}
};

export const fetchBookCovers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const {title, author} = req.query;

	if (typeof title !== "string" || typeof author !== "string") {
		res.status(400).json({message: "Invalid title or author"});
		return;
	}

	try {
		const bookCovers = await getBookCoverFromOpenLibrary(title, author);

		if (!bookCovers) {
			return res.status(404).json({message: "Book cover not found"});
		}

		res.json(bookCovers);
	} catch (err) {
		next(err);
	}
};
