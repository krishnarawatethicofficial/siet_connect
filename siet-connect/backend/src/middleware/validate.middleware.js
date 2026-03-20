import { validationResult } from "express-validator";

// Express-validator result checker middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    return res.status(400).json({
      success: false,
      message: messages[0], // Return first error for clean UX
      errors: messages,
    });
  }

  next();
};
