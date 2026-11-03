
export default function apiKeyMiddleware(req, res, next) {
  const suppliedKey = req.get("x-api-key");
  if (!suppliedKey) {
    return res.status(401).json({
      success: false,
      message: "API key is required."
    });
  }
  if (suppliedKey !== process.env.API_KEY) {
    return res.status(403).json({
      success: false,
      message: "Invalid API key."
    });
  }

  next();
}
