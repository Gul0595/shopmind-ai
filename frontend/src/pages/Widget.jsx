import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Widget() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    api.widget.config().then(setConfig).catch(console.error).finally(() => setLoading(false));
  }, []);

  const copy = () => {
    navigator.clipboard.writeText(config.embed_snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = async () => {
    if (!confirm("This will break your current embed until you update it. Continue?")) return;
    setRegenerating(true);
    try {
      await api.widget.regenerateKey();
      const updated = await api.widget.config();
      setConfig(updated);
    } catch { alert("Failed to regenerate key."); }
    finally { setRegenerating(false); }
  };

  if (loading) return <div className="page"><div className="loading-state">Loading widget config...</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div><h1>Embed Widget</h1><p className="page-sub">Add ShopMind to your website with one line of code</p></div>
      </div>
      <div className="widget-steps">
        {[
          { n:"1", title:"Copy your embed code", desc:"This unique snippet is tied to your business catalog." },
          { n:"2", title:"Paste before </body>", desc:"Add it to your website HTML, Shopify theme, or WordPress footer." },
          { n:"3", title:"You're live!", desc:"Your AI shopping assistant appears as a chat bubble." },
        ].map((s) => (
          <div className="widget-step" key={s.n}>
            <div className="step-num">{s.n}</div>
            <div><h3>{s.title}</h3><p>{s.desc}</p></div>
          </div>
        ))}
      </div>
      <div className="embed-box">
        <div className="embed-header">
          <span>Your embed snippet</span>
          <button className="copy-btn" onClick={copy}>{copied ? "Copied ✓" : "Copy"}</button>
        </div>
        <pre className="embed-code">{config?.embed_snippet}</pre>
      </div>
      <div className="widget-security">
        <h3>Security</h3>
        <div className="security-row">
          <div>
            <strong>Widget Key</strong>
            <p>Authenticates your widget. Keep it on your website only.</p>
          </div>
          <code className="key-display">{config?.widget_key}</code>
        </div>
        <button className="btn-outline-danger sm" onClick={regenerate} disabled={regenerating}>
          {regenerating ? "Regenerating..." : "Regenerate Key"}
        </button>
        <p className="regen-warning">⚠️ Regenerating will break your current embed until you update it.</p>
      </div>
    </div>
  );
}
