import express from "express";
import multer from "multer";
import { parse } from "csv-parse/sync";
import supabase from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadLimiter } from "../middleware/rateLimit.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv" && !file.originalname.endsWith(".csv"))
      return cb(new Error("Only CSV files are allowed."));
    cb(null, true);
  },
});

// POST /api/catalog/upload
router.post("/upload", requireAuth, uploadLimiter, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No CSV file provided." });
  try {
    const records = parse(req.file.buffer.toString("utf-8"), { columns: true, skip_empty_lines: true, trim: true });
    if (!records.length) return res.status(400).json({ error: "CSV file is empty." });

    const headers = Object.keys(records[0]).map((k) => k.toLowerCase());
    if (!headers.includes("name") || !headers.includes("price"))
      return res.status(400).json({ error: 'Missing required columns: "name" and "price"' });

    const products = records.map((row) => ({
      org_id: req.user.org_id,
      name: String(row.name || "").slice(0, 200),
      category: String(row.category || "General").slice(0, 100),
      price: parseFloat(row.price) || 0,
      description: String(row.description || "").slice(0, 500),
      tags: String(row.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 10),
      emoji: String(row.emoji || "📦").slice(0, 4),
      in_stock: row.in_stock !== "false",
    }));

    await supabase.from("products").delete().eq("org_id", req.user.org_id);

    for (let i = 0; i < products.length; i += 100) {
      const { error } = await supabase.from("products").insert(products.slice(i, i + 100));
      if (error) throw error;
    }

    // Advance onboarding to step 2
    await supabase.from("organizations").update({ onboarding_step: 2 }).eq("id", req.user.org_id).lt("onboarding_step", 2);
    res.json({ message: `Successfully uploaded ${products.length} products.`, count: products.length });
  } catch (err) {
    res.status(500).json({ error: err.message || "Upload failed." });
  }
});

// GET /api/catalog
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("org_id", req.user.org_id).order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ products: data, count: data.length });
  } catch {
    res.status(500).json({ error: "Failed to fetch catalog." });
  }
});

// DELETE /api/catalog
router.delete("/", requireAuth, async (req, res) => {
  try {
    await supabase.from("products").delete().eq("org_id", req.user.org_id);
    res.json({ message: "Catalog cleared." });
  } catch {
    res.status(500).json({ error: "Failed to clear catalog." });
  }
});

// DELETE /api/catalog/:id
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await supabase.from("products").delete().eq("id", req.params.id).eq("org_id", req.user.org_id);
    res.json({ message: "Product deleted." });
  } catch {
    res.status(500).json({ error: "Failed to delete product." });
  }
});

export default router;
