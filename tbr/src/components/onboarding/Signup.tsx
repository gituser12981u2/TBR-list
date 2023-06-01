// components/onboarding/Signup.tsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import {useTheme} from "@mui/material/styles";

import {Link as RouterLink} from "react-router-dom";
import axios, {AxiosError} from "axios";
import {
	Button,
	TextField,
	Container,
	Box,
	Typography,
	Snackbar,
} from "@mui/material";
import {styled} from "@mui/system";

interface ErrorData {
	message: string;
}

const Signup = () => {
	const theme = useTheme();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/signup`,
				{
					email,
					password,
				}
			);
			localStorage.setItem("token", response.data.token);
			navigate("/main");
		} catch (error) {
			const axiosError = error as AxiosError<ErrorData>;
			if (axiosError.response) {
				setSnackbarMessage(axiosError.response.data.message);
				setEmailError(true);
				setPasswordError(true);
			} else {
				console.error("Signup failed:", error);
			}
			setSnackbarOpen(true);
		}
	};

	const StyledSnackbar = styled(Snackbar)(() => ({
		"& .MuiSnackbar-root": {
			backgroundColor: theme.palette.error.main,
			color: theme.palette.error.contrastText,
			borderRadius: "4px",
			animation: "$slideIn 0.5s ease-in-out",
			"@keyframes slideIn": {
				"0%": {
					transform: "translateY(100vh)",
				},
				"100%": {
					transform: "translateY(0)",
				},
			},
		},
	}));

	const StyledLink = styled(RouterLink)({
		position: "absolute",
		right: 16,
		top: 16,
		color: "inhernt",
		textDecoration: "none",
	});

	const StyledBox = styled(Box)(({theme}) => ({
		backgroundColor: theme.palette.background.paper,
		borderRadius: theme.shape.borderRadius,
		padding: theme.spacing(3),
		marginTop: theme.spacing(2),
	}));

	return (
		<Box
			sx={{
				position: "absolute",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<StyledLink to="/login">
				<Button variant="contained">Login</Button>
			</StyledLink>
			<Container
				component="main"
				maxWidth="xs"
				sx={{
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					position: "relative",
				}}
			>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
					<Typography component="h1" variant="h5" sx={{textAlign: "center"}}>
						Signup
					</Typography>
					<TextField
						error={emailError}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						InputProps={{style: {color: "black"}}}
						InputLabelProps={{style: {color: "black"}}}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(false);
						}}
					/>
					<TextField
						error={passwordError}
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						InputProps={{style: {color: "black"}}}
						InputLabelProps={{style: {color: "black"}}}
						onChange={(e) => {
							setPassword(e.target.value);
							setPasswordError(false);
						}}
					/>
					<StyledSnackbar
						open={snackbarOpen}
						autoHideDuration={6000}
						message={snackbarMessage}
						onClose={() => setSnackbarOpen(false)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{mt: 3, mb: 2}}
					>
						Signup
					</Button>
				</Box>
			</Container>
		</Box>
	);
};

export default Signup;
