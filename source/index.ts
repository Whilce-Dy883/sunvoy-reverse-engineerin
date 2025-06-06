import { reuseOrLogin } from "./auth";
import { getUserList, getCurrentUser } from "./user";
import fs from "fs-extra";

/**
 * Main entry point of the script.
 * - Ensures the user is authenticated (reuses session or logs in)
 * - Fetches the user list and current user info
 * - Saves the first 10 users and current user to a JSON file
 */
async function main(): Promise<void> {
  // Authenticate using existing session or perform login
  await reuseOrLogin();

  // Fetch the list of all users from the API
  const users = await getUserList();

  // Scrape the current logged-in user's profile from settings page
  const currentUser = await getCurrentUser();

  // Ensure the returned data is a valid array
  if (!Array.isArray(users)) {
    throw new Error("Invalid user list format");
  }

  // Prepare the output by limiting to 10 users and adding current user info
  const output = {
    users: users.slice(0, 10),
    currentUser,
  };

  // Write the output to users.json with pretty formatting
  await fs.writeJson("./json/users.json", output, { spaces: 2 });
  console.log("✅ Data saved to users.json");
}

// Run the main function and catch any unhandled errors
main().catch(console.error);
