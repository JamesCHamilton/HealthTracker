import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.3/mod.ts";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
config({export: true})

const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("GOOGLE_CLIENT_ID")!,
  clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
  redirectUri: Deno.env.get("GOOGLE_REDIRECT_URL")!,
  authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
});

export function getGoogleAuthUrl() {
  return oauth2Client.code.getAuthorizationUri({
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  }).toString();
}

export async function handleGoogleCallback(code: string) {
  const tokens = await oauth2Client.code.getToken(code);
  return tokens;
}
