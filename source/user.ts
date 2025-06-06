import axios from "axios";
import fs from "fs-extra";
import * as cheerio from "cheerio";
import {
  LOGIN_URL,
  USERS_API,
  CURRENT_USER_API,
  BASE_URL,
  TOKEN_URL,
} from "./config/client";
import { User } from "./types";
import { readCookie } from "./utils/cookie";
import { AUTH_FILE, SECRET } from "./utils/constants";
import crypto from "crypto";

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

  try {
    // Make a POST request to retrieve the user list using axios
    const res = await axios.post(
      USERS_API,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Referer: LOGIN_URL,
          Origin: BASE_URL,
          "User-Agent": "Mozilla/5.0",
          Cookie: cookie, // Axios handles cookies automatically if they are set in the environment
        },
      }
    );

    return res.data; // Parse and return the JSON response
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
}

/**
 * Fetches the current logged-in user's information by scraping the settings page.
 *
 * @returns Promise<User> - A User object representing the current user
 */
export async function getCurrentUser(): Promise<any> {
  const cookie = await readCookie();

  try {
    const res = await axios.get(TOKEN_URL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Cookie: cookie, // Axios will automatically handle the cookies
      },
    });

    const html = res.data;
    const $ = cheerio.load(html);
    let Tokens: Record<string, string> = {
      access_token: ($("input#access_token").val() as string) ?? "",
      apiuser: ($("input#apiuser").val() as string) ?? "",
      language: ($("input#language").val() as string) ?? "",
      openId: ($("input#openId").val() as string) ?? "",
      operateId: ($("input#operateId").val() as string) ?? "",
      timestamp: Math.floor(Date.now() / 1000).toString(),
      userId: ($("input#userId").val() as string) ?? "",
    };

    const sortedQuery = Object.keys(Tokens)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(Tokens[key])}`)
      .join("&");

    const hmac = crypto.createHmac("sha1", SECRET);
    hmac.update(sortedQuery);
    const checkcode = hmac.digest("hex").toUpperCase();

    Tokens = {
      ...Tokens,
      checkcode,
    };

    // Send the tokens with the POST request
    const resUser = await axios.post(CURRENT_USER_API, { ...Tokens });

    return resUser.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw new Error("Failed to fetch current user");
  }
}
