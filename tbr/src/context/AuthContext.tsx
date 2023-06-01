// src/context/AuthContext.tsx
import {createContext, useContext, useState} from "react";

interface AuthContextProps {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

export const useAuth = () => {
	return useContext(AuthContext);
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
		!!localStorage.getItem("token")
	);

	const login = () => {
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{isAuthenticated, login, logout}}>
			{children}
		</AuthContext.Provider>
	);
};
