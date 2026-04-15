import express from "express";
import supabase from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: events, error } = await supabase
      .from("analytics_events").select("*")
      .eq("org_id", req.user.org_id).gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const total = events.length;
    const matched = events.filter((e) => e.matched).length;
    const webSearched = events.filter((e) => e.used_web_search).length;
    const matchRate = total > 0 ? Math.round((matched / total) * 100) : 0;

    const byDay = {};
    events.forEach((e) => {
      const day = e.created_at.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    const queryCounts = {};
    events.forEach((e) => {
      const q = e.query?.toLowerCase().trim();
      if (q) queryCounts[q] = (queryCounts[q] || 0) + 1;
    });
    const topQueries = Object.entries(queryCounts)
      .sort((a, b) => b[1] - a[1]).slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    res.json({
      summary: { total_chats: total, catalog_matches: matched, web_searches: webSearched, match_rate: matchRate },
      chart: Object.entries(byDay).map(([date, count]) => ({ date, count })),
      top_queries: topQueries,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics." });
  }
});

router.get("/recent", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("analytics_events").select("id, query, matched, used_web_search, created_at")
      .eq("org_id", req.user.org_id).order("created_at", { ascending: false }).limit(50);
    if (error) throw error;
    res.json({ events: data });
  } catch {
    res.status(500).json({ error: "Failed to fetch recent events." });
  }
});

export default router;
