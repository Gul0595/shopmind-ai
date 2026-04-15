import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0a0a0a", color:"#e8c97d", fontFamily:"sans-serif", fontSize:"14px" }}>
      Loading...
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
