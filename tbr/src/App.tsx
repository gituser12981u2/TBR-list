// App.tsx
import {Routes, Route, useNavigate} from "react-router-dom";
import {ThemeProvider} from "@mui/material/styles";
import {useContext, useEffect} from "react";
import {SettingsContext} from "./context/SettingsContext";
import {darkTheme, lightTheme} from "./themes";
import TBR from "./components/TBR";

import Signup from "./components/onboarding/Signup";
import Login from "./components/onboarding/Login";
import {AuthProvider} from "./context/AuthContext";

function App() {
	const {settings} = useContext(SettingsContext);
	const theme = settings.darkMode ? darkTheme : lightTheme;
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			navigate("/main");
		}
	}, [navigate]);

	return (
		<AuthProvider>
			<ThemeProvider theme={theme}>
				<Routes>
					<Route path="/" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/main" element={<TBR />} />
				</Routes>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default App;
