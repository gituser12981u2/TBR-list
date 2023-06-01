// themes.ts
import {createTheme} from "@mui/material/styles";

export const lightTheme = createTheme({
	palette: {
		mode: "light",
		action: {
			active: "#1976d2", // make icons blue
		},
		error: {
			main: "#f44336",
			contrastText: "#fff",
		},
	},
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		error: {
			main: "#f44336",
			contrastText: "#fff",
		},
	},
});

export const highContrastTheme = createTheme({
	palette: {
		mode: "light",
		action: {
			active: "#000000",
		},
		error: {
			main: "#f44336",
			contrastText: "#fff",
		},
		background: {
			default: "#fff",
		},
		text: {
			primary: "#000000",
		},
	},
});
