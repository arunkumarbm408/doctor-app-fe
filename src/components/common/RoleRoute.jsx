import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ roles, children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
