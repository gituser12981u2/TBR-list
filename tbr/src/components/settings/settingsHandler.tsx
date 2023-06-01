// components/settings/settingsHandler.tsx
import {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {Book} from "../types";

export const useSettingsHandler = (
	books: Book[],
	setBooks: (books: Book[]) => void
) => {
	const theme = useTheme();

	// filter dropdown menu
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleFilterClose = () => {
		setAnchorEl(null);
	};

	const handleFilterByDate = () => {
		setBooks(books.sort((a, b) => (a.updatedAt > b.updatedAt ? 1 : -1)));
		handleFilterClose();
	};

	const handleFilterByAuthor = () => {
		setBooks(books.sort((a, b) => a.author.localeCompare(b.author)));
		handleFilterClose();
	};

	const handleFilterByTitle = () => {
		setBooks(books.sort((a, b) => a.title.localeCompare(b.title)));
		handleFilterClose();
	};

	const listStyle = {
		display: "flex",
		alignItems: "flex-start",
		backgroundColor: theme.palette.background.paper,
		borderRadius: 1,
		padding: 4,
		marginBottom: 4,
		cursor: "pointer",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		transition: "colors 0.2s",
	};

	const gridStyle = {
		display: "flex",
		flexDirections: "column",
		alignItems: "center",
		backgroundColor: theme.palette.background.paper,
		borderRadius: 1,
		padding: 4,
		marginBottom: 4,
		cursor: "pointer",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		transition: "colors 0.2s",
	};

	const compactStyle = {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
		gap: 4,
		marginBottom: 4,
		cursor: "pointer",
		"&:hover": {
			backgroundColor: theme.palette.action.hover,
		},
		transition: "colors 0.2s",
	};

	return {
		anchorEl,
		handleFilterClick,
		handleFilterClose,
		handleFilterByDate,
		handleFilterByAuthor,
		handleFilterByTitle,
		listStyle,
		gridStyle,
		compactStyle,
	};
};
