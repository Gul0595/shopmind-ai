export function sanitizeInput(req, res, next) {
  const sanitize = (val) => {
    if (typeof val !== "string") return val;
    return val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/[<>]/g, "").trim();
  };
  const sanitizeObj = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "string") obj[key] = sanitize(obj[key]);
      else if (typeof obj[key] === "object") sanitizeObj(obj[key]);
    }
  };
  if (req.body) sanitizeObj(req.body);
  if (req.query) sanitizeObj(req.query);
  next();
}
