import Client from "../schemas/Client.ts";
import { Router } from "express";
import { Request, Response } from "express";
import { getGoogleAuthUrl, handleGoogleCallback } from "../utils/googleAuth.ts";
import { generateToken } from "../jwtMiddleware.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
config({export: true})

const router = Router();

router.get("/google", (res: Response) => {
  res.redirect(getGoogleAuthUrl());
});

router.get("/google/calslback", async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code) {
      throw new Error("No code provided");
    }

    const tokens = await handleGoogleCallback(code.toString());

    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser = await userInfo.json();

    if (!googleUser.email || !googleUser.id) {
      throw new Error("Incomplete data fetching occurred");
    }

    let client = await Client.findOne({
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.id },
      ],
    });

    if (!client) {
      client = new Client({
        googleId: googleUser.id,
        email: googleUser.email,
        firstName: googleUser.given_name || "Unknown",
        lastName: googleUser.family_name || "Unknown",
        emailVerified: true,
        authmethod: "google",
      });
      await client.save();
    }

    const token = generateToken(client);

    res.cookie("token", token, {
      httpOnly: true,
      secure: Deno.env.get("NODE_ENV") === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: "lax",
      path: "/",
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Google Auth error:", error);
    res.redirect(`/sigin?error=google_auth_failed`);
  }
});

export { router };
