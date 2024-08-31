import { Navigate, useRoutes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AuthLayout from "./components/layouts/AuthLayout";
import ResetPassword from "./pages/Auth/ResetPassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Collab from "./pages/collab/Collab";

export const AppRoutes = () => {
  const elements = useRoutes([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "", element: <Navigate to="login" replace /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "verify-email", element: <VerifyEmail /> },
        { path: "*", element: <Navigate to="login" replace /> },
      ],
    },
    {
      path:"/collab", 
      element : <Collab/>
    },
    { path: "*", element: <Navigate to="/login" replace /> },
  ]);

  return elements;
};
