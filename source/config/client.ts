import fetch from "node-fetch";
import fetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";

/**
 * Base URL for all API and web requests.
 */
export const BASE_URL = "https://challenge.sunvoy.com";

/**
 * URL for the login page (GET for nonce, POST for login).
 */
export const LOGIN_URL = `${BASE_URL}/login`;

/**
 * API endpoint for retrieving the user list.
 */
export const USERS_API = `${BASE_URL}/api/users`;

/**
 * URL for accessing the settings page (used to validate session or scrape current user).
 */
export const CURRENT_USER_API = `https://api.challenge.sunvoy.com/api/settings`;

/**
 * URL for getting the Token settings page.
 */
export const TOKEN_URL = `${BASE_URL}/settings/tokens`;

/**
 * Shared cookie jar instance for session management across multiple requests.
 */
const jar = new CookieJar();

/**
 * fetch implementation that automatically handles cookies using the shared jar.
 */
export const fetchWithCookies = fetchCookie(fetch, jar);

/**
 * Exported cookie jar for use in login flow (e.g., to extract/set cookies).
 */
export const cookieJar = jar;
