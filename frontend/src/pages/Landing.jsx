import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="l-nav">
        <span className="l-logo">ShopMind<span className="dot">.ai</span></span>
        <div className="l-nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <Link to="/login" className="l-login">Login</Link>
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
        </div>
      </nav>

      <section className="l-hero">
        <div className="l-badge">AI-Powered Shopping Assistant</div>
        <h1>Your customers ask.<br />ShopMind answers.</h1>
        <p>Add an AI product recommendation chatbot to your store in 5 minutes. Upload your catalog, get an embed code, watch conversions grow.</p>
        <div className="l-actions">
          <Link to="/signup" className="btn-primary">Start for Free</Link>
          <a href="#how" className="btn-ghost">See how it works →</a>
        </div>
        <div className="l-demo">
          <div className="demo-msg bot">Hi! I'm ShopMind 👋 What are you looking for today?</div>
          <div className="demo-msg user">Wireless headphones under ₹5000</div>
          <div className="demo-msg bot">Found 3 great options! The OnePlus Buds Z2 at ₹3,499 is your best bet — great bass and 30hr battery. ✨</div>
        </div>
      </section>

      <section className="l-features" id="features">
        <h2>Everything you need</h2>
        <div className="l-feat-grid">
          {[
            { icon:"🧠", title:"Understands natural language", desc:"Customers ask in plain language — 'something for gifting under ₹2000' — and get accurate results instantly." },
            { icon:"📦", title:"Upload your catalog", desc:"Drop a CSV of your products. The AI learns your entire catalog in seconds. No coding needed." },
            { icon:"🌐", title:"Web search fallback", desc:"If a product isn't in your catalog, AI searches the web and shows real alternatives." },
            { icon:"📊", title:"Analytics dashboard", desc:"See what customers are searching for. Discover gaps. Stock better products." },
            { icon:"🔌", title:"One-line embed", desc:"Copy one script tag into your website. Works with Shopify, Wix, WordPress, anything." },
            { icon:"🔒", title:"Secure & private", desc:"Every business's data is fully isolated. Customer queries never shared across accounts." },
          ].map((f) => (
            <div className="l-feat-card" key={f.title}>
              <span className="l-feat-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-how" id="how">
        <h2>Up and running in 3 steps</h2>
        <div className="l-steps">
          {[
            { n:"01", title:"Sign up & upload catalog", desc:"Create your account and upload your product CSV. Takes 2 minutes." },
            { n:"02", title:"Copy your embed code", desc:"Get a single script tag from your dashboard." },
            { n:"03", title:"Paste on your website", desc:"Your AI shopping assistant is live. That's it." },
          ].map((s) => (
            <div className="l-step" key={s.n}>
              <span className="l-step-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="l-pricing" id="pricing">
        <h2>Simple pricing</h2>
        <div className="l-price-grid">
          {[
            { plan:"Free", price:"₹0", period:"/month", features:["Up to 100 products","500 chats/month","Basic analytics","Embed widget"], cta:"Get Started", hi:false },
            { plan:"Pro", price:"₹999", period:"/month", features:["Unlimited products","10,000 chats/month","Full analytics","Web search fallback","Priority support"], cta:"Start Pro", hi:true },
            { plan:"Enterprise", price:"Custom", period:"", features:["Unlimited everything","Custom AI training","SLA guarantee","Dedicated support"], cta:"Contact Us", hi:false },
          ].map((p) => (
            <div className={`l-price-card ${p.hi ? "hi" : ""}`} key={p.plan}>
              {p.hi && <span className="l-popular">Most Popular</span>}
              <h3>{p.plan}</h3>
              <div className="l-price">{p.price}<span>{p.period}</span></div>
              <ul>{p.features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
              <Link to="/signup" className={p.hi ? "btn-primary" : "btn-outline"}>{p.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="l-footer">
        <span className="l-logo">ShopMind<span className="dot">.ai</span></span>
        <p>© 2025 ShopMind.ai · Built with ❤️ and Groq + Llama</p>
      </footer>
    </div>
  );
}
