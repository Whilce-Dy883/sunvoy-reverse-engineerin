import { reuseOrLogin } from "./auth";
import { getUserList } from "./users";

async function main(): Promise<void> {
  // Authenticate using existing session or perform login
  await reuseOrLogin();
  console.log("✅ Authenticated successfully.");

  const users = await getUserList();


  if (users.length === 0) {
    console.log("No users found.");
  } else {
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
    });
  } 
  console.log("✅ User list retrieved successfully.");
  console.log("Total users:", users.length);
}

// Run the main function and catch any unhandled errors
main().catch(console.error);