// /api/models/BookPrint.ts
import mongoose, {Document, Schema} from "mongoose";

export interface IBookPrint extends Document {
	title: string;
	author: string;
	user: mongoose.Types.ObjectId;
	synopsis?: string;
	coverImageUrl?: string;
	publicationYear?: number;
}

const bookPrintSchema = new Schema<IBookPrint>(
	{
		title: {type: String, required: true},
		author: {type: String, required: true},
		user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
		synopsis: String,
		coverImageUrl: String,
		publicationYear: Number,
	},
	{
		timestamps: true,
	}
);

const BookPrint = mongoose.model<IBookPrint>("BookPrint", bookPrintSchema);

export default BookPrint;
