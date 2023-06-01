// components/onboarding/Login.tsx
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Button, TextField, Container, Box, Typography} from "@mui/material";

import {useTheme} from "@mui/material/styles";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const response = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/login`,
				{
					email,
					password,
				}
			);

			localStorage.setItem("token", response.data.token);
			navigate("/main");
		} catch (error) {
			console.log("Loginfailed:", error);
		}
	};

	return (
		<Container
			component="main"
			maxWidth="xs"
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
			}}
		>
			<Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 1}}>
				<Typography component="h1" variant="h5">
					Login
				</Typography>
				<TextField
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
					onChange={(e) => setEmail(e.target.value)}
				/>
				<TextField
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
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					sx={{mt: 3, mb: 2}}
				>
					Login
				</Button>
			</Box>
		</Container>
	);
};

export default Login;
