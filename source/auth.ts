import fs from "fs-extra";
import * as cheerio from "cheerio";
import { URLSearchParams } from "url";
import { BASE_URL, cookieJar, CURRENT_USER_API, fetchWithCookies, LOGIN_URL } from "./config/clients";
import { AuthData } from "./types";

// File path to store authentication cookie data
const AUTH_FILE = "./json/auth.json";

/**
 * Fetches the login page and extracts the CSRF nonce value from the HTML.
 * This value is required to submit the login form.
 *
 * @returns Promise<string> - The extracted nonce token
 */
export async function getNonce(): Promise<string> {
  const res = await fetchWithCookies(LOGIN_URL);
  const html = await res.text();
  const $ = cheerio.load(html);
  const nonceVal = $('input[name="nonce"]').val();

  // Ensure the nonce is returned as a string (handles array or null cases)
  return Array.isArray(nonceVal) ? nonceVal[0] || "" : nonceVal || "";
}

/**
 * Performs a login using demo credentials and stores the session cookie in a file.
 *
 * @returns Promise<string> - The cookie string used for authentication
 * @throws Error if the login request fails
 */
export async function login(): Promise<string> {
  const nonce = await getNonce();

  // Create form data with username, password, and nonce
  const form = new URLSearchParams({
    username: "demo@example.org",
    password: "test",
    nonce,
  });

  // Submit login form
  const res = await fetchWithCookies(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
    },
    body: form.toString(),
  });

  if (!res.ok) throw new Error("Login failed");

  // Get cookie string from cookie jar and save it to the auth file
  const cookie = await cookieJar.getCookieString(BASE_URL);
  await fs.writeJson(AUTH_FILE, { cookie });

  return cookie;
}

/**
 * Reuses the existing session cookie if still valid.
 * If the session has expired or the cookie doesn't exist, it logs in again.
 *
 * @returns Promise<string> - A valid session cookie
 */
export async function reuseOrLogin(): Promise<string> {
  if (await fs.pathExists(AUTH_FILE)) {
    const { cookie }: AuthData = await fs.readJson(AUTH_FILE);

    // Try to validate existing session using the settings endpoint
    const res = await fetchWithCookies(CURRENT_USER_API, {
      headers: { cookie },
    });

    if (res.ok) {
      console.log("✅ Using existing session.");
      return cookie;
    }

    console.log("🔁 Session expired. Logging in again...");
  }

  // Fall back to performing login
  return await login();
}