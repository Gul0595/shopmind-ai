import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sm_token");
    if (token) {
      api.auth.me()
        .then(({ user, org }) => { setUser(user); setOrg(org); })
        .catch(() => localStorage.removeItem("sm_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login({ email, password });
    localStorage.setItem("sm_token", data.token);
    setUser(data.user);
    const { org } = await api.auth.me();
    setOrg(org);
    return data;
  };

  const signup = async (email, password, business_name) => {
    const data = await api.auth.signup({ email, password, business_name });
    localStorage.setItem("sm_token", data.token);
    setUser(data.user);
    const { org } = await api.auth.me();
    setOrg(org);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("sm_token");
    setUser(null);
    setOrg(null);
  };

  return (
    <AuthContext.Provider value={{ user, org, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
