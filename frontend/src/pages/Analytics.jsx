import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { api } from "../lib/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.analytics.summary(), api.analytics.recent()])
      .then(([s, r]) => { setData(s); setRecent(r.events || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="loading-state">Loading analytics...</div></div>;

  const { summary, chart, top_queries } = data || {};

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Analytics</h1><p className="page-sub">Last 30 days</p></div>
      </div>
      <div className="stats-grid">
        {[
          { label:"Total Chats", value:summary?.total_chats ?? 0, icon:"💬" },
          { label:"Catalog Matches", value:summary?.catalog_matches ?? 0, icon:"✅" },
          { label:"Web Searches", value:summary?.web_searches ?? 0, icon:"🌐" },
          { label:"Match Rate", value:`${summary?.match_rate ?? 0}%`, icon:"📈" },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="analytics-grid">
        <div className="analytics-card wide">
          <h3>Daily Chats</h3>
          {chart?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="date" tick={{ fill:"#666", fontSize:11 }} />
                <YAxis tick={{ fill:"#666", fontSize:11 }} />
                <Tooltip contentStyle={{ background:"#181818", border:"1px solid #333", color:"#eee", fontSize:12 }} />
                <Line type="monotone" dataKey="count" stroke="#e8c97d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="no-data">No chat data yet. Share your widget to start seeing activity.</div>}
        </div>
        <div className="analytics-card">
          <h3>Top Searches</h3>
          {top_queries?.length > 0 ? (
            <ul className="top-queries">
              {top_queries.map((q, i) => (
                <li key={i}><span className="query-text">{q.query}</span><span className="query-count">{q.count}x</span></li>
              ))}
            </ul>
          ) : <div className="no-data">No searches yet.</div>}
        </div>
        <div className="analytics-card">
          <h3>Recent Activity</h3>
          {recent.length > 0 ? (
            <ul className="recent-list">
              {recent.slice(0, 15).map((e) => (
                <li key={e.id} className="recent-item">
                  <span className="recent-query">{e.query}</span>
                  <div className="recent-meta">
                    <span className={`match-pill ${e.matched ? "yes" : "no"}`}>{e.matched ? "matched" : "no match"}</span>
                    {e.used_web_search && <span className="web-pill">web</span>}
                    <span className="recent-time">{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <div className="no-data">No activity yet.</div>}
        </div>
      </div>
    </div>
  );
}
