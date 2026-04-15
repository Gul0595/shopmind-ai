import { useState, useRef, useEffect } from "react";
import { api } from "../lib/api";

export default function Preview() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your ShopMind assistant 👋 Ask me anything about your products.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState([]);
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);
    setMessages((p) => [...p, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await api.chat.send(text);

      if (res.code === "LIMIT_REACHED") {
        setError(res.error);
        setMessages((p) => [...p, { role: "bot", text: res.error }]);
        return;
      }

      setMessages((p) => [
        ...p,
        { role: "bot", text: res.message || "Here are my picks!" },
      ]);

      setHighlights(res.highlight_ids || []);
      if (res.usage) setUsage(res.usage);

    } catch (err) {
      const msg =
        err.message?.includes("connect")
          ? "Cannot reach server. Is your backend running?"
          : "Something went wrong. Please try again.";

      setMessages((p) => [...p, { role: "bot", text: msg }]);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Preview Chat</h1>
          <p className="page-sub">
            Test your AI assistant with your live catalog
          </p>
        </div>
      </div>

      {/* Usage warning */}
      {usage && usage.remaining < 50 && (
        <div className="alert error" style={{ marginBottom: 16 }}>
          ⚠️ Only <strong>{usage.remaining}</strong> chats remaining this month
        </div>
      )}

      {/* No catalog warning */}
      {error && error.includes("No products") && (
        <div className="alert error">
          No catalog uploaded yet.{" "}
          <a href="/dashboard/catalog">Upload your CSV →</a>
        </div>
      )}

      <div className="preview-wrap">
        {/* CHAT PANEL */}
        <div className="preview-chat">
          <div className="preview-messages">
            {messages.map((m, i) => (
              <div key={i} className={`pmsg ${m.role}`}>
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="pmsg bot typing">
                <span />
                <span />
                <span />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="preview-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Try: show me clothing items"
              disabled={loading}
            />
            <button onClick={send} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        </div>

        {/* 🔥 HIGHLIGHTS PANEL (FINAL PRODUCT CARDS) */}
        {highlights.length > 0 && (
          <div className="preview-highlights">
            <h3>AI highlighted products</h3>

            <div className="highlight-pills">
              {highlights.map((item, i) => (
                <div key={i} className="product-card">
                  <div className="product-name">{item.name}</div>
                  <div className="product-price">₹{item.price}</div>
                </div>
              ))}
            </div>

            <p className="hint">
              These are products recommended by AI
            </p>

            {usage && (
              <div style={{ marginTop: 12, fontSize: 12 }}>
                Chats remaining: {usage.remaining} / {usage.limit}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}