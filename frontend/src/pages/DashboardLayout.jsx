import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "◈", end: true },
  { to: "/dashboard/catalog", label: "Catalog", icon: "⊞" },
  { to: "/dashboard/analytics", label: "Analytics", icon: "◉" },
  { to: "/dashboard/widget", label: "Embed Widget", icon: "⌘" },
  { to: "/dashboard/preview", label: "Preview Chat", icon: "◎" },
];

export default function DashboardLayout() {
  const { user, org, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dash-wrap">
      <aside className="dash-sidebar">
        <div className="dash-logo">ShopMind<span className="dot">.ai</span></div>
        <div className="dash-org">
          <div className="org-avatar">{org?.name?.[0]?.toUpperCase() || "B"}</div>
          <div>
            <div className="org-name">{org?.name || "Your Business"}</div>
            <div className="org-plan">{org?.plan || "free"} plan</div>
          </div>
        </div>
        <nav className="dash-nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="dash-footer">
          <div className="user-email">{user?.email}</div>
          <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>Sign out</button>
        </div>
      </aside>
      <main className="dash-main"><Outlet /></main>
    </div>
  );
}
