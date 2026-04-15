import express from "express";
import supabase from "../lib/supabase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const org_id = "25ca1746-8e55-4fa4-b66b-53680d4973a1";

    const lowerMsg = message.toLowerCase();

    // 🔥 Fetch products
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("org_id", org_id);

    if (error) throw error;

    // ================================
    // 🔥 1. BUY INTENT
    // ================================
    if (lowerMsg.includes("buy")) {
      return res.json({
        message: "You can buy these items directly from the store 👇",
        highlight_ids: products.slice(0, 4).map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      });
    }

    // ================================
    // 🔥 2. PRICE FILTER
    // ================================
    if (lowerMsg.includes("under")) {
      const price = parseInt(lowerMsg.match(/\d+/)?.[0] || 0);

      const filtered = products.filter(p => p.price <= price);

      return res.json({
        message: `Products under ₹${price}: ` +
          (filtered.length
            ? filtered.map(p => `${p.name} (₹${p.price})`).join(" - ")
            : "No products found"),
        highlight_ids: filtered.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      });
    }

    // ================================
    // 🔥 3. KEYWORD SEARCH (🔥 NEW)
    // ================================
    const keywordFiltered = products.filter(p =>
      p.name.toLowerCase().includes(lowerMsg)
    );

    if (keywordFiltered.length > 0) {
      return res.json({
        message:
          "Here are matching items: " +
          keywordFiltered.map(p => `${p.name} (₹${p.price})`).join(" - "),
        highlight_ids: keywordFiltered.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price
        }))
      });
    }

    // ================================
    // 🔥 4. DEFAULT RESPONSE
    // ================================
    return res.json({
      message:
        "Clothing items: " +
        products.map(p => `${p.name} (₹${p.price})`).join(" - "),
      highlight_ids: products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price
      }))
    });

  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;