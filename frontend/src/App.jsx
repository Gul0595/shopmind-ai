import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardLayout from "./pages/DashboardLayout";
import Overview from "./pages/Overview";
import Catalog from "./pages/Catalog";
import Analytics from "./pages/Analytics";
import Widget from "./pages/Widget";
import Preview from "./pages/Preview";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Overview />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="widget" element={<Widget />} />
            <Route path="preview" element={<Preview />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
