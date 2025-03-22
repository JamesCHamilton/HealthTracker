import { create, verify } from "https://deno.land/x/djwt@v3.0.2/mod.ts";
import { NextFunction, Request, Response } from "npm:express";
import { crypto } from "https://deno.land/std@0.224.0/crypto/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

config({ export: true });

// Type definitions
interface UserPayload {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DecodedToken {
  _id: string;
  exp: number;
  [key: string]: unknown;
}

declare module "npm:express" {
  interface Request {
    user?: DecodedToken;
  }
}

// Convert secret string to CryptoKey
const SECRET_JWT = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(Deno.env.get("SECRET_JWT") || ""),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"],
);

const generateToken = async (user: UserPayload) => {
  const { _id, ...rest } = user;
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      _id: _id, // Remove ObjectId check since _id is already a string
      ...rest,
      exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60),
    },
    SECRET_JWT,
  );
};

const generateAuthToken = async (user: UserPayload) => {
  const { _id, ...rest } = user;
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      _id: _id, // Remove ObjectId check since _id is already a string
      ...rest,
      exp: Math.floor(Date.now() / 1000) + (5 * 60 * 60),
    },
    SECRET_JWT,
  );
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ url: "/login" });
  }

  try {
    const decoded = await verify(token, SECRET_JWT) as DecodedToken;
    req.user = decoded;
    next();
  } catch (_err) {
    return res.status(403).json({ url: "/login" });
  }
};

const verifyResetToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.body?.token;
  if (!token) {
    return res.status(401).json({ message: "No reset token found" });
  }

  try {
    const decoded = await verify(token, SECRET_JWT) as DecodedToken;
    req.user = decoded;
    next();
  } catch (_err) {
    res.status(401).json({ message: "Token has expired" });
  }
};

export { generateAuthToken, generateToken, verifyResetToken, verifyToken };