// ProtectedRoute.tsx
import {Route, Navigate} from "react-router-dom";
import {useAuth} from "./context/AuthContext";

const ProtectedRoute = ({
	path,
	element,
}: {
	path: string;
	element: React.ReactElement;
}) => {
	const {isAuthenticated} = useAuth();
	return (
		<Route
			path={path}
			element={isAuthenticated ? element : <Navigate to="/login" />}
		/>
	);
};

export default ProtectedRoute;
