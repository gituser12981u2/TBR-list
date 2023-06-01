// TBR.tsx
import React, {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";

import {TransitionGroup, CSSTransition} from "react-transition-group";

import {Book} from "./types";
import {SettingsContext} from "../context/SettingsContext";
import {useSettingsHandler} from "./settings/settingsHandler";

import {useAuth} from "../context/AuthContext";
import {fetchBooks, deleteBook} from "./apiBooks";

import SelectedBookDialog from "./dialogs/SelectedBookDialog";
import AddBookDialog from "./dialogs/AddBookDialog";
import SettingsDialog from "./settings/SettingsDialog";

import {
	Button,
	TextField,
	AppBar,
	Toolbar,
	IconButton,
	Box,
	Grid,
	Menu,
	MenuItem,
} from "@mui/material";
import {
	Delete as DeleteIcon,
	Settings as SettingsIcon,
	FilterList as FilterListIcon,
} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";
import {red} from "@mui/material/colors";

// Custom hover color for buttons
const hoverColor = "#ff4500";

const TBR: React.FC = () => {
	const {isAuthenticated} = useAuth();
	const {settings} = useContext(SettingsContext);
	const theme = useTheme();
	const navigate = useNavigate();

	const [books, setBooks] = useState<Book[]>([]);

	const {
		anchorEl,
		handleFilterClick,
		handleFilterClose,
		handleFilterByDate,
		handleFilterByAuthor,
		handleFilterByTitle,
		// styles
		listStyle,
		gridStyle,
		compactStyle,
	} = useSettingsHandler(books, setBooks);

	const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
	const [selectedBook, setSelectedBook] = useState<{
		title: string;
		author: string;
		publicationDate: string;
		synopsis: string;
	} | null>(null);

	const [openAddDialog, setOpenAddDialog] = useState(false);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	useEffect(() => {
		const fetchBooksFromAPI = async () => {
			try {
				setLoading(true);
				const books = await fetchBooks();
				setBooks(books);
			} catch (err) {
				setError((err as Error).message);
			} finally {
				setLoading(false);
			}
		};
		fetchBooksFromAPI();
	}, []);

	const [addHover, setAddHover] = useState(false);

	const handleAddBook = (book: Book) => {
		setBooks((prevBooks) => [...prevBooks, book]);
	};

	const handleDeleteBook = async (book: Book) => {
		try {
			await deleteBook(book._id);
			setBooks(books.filter((b) => b._id !== book._id));
		} catch (error) {
			console.log("Falied to delete book:", error);
		}
	};

	const handleBookClick = (book: Book) => {
		setSelectedBook(book);
	};

	const handleClose = () => {
		setSelectedBook(null);
	};

	const handleCloseAdd = () => {
		setOpenAddDialog(false);
	};

	const handleAddClick = () => {
		setOpenAddDialog(true);
	};

	let containerStyle: typeof listStyle | typeof gridStyle | typeof compactStyle;
	switch (settings.viewMode) {
		case "list":
			containerStyle = listStyle;
			break;
		case "grid":
			containerStyle = gridStyle;
			break;
		case "compact":
			containerStyle = compactStyle;
			break;
		default:
			containerStyle = listStyle;
	}

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.default,
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				overflow: "auto",
				"&::-webkit-scrollbar": {
					width: "12px",
					opacity: 0,
					transition: "opacity 0.2s",
				},
				"&::-webkit-scrollbar-track": {
					backgroundColor: theme.palette.background.default,
					borderRadius: "10px",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: theme.palette.grey[500],
					borderRadius: "10px",
					opacity: 0,
					transition: "opacity 0.2s",
				},
				"&:hover::-webkit-scrollbar-thumb": {
					backgroundColor: theme.palette.grey[700],
					opacity: 1,
				},
			}}
		>
			{loading && <div>Loading...</div>}
			{error && <div>Error</div>}
			{books.length === 0 && <div>No books found</div>}
			<AppBar
				position="static"
				sx={{
					backgroundColor: theme.palette.background.default, // bisque color
					color: theme.palette.text.primary,
				}}
			>
				<Toolbar>
					<TextField
						id="outlined-search"
						label="Search field"
						type="search"
						variant="outlined"
						sx={{marginRight: 2, flexGrow: 1}}
					/>
					<Box display="flex" justifyContent="space-between">
						<IconButton
							color="inherit"
							aria-label="settings"
							onClick={() => setOpenSettingsDialog(true)}
							sx={{
								color: theme.palette.mode === "dark" ? "white" : "black",
								":hover": {
									color: hoverColor,
								},
							}}
						>
							<SettingsIcon />
						</IconButton>
						<Menu
							id="filter-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleFilterClose}
						>
							<MenuItem onClick={handleFilterByDate}>By Date</MenuItem>
							<MenuItem onClick={handleFilterByAuthor}>By Author</MenuItem>
							<MenuItem onClick={handleFilterByTitle}>By Title</MenuItem>
							<MenuItem onClick={handleFilterClose}>Custom</MenuItem>
						</Menu>
					</Box>
				</Toolbar>
			</AppBar>
			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					alignItems: "center",
					marginRight: 2,
					marginBottom: 6,
				}}
			>
				<IconButton
					color="inherit"
					aria-label="filter"
					onClick={handleFilterClick}
					sx={{
						color: theme.palette.mode === "dark" ? "white" : "black",
						":hover": {
							color: hoverColor,
						},
					}}
				>
					<FilterListIcon />
				</IconButton>
				<Button
					variant="contained"
					color={addHover ? "secondary" : "primary"}
					aria-label="add"
					onMouseEnter={() => setAddHover(true)}
					onMouseLeave={() => setAddHover(false)}
					onClick={handleAddClick}
				>
					Add
				</Button>
			</Box>
			<Grid container spacing={2}>
				{books.map((book) => (
					<Grid
						item
						xs={12}
						sm={
							settings.viewMode === "compact"
								? 4
								: settings.viewMode === "gallery"
								? 6
								: 12
						}
					>
						<Box
							key={book.title}
							sx={containerStyle}
							onClick={() => handleBookClick(book)}
						>
							<TransitionGroup>
								<CSSTransition
									key={book.coverImageUrl}
									classNames="fade"
									timeout={{enter: 500, exit: 300}}
								>
									<Box
										component="img"
										src={book.coverImageUrl}
										alt={book.title}
										sx={{
											marginRight: 4,
											borderRadius: "10%",
											width: "100px",
											height: "150px",
										}}
									/>
								</CSSTransition>
							</TransitionGroup>
							<Box>
								<Box
									component="h2"
									sx={{
										fontSize: "1.5em",
										fontWeight: "bold",
										color: theme.palette.text.primary,
									}}
								>
									{book.title}
								</Box>
								<Box component="p" sx={{color: theme.palette.text.secondary}}>
									{book.author}
								</Box>
							</Box>
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									handleDeleteBook(book);
								}}
								sx={{
									marginLeft: "auto",
									":hover": {
										color: red,
									},
								}}
							>
								<DeleteIcon />
							</IconButton>
						</Box>
					</Grid>
				))}
			</Grid>

			<SelectedBookDialog
				selectedBook={selectedBook}
				handleClose={handleClose}
			/>
			<AddBookDialog
				open={openAddDialog}
				handleCloseAdd={handleCloseAdd}
				handleAddBook={handleAddBook}
			/>

			<SettingsDialog
				open={openSettingsDialog}
				handleClose={() => setOpenSettingsDialog(false)}
			/>
		</Box>
	);
};

export default TBR;
