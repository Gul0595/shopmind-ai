import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import OnboardingBanner from "../components/OnboardingBanner";

export default function Overview() {
  const { org } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.summary()
      .then((d) => setSummary(d.summary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Total Chats",      value: summary?.total_chats      ?? 0,    icon: "💬" },
    { label: "Catalog Matches",  value: summary?.catalog_matches  ?? 0,    icon: "✅" },
    { label: "Web Searches",     value: summary?.web_searches     ?? 0,    icon: "🌐" },
    { label: "Match Rate",       value: summary?.match_rate != null ? `${summary.match_rate}%` : "0%", icon: "📈" },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Welcome back 👋</h1>
          <p className="page-sub">Here's how {org?.name || "your store"} is performing</p>
        </div>
      </div>

      {/* FIX 5: Onboarding banner */}
      <OnboardingBanner />

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{loading ? "..." : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <h2>Quick actions</h2>
        <div className="action-cards">
          {[
            { to:"/dashboard/catalog", icon:"📦", title:"Upload Catalog",  desc:"Add or update your products via CSV" },
            { to:"/dashboard/widget",  icon:"🔌", title:"Get Embed Code",  desc:"Copy your widget script tag" },
            { to:"/dashboard/analytics",icon:"📊",title:"View Analytics",  desc:"See what customers are searching for" },
            { to:"/dashboard/preview", icon:"◎",  title:"Preview Chat",    desc:"Test your AI assistant live" },
          ].map((a) => (
            <Link to={a.to} className="action-card" key={a.to}>
              <span>{a.icon}</span>
              <div><strong>{a.title}</strong><p>{a.desc}</p></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
