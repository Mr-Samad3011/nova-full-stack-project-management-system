import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user: currentUser } = useAuth();

  const role = String(
    currentUser?.role || ""
  )
    .trim()
    .toUpperCase();

  // ---------------------------------------------
  // ADMIN CHECK
  // ---------------------------------------------

  if (role !== "ADMIN") {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;