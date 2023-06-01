// /components/dialogs/addBookApi.tsx
import {useState, useEffect, useCallback} from "react";
import {debounce} from "lodash";
import axios from "axios";

export const useBookApi = () => {
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");
	const [mainCover, setMainCover] = useState("");
	const [otherCovers, setOtherCovers] = useState<string[]>([]);
	const [searching, setSearching] = useState(false);

	const resetForm = () => {
		setTitle("");
		setAuthor("");
		setMainCover("");
		setOtherCovers([]);
	};

	const handleAddClick = () => {
		resetForm();
	};

	useEffect(() => {
		if (!title && !author) {
			resetForm();
		}
	}, [title, author]);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);
		fetchBookCover(newTitle, author);
	};

	const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newAuthor = e.target.value;
		setAuthor(newAuthor);
		fetchBookCover(title, newAuthor);
	};

	const fetchBookCover = useCallback(
		debounce(async (title: string, author: string) => {
			if (title && author) {
				try {
					setSearching(true);
					const response = await axios.get(
						`${
							process.env.REACT_APP_SERVER_URL
						}/api/openlib/bookcovers?title=${encodeURIComponent(
							title
						)}&author=${encodeURIComponent(author)}`
					);
					if (response.data) {
						setMainCover(response.data.mainCover);
						setOtherCovers(response.data.otherCovers);
					}
				} catch (error) {
					console.error("Failed to fetch book cover:", error);
				} finally {
					setSearching(false);
				}
			}
		}, 500), // 500ms debounce time
		[]
	);

	return {
		title,
		author,
		mainCover,
		otherCovers,
		searching,
		resetForm,
		handleTitleChange,
		handleAuthorChange,
		handleAddClick,
		fetchBookCover,
	};
};
