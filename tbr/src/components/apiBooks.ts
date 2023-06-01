// apiBooks.ts
import axios from "axios";

export const fetchBooks = async () => {
	const token = localStorage.getItem("token");

	if (token) {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_SERVER_URL}/api/bookprints`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			console.log(response.data);
			return response.data;
		} catch (err) {
			throw err;
		}
	}
	throw new Error("Not authenticated");
};

export const deleteBook = async (id: string) => {
	const token = localStorage.getItem("token");

	if (token) {
		try {
			const response = await axios.delete(
				`${process.env.REACT_APP_SERVER_URL}/api/bookprints/${id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (err) {
			throw err;
		}
	}
	throw new Error("Not authenticated");
};
