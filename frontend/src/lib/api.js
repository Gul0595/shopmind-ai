const BASE = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, "");

function getToken() {
  return localStorage.getItem("sm_token");
}

async function request(path, options = {}) {
  const token = getToken();
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  } catch (err) {
    // FIX 1: Network error fallback
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Make sure backend is running.");
    }
    throw err;
  }
}

export const api = {
  auth: {
    signup: (body) => request("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
    login:  (body) => request("/api/auth/login",  { method: "POST", body: JSON.stringify(body) }),
    me:     ()     => request("/api/auth/me"),
  },
  catalog: {
    upload: (file) => {
      const form = new FormData();
      form.append("file", file);
      return fetch(`${BASE}/api/catalog/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      }).then((r) => r.json());
    },
    list:      ()   => request("/api/catalog"),
    deleteAll: ()   => request("/api/catalog", { method: "DELETE" }),
    deleteOne: (id) => request(`/api/catalog/${id}`, { method: "DELETE" }),
  },
  chat: {
    send: (message) => request("/api/chat", { method: "POST", body: JSON.stringify({ message }) }),
  },
  analytics: {
    summary: () => request("/api/analytics/summary"),
    recent:  () => request("/api/analytics/recent"),
  },
  widget: {
    config:        () => request("/api/widget/config"),
    regenerateKey: () => request("/api/widget/regenerate-key", { method: "POST" }),
  },
  onboarding: {
    get:     () => request("/api/onboarding"),
    advance: () => request("/api/onboarding/advance", { method: "POST" }),
  },
};
