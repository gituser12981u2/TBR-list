import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	Button,
} from "@mui/material";

interface SelectedBookProps {
	selectedBook: {
		title: string;
		author: string;
		publicationDate: string;
		synopsis: string;
	} | null;
	handleClose: () => void;
}

const SelectedBookDialog: React.FC<SelectedBookProps> = ({
	selectedBook,
	handleClose,
}) => (
	<Dialog
		open={selectedBook !== null}
		onClose={handleClose}
		fullWidth
		maxWidth="sm"
	>
		<DialogTitle>{selectedBook && selectedBook.title}</DialogTitle>
		<DialogContent>
			{selectedBook && (
				<>
					<Box
						component="h2"
						sx={{fontSize: "1.5em", fontWeight: "bold", marginBottom: 2}}
					>
						{selectedBook.author}
					</Box>
					<Box component="p" sx={{color: "gray.500", marginBottom: 2}}>
						Publication Date: {selectedBook.publicationDate}
					</Box>
					<Box component="p" sx={{color: "gray.500", overflowY: "auto"}}>
						Synopsis: {selectedBook.synopsis}
					</Box>
				</>
			)}
		</DialogContent>
		<DialogActions>
			<Button onClick={handleClose}>Close</Button>
		</DialogActions>
	</Dialog>
);

export default SelectedBookDialog;
