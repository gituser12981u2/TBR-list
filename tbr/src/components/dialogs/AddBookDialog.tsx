// /components/dialogs/AddBookDialog.tsx
import React, {useRef} from "react";
import {Book} from "../types";
import {useBookApi} from "./addBookApi";
import {Transition} from "@headlessui/react";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	TextField,
	Button,
	IconButton,
} from "@mui/material";
import {
	NavigateNext as NavigateNextIcon,
	NavigateBefore as NavigateBeforeIcon,
} from "@mui/icons-material";
import axios from "axios";

const AddBookDialog: React.FC<{
	open: boolean;
	handleCloseAdd: () => void;
	handleAddBook: (book: Book) => void;
}> = ({open, handleCloseAdd, handleAddBook}) => {
	const {
		title,
		author,
		mainCover,
		otherCovers,
		searching,
		resetForm,
		handleTitleChange,
		handleAuthorChange,
		handleAddClick,
	} = useBookApi();

	const imageBoxRef = useRef<HTMLDivElement>(null);

	const handleSubmit = async () => {
		handleAddClick();
		const token = localStorage.getItem("token");

		if (token) {
			try {
				const response = await axios.post(
					`${process.env.REACT_APP_SERVER_URL}/api/bookprints`,
					{
						title,
						author,
						coverImageUrl: mainCover || "https://via.placeholder.com/180x250",
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (response.status === 200) {
					const newBook = response.data;
					newBook.coverUrl = mainCover;
					handleAddBook(newBook);
					console.log(newBook);
					handleCloseAdd();
				} else {
					// handle error
					console.log("Error status: ", response.status);
				}
			} catch (err) {
				console.error("Error", (err as Error).message);
			}
		}
	};

	const handleCancel = () => {
		handleCloseAdd();
		resetForm();
	};

	const scrollImageBox = (dx: number) => {
		if (imageBoxRef.current) {
			imageBoxRef.current.scrollLeft += dx;
		}
	};

	return (
		<Dialog open={open} onClose={handleCloseAdd} fullWidth maxWidth="sm">
			<DialogTitle>Add a Book</DialogTitle>
			<DialogContent>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						flexDirection: "column",
						gap: 2,
					}}
				>
					<TextField
						label="Book Title"
						variant="outlined"
						fullWidth
						value={title}
						onChange={handleTitleChange}
					/>
					<TextField
						label="Author"
						variant="outlined"
						fullWidth
						value={author}
						onChange={handleAuthorChange}
					/>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							gap: 1,
						}}
					>
						<Transition
							show={!!mainCover}
							enter="transition-opacity duration-500"
							enterFrom="opacity-0"
							enterTo="opacity-100"
						>
							<Box
								sx={{
									width: 180,
									height: 250,
									background: `url("${mainCover}")`,
									marginBottom: 2,
								}}
							/>
						</Transition>
						{!mainCover && (
							<p>Enter a book's title and author to view the cover here.</p>
						)}
						{otherCovers.length > 0 && (
							<Box sx={{display: "flex", overflowX: "auto"}} ref={imageBoxRef}>
								<IconButton onClick={() => scrollImageBox(-30)}>
									<NavigateBeforeIcon />
								</IconButton>
								{otherCovers.map((src, index) => (
									<Box
										key={index}
										sx={{width: 30, height: 50, background: `url("${src}")`}}
									/>
								))}
								<IconButton onClick={() => scrollImageBox(30)}>
									<NavigateNextIcon />
								</IconButton>
							</Box>
						)}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={handleSubmit} color="primary" disabled={searching}>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AddBookDialog;
