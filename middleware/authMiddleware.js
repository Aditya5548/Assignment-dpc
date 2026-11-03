
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token is required."
    });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } 
  catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again."
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again."
    });
  }
}
