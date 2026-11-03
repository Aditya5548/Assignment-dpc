import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "TOKEN_MISSING",
      message: "Token is required."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Token has expired. Please login again."
      });
    }

    return res.status(401).json({
      success: false,
      code: "TOKEN_INVALID",
      message: "Invalid token. Please login again."
    });
  }
}
