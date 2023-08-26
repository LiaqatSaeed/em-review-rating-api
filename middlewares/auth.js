import jwt from "jsonwebtoken";
import crypto from "crypto"; // use to generate a secure random string
import { split, nth } from "lodash";
import { local } from "../local";

export const JWT_SECRET_KEY = (function () {
  return crypto.randomBytes(32).toString("hex");
})(); // Same secret key as used for signing tokens

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && nth(split(authHeader, " "), 1);

  if (token == null) {
    return res.status(401).json({ message: local.noToken });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: local.tokenVerifyFailed });
    }

    req.user = user;
    next();
  });
};

export const authError = (err, req, res, next) => {
  res.json(err);
};

export const getJWTSecretKey = () => crypto.randomBytes(32).toString("hex");

