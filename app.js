import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Movements from "@/pages/Movements";
import Orders from "@/pages/Orders";
import Store from "@/pages/Store";
import MyOrders from "@/pages/MyOrders";
import Reports from "@/pages/Reports";
import UsersPage from "@/pages/UsersPage";
import SettingsPage from "@/pages/SettingsPage";

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-muted border-t-[color:var(--f3-primary)] rounded-full animate-spin" />
  </div>
);

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app/store" replace />;
  return <Layout>{children}</Layout>;
}

function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "merchant" ? "/app/store" : "/app"} replace />;
}

function AppRoutes() {
  const location = useLocation();
  if (location.hash?.includes("session_id=")) return <AuthCallback />;
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<Protected roles={["admin", "staff"]}><Dashboard /></Protected>} />
      <Route path="/app/products" element={<Protected roles={["admin", "staff"]}><Products /></Protected>} />
      <Route path="/app/movements" element={<Protected roles={["admin", "staff"]}><Movements /></Protected>} />
      <Route path="/app/orders" element={<Protected roles={["admin", "staff"]}><Orders /></Protected>} />
      <Route path="/app/reports" element={<Protected roles={["admin", "staff"]}><Reports /></Protected>} />
      <Route path="/app/store" element={<Protected><Store /></Protected>} />
      <Route path="/app/my-orders" element={<Protected roles={["merchant"]}><MyOrders /></Protected>} />
      <Route path="/app/users" element={<Protected roles={["admin"]}><UsersPage /></Protected>} />
      <Route path="/app/settings" element={<Protected roles={["admin"]}><SettingsPage /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <AppRoutes />
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;


