import { User } from "./MiddlewareUser.ts";
import { Payload } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

export interface JwtUserPayload extends Payload {
    _id: string;
    _doc: Omit<User, "_id">;
  }