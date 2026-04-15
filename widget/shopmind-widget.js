(function () {
  "use strict";

  const config = window.ShopMindConfig || {};
  const ORG_ID = config.orgId;
  const WIDGET_KEY = config.widgetKey;
  const BACKEND = (config.backendUrl || "").replace(/\/$/, "");

  if (!ORG_ID || !WIDGET_KEY || !BACKEND) {
    console.warn("ShopMind: Missing config. Check orgId, widgetKey, backendUrl.");
    return;
  }

  const css = `
    #sm-bubble {
      position:fixed;bottom:24px;right:24px;z-index:99999;
      width:56px;height:56px;border-radius:50%;
      background:#e8c97d;color:#1a1200;font-size:24px;
      cursor:pointer;border:none;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 20px rgba(0,0,0,0.4);
      transition:transform 0.2s;
    }
    #sm-bubble:hover{transform:scale(1.08);}
    #sm-panel {
      position:fixed;bottom:92px;right:24px;z-index:99999;
      width:340px;height:480px;
      background:#111;border:1px solid #2a2a2a;border-radius:16px;
      display:flex;flex-direction:column;overflow:hidden;
      box-shadow:0 8px 40px rgba(0,0,0,0.5);
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      transition:opacity 0.2s,transform 0.2s;
    }
    #sm-panel.sm-hidden{opacity:0;transform:translateY(12px);pointer-events:none;}
    #sm-head{padding:14px 16px;border-bottom:1px solid #222;display:flex;align-items:center;justify-content:space-between;background:#0e0e0e;}
    #sm-head .sm-title{font-size:14px;font-weight:500;color:#e8c97d;}
    #sm-head .sm-close{background:none;border:none;color:#555;font-size:18px;cursor:pointer;padding:0 4px;}
    #sm-head .sm-close:hover{color:#eee;}
    #sm-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;}
    #sm-msgs::-webkit-scrollbar{width:3px;}
    #sm-msgs::-webkit-scrollbar-thumb{background:#2a2a2a;}
    .sm-m{max-width:88%;padding:9px 13px;border-radius:14px;font-size:13px;line-height:1.5;}
    .sm-m.bot{background:#1a1a1a;color:#eee;border-bottom-left-radius:4px;align-self:flex-start;}
    .sm-m.user{background:#e8c97d;color:#1a1200;font-weight:500;border-bottom-right-radius:4px;align-self:flex-end;}
    .sm-m.typing{display:flex;gap:4px;align-items:center;padding:12px 14px;}
    .sm-m.typing span{display:block;width:6px;height:6px;border-radius:50%;background:#555;animation:sm-b 1s infinite;}
    .sm-m.typing span:nth-child(2){animation-delay:0.2s;}
    .sm-m.typing span:nth-child(3){animation-delay:0.4s;}
    @keyframes sm-b{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
    #sm-inp-area{padding:10px;border-top:1px solid #1e1e1e;display:flex;gap:8px;}
    #sm-inp{flex:1;background:#1a1a1a;border:1px solid #2a2a2a;color:#eee;padding:8px 12px;border-radius:10px;font-size:13px;outline:none;font-family:inherit;}
    #sm-inp::placeholder{color:#444;}
    #sm-inp:focus{border-color:#c9a84c;}
    #sm-send{background:#e8c97d;color:#1a1200;border:none;border-radius:10px;width:34px;height:34px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;}
    #sm-send:hover{background:#c9a84c;}
    #sm-send:disabled{opacity:0.5;cursor:not-allowed;}
    #sm-brand{text-align:center;font-size:10px;color:#333;padding:6px 0 8px;background:#0e0e0e;border-top:1px solid #1a1a1a;}
    #sm-brand a{color:#555;text-decoration:none;}
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const bubble = document.createElement("button");
  bubble.id = "sm-bubble";
  bubble.innerHTML = "🛍️";
  bubble.title = "Chat with AI Shopping Assistant";

  const panel = document.createElement("div");
  panel.id = "sm-panel";
  panel.className = "sm-hidden";
  panel.innerHTML = `
    <div id="sm-head">
      <span class="sm-title">AI Shopping Assistant</span>
      <button class="sm-close" id="sm-close">✕</button>
    </div>
    <div id="sm-msgs"></div>
    <div id="sm-inp-area">
      <input id="sm-inp" placeholder="What are you looking for?" />
      <button id="sm-send">↑</button>
    </div>
    <div id="sm-brand">Powered by <a href="https://shopmind.ai" target="_blank">ShopMind.ai</a></div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const msgsEl = panel.querySelector("#sm-msgs");
  const inpEl = panel.querySelector("#sm-inp");
  const sendBtn = panel.querySelector("#sm-send");
  let isOpen = false;
  let loading = false;

  function addMsg(role, text) {
    const d = document.createElement("div");
    d.className = `sm-m ${role}`;
    d.textContent = text;
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showTyping() {
    const d = document.createElement("div");
    d.className = "sm-m bot typing";
    d.id = "sm-typing";
    d.innerHTML = "<span></span><span></span><span></span>";
    msgsEl.appendChild(d);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function hideTyping() {
    const t = document.getElementById("sm-typing");
    if (t) t.remove();
  }

  async function send() {
    const text = inpEl.value.trim();
    if (!text || loading) return;
    inpEl.value = "";
    addMsg("user", text);
    loading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(`${BACKEND}/api/chat/widget`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-org-id": ORG_ID,
          "x-widget-key": WIDGET_KEY,
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      hideTyping();
      addMsg("bot", data.message || "Here are my recommendations!");

      window.dispatchEvent(new CustomEvent("shopmind:recommendations", {
        detail: {
          highlight_ids: data.highlight_ids || [],
          filter: data.filter,
          sort: data.sort,
          web_results: data.web_results || [],
        },
      }));
    } catch {
      hideTyping();
      addMsg("bot", "Sorry, something went wrong. Please try again.");
    } finally {
      loading = false;
      sendBtn.disabled = false;
    }
  }

  bubble.addEventListener("click", () => {
    isOpen = !isOpen;
    panel.classList.toggle("sm-hidden", !isOpen);
    if (isOpen && msgsEl.children.length === 0) {
      addMsg("bot", "Hi! 👋 I'm your AI shopping assistant. Tell me what you're looking for!");
    }
  });

  panel.querySelector("#sm-close").addEventListener("click", () => {
    isOpen = false;
    panel.classList.add("sm-hidden");
  });

  sendBtn.addEventListener("click", send);
  inpEl.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
})();
