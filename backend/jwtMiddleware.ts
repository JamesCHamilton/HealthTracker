import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import {NextFunction, Request, Response} from "express";
import { User } from "./interfaces/MiddlewareUser.ts";
import { JwtUserPayload } from "./interfaces/jwtUserPayload.ts";

declare module "express" {
  interface Request {
    user?: JwtUserPayload;  // Use the custom payload type
  }
}

// Convert secret string to CryptoKey
const SECRET_JWT = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("SECRET_JWT") || ""),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

const generateToken = async (user: User) => {
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      _id: user._id.toString(),
      ...user._doc,
      exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60) // 5 hours expiration
    },
    SECRET_JWT // Directly pass CryptoKey as 3rd argument
  );
};

const generateAuthToken = async (user: User) => {
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      _id: user._id.toString(),
      ...user._doc,
      exp: Math.floor(Date.now() / 1000) + (10 * 60) // 10 minutes expiration
    },
    SECRET_JWT // Directly pass CryptoKey
  );
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ url: "/login" });
  }

  try {
    const decoded = await verify(token, SECRET_JWT) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(403).json({ url: "/login" });
  }
};

const verifyResetToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.body?.token;
  if (!token) {
    return res.status(401).json({ message: "No reset token found" });
  }

  try {
    const decoded = await verify(token, SECRET_JWT) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (_err) {
    res.status(401).json({ message: "Token has expired" });
  }
};

export { generateToken, verifyToken, generateAuthToken, verifyResetToken };