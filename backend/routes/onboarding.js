import express from "express";
import supabase from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/onboarding — get current step
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data: org, error } = await supabase
      .from("organizations")
      .select("onboarding_step, name, chat_count, chat_limit")
      .eq("id", req.user.org_id)
      .single();

    if (error || !org) return res.status(404).json({ error: "Org not found." });

    const steps = [
      { step: 1, title: "Account created", desc: "You signed up successfully!", done: true },
      { step: 2, title: "Upload your catalog", desc: "Go to Catalog → Upload CSV with your products", done: org.onboarding_step > 1 },
      { step: 3, title: "Test your AI", desc: "Go to Preview Chat and try asking a question", done: org.onboarding_step > 2 },
      { step: 4, title: "Embed on your website", desc: "Go to Widget → copy the script tag", done: org.onboarding_step > 3 },
    ];

    res.json({
      current_step: org.onboarding_step,
      complete: org.onboarding_step >= 4,
      steps,
      usage: { count: org.chat_count, limit: org.chat_limit },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch onboarding." });
  }
});

// POST /api/onboarding/advance — move to next step
router.post("/advance", requireAuth, async (req, res) => {
  try {
    const { data: org } = await supabase
      .from("organizations")
      .select("onboarding_step")
      .eq("id", req.user.org_id)
      .single();

    if (!org) return res.status(404).json({ error: "Org not found." });

    const nextStep = Math.min((org.onboarding_step || 1) + 1, 4);

    await supabase
      .from("organizations")
      .update({ onboarding_step: nextStep })
      .eq("id", req.user.org_id);

    res.json({ onboarding_step: nextStep });
  } catch (err) {
    res.status(500).json({ error: "Failed to advance onboarding." });
  }
});

export default router;
