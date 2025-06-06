import fs from "fs-extra";
import { AuthData } from "../types";
import { AUTH_FILE } from "./constants";

/**
 * Reads the session cookie from the .auth.json file.
 *
 * @returns Promise<string> - The session cookie string
 * @throws If the file doesn't exist or can't be read
 */
export async function readCookie(): Promise<string> {
  const { cookie }: AuthData = await fs.readJson(AUTH_FILE);
  return cookie;
}
