import { Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AuthLayout from "../components/layouts/AuthLayout";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/collab/Dashboard";
import Teams from "../pages/collab/Teams";
import Documents from "../pages/collab/Documents";
import Settings from "../pages/collab/Settings";
import DocumentEditorPage from "../pages/documents/DocumentEditor";

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
      path: "/collab",
      element: <DashboardLayout />,  // Use the new Dashboard layout
      children: [
        { path: "", element: <Dashboard /> },
        { path: "teams", element: <Teams /> },
        { path: "documents", element: <Documents /> },
        { path: "settings", element: <Settings /> },
      ],
    },
    {
        path: '/doc',
        element: <DocumentEditorPage />
    },
    { path: "*", element: <Navigate to="/login" replace /> },
  ]);

  return elements;
};
