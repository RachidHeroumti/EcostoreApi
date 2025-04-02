import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SCRT);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found, authorization failed" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

export const protectCeo = (req, res, next) => {
  if (req.user && req.user.role === "ceo") {
    return next();
  }
  return res.status(403).json({ message: "Access denied! CEO only" });
};


export const protectAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "ceo")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied! Admin or CEO only" });
};


export const protectCallCenter = (req, res, next) => {
  if (req.user && (req.user.role === "callcenter" || req.user.role === "ceo")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied! Call Center agents only" });
};


