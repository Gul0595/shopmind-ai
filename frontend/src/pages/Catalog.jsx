import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef();

  const fetchProducts = () => {
    api.catalog.list().then((d) => setProducts(d.products || [])).catch(() => setProducts([])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setMsg(null);
    try {
      const res = await api.catalog.upload(file);
      if (res.error) throw new Error(res.error);
      setMsg({ type: "success", text: res.message });
      fetchProducts();
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setUploading(false);
      fileRef.current.value = "";
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Product Catalog</h1>
          <p className="page-sub">{products.length} products loaded</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          {products.length > 0 && (
            <button className="btn-outline-danger" onClick={async () => { if (!confirm("Clear entire catalog?")) return; await api.catalog.deleteAll(); setProducts([]); }}>Clear All</button>
          )}
          <button className="btn-primary" onClick={() => fileRef.current.click()} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
          <input ref={fileRef} type="file" accept=".csv" style={{ display:"none" }} onChange={handleUpload} />
        </div>
      </div>

      {msg && <div className={`alert ${msg.type}`}>{msg.text}</div>}

      <div className="csv-hint">
        <strong>CSV format:</strong> Required: <code>name</code>, <code>price</code> — Optional: <code>category</code>, <code>description</code>, <code>tags</code> (comma-separated), <code>emoji</code>, <code>in_stock</code>
      </div>

      {loading ? <div className="loading-state">Loading catalog...</div> :
       products.length === 0 ? (
        <div className="empty-catalog">
          <div style={{ fontSize:48, marginBottom:16 }}>📦</div>
          <h3>No products yet</h3>
          <p>Upload a CSV file to get started.</p>
          <button className="btn-primary" style={{ marginTop:16 }} onClick={() => fileRef.current.click()}>Upload Your First Catalog</button>
        </div>
      ) : (
        <div className="catalog-table-wrap">
          <table className="catalog-table">
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Tags</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="emoji-cell">{p.emoji}</td>
                  <td className="name-cell">{p.name}</td>
                  <td><span className="cat-badge">{p.category}</span></td>
                  <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="tags-cell">{(p.tags || []).slice(0, 3).join(", ")}</td>
                  <td><span className={`stock-badge ${p.in_stock ? "in" : "out"}`}>{p.in_stock ? "In Stock" : "Out"}</span></td>
                  <td><button className="del-btn" onClick={async () => { await api.catalog.deleteOne(p.id); setProducts((prev) => prev.filter((x) => x.id !== p.id)); }}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
