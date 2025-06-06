import { reuseOrLogin } from "./auth";

async function main(): Promise<void> {
  // Authenticate using existing session or perform login
  await reuseOrLogin();
  console.log("✅ Authenticated successfully.");
}

// Run the main function and catch any unhandled errors
main().catch(console.error);