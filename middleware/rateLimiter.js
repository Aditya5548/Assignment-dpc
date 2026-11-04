
import { rateLimit } from "express-rate-limit";

const createRateLimiter = (limit, windowMs, message) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
      success: false,
      message,
    },
  });
};

export const loginRateLimiter = createRateLimiter(
  10,
  15 * 60 * 1000,
  "Too many login attempts. Please try again after 15 minutes."
);

export const signupRateLimiter = createRateLimiter(
  5,
  15 * 60 * 1000,
  "Too many signup attempts. Please try again after 15 minutes."
);
