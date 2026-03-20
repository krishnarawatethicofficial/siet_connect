import { rateLimiter } from "../config/upstash.js";

// Upstash sliding window rate limiter middleware
export const rateLimit = async (req, res, next) => {
  try {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success, remaining, reset } = await rateLimiter.limit(identifier);

    // Set rate limit headers
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      return res.status(429).json({
        success: false,
        message: "Too many requests — please slow down",
      });
    }

    next();
  } catch (error) {
    // If Upstash is down, let the request through (fail open)
    console.error("Rate limiter error:", error.message);
    next();
  }
};
