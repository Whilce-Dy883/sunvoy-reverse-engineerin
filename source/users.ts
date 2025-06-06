import fs from "fs-extra";
import * as cheerio from "cheerio";
import { User } from "./types";
import { BASE_URL, fetchWithCookies, LOGIN_URL, USERS_API } from "./config/clients";

const AUTH_FILE = "./json/auth.json";

/**
 * Reads the session cookie from the .auth.json file.
 * @returns Promise<string> - The cookie string
 */
async function readCookie(): Promise<string> {
  const auth = await fs.readJson(AUTH_FILE);
  return auth.cookie;
}

/**
 * Fetches a list of users from the API.
 * Requires a valid session cookie saved in the .auth.json file.
 * 
 * @returns Promise<User[]> - An array of User objects
 */
export async function getUserList(): Promise<User[]> {
  // If the auth file doesn't exist, return an empty list
  if (!(await fs.pathExists(AUTH_FILE))) return [];

  const cookie = await readCookie();

  // Make a POST request to retrieve the user list
  const res = await fetchWithCookies(USERS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: LOGIN_URL,
      Origin: BASE_URL,
      "User-Agent": "Mozilla/5.0",
      cookie,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  // Parse and return the JSON response
  return await res.json();
}
