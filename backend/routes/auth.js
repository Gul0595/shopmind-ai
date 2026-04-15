import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import supabase from "../lib/supabase.js";
import { authLimiter } from "../middleware/rateLimit.js";
import { sanitizeInput } from "../middleware/sanitize.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", authLimiter, sanitizeInput, async (req, res) => {
  const { email, password, business_name } = req.body;
  if (!email || !password || !business_name)
    return res.status(400).json({ error: "Email, password and business name are required." });
  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters." });

  try {
    const { data: existing } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single();
    if (existing) return res.status(409).json({ error: "Email already registered." });

    const password_hash = await bcrypt.hash(password, 12);
    const org_id = uuid();
    const widget_key = uuid();

    const { error: orgError } = await supabase.from("organizations").insert({ id: org_id, name: business_name, widget_key });
    if (orgError) throw orgError;

    const { data: user, error: userError } = await supabase
      .from("users").insert({ email: email.toLowerCase(), password_hash, org_id, role: "owner" })
      .select("id, email, org_id, role").single();
    if (userError) throw userError;

    const token = jwt.sign({ id: user.id, email: user.email, org_id: user.org_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user.id, email: user.email, org_id: user.org_id }, widget_key });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed. Please try again." });
  }
});

// POST /api/auth/login
router.post("/login", authLimiter, sanitizeInput, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  try {
    const { data: user, error } = await supabase.from("users").select("id, email, password_hash, org_id, role").eq("email", email.toLowerCase()).single();
    if (error || !user) return res.status(401).json({ error: "Invalid credentials." });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, email: user.email, org_id: user.org_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, org_id: user.org_id } });
  } catch (err) {
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase.from("users").select("id, email, org_id, role").eq("id", req.user.id).single();
    if (!user) return res.status(404).json({ error: "User not found." });
    const { data: org } = await supabase.from("organizations").select("id, name, widget_key, plan").eq("id", user.org_id).single();
    res.json({ user, org });
  } catch {
    res.status(500).json({ error: "Failed to fetch user." });
  }
});

export default router;
