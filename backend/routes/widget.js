import express from "express";
import { v4 as uuid } from "uuid";
import supabase from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/config", requireAuth, async (req, res) => {
  try {
    const { data: org, error } = await supabase
      .from("organizations").select("id, name, widget_key")
      .eq("id", req.user.org_id).single();

    if (error || !org) return res.status(404).json({ error: "Organization not found." });

    const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;

    const embedSnippet = `<!-- ShopMind AI Widget -->
<script>
  window.ShopMindConfig = {
    orgId: "${org.id}",
    widgetKey: "${org.widget_key}",
    backendUrl: "${backendUrl}"
  };
</script>
<script src="${backendUrl}/widget/shopmind-widget.js" async></script>`;

    res.json({ org_id: org.id, widget_key: org.widget_key, embed_snippet: embedSnippet });
  } catch {
    res.status(500).json({ error: "Failed to get widget config." });
  }
});

router.post("/regenerate-key", requireAuth, async (req, res) => {
  try {
    const newKey = uuid();
    await supabase.from("organizations").update({ widget_key: newKey }).eq("id", req.user.org_id);
    res.json({ widget_key: newKey, message: "Widget key regenerated. Update your embed snippet." });
  } catch {
    res.status(500).json({ error: "Failed to regenerate key." });
  }
});

export default router;
