// Select N random users from the pool
export const selectRandomUsers = (numUsers, users) => {
  if (!Array.isArray(users) || users.length === 0) {
    console.error("No users available in the global state");
    return [];
  }

  // Ensure we don't try to select more users than available
  const n = Math.min(numUsers, users.length);

  // Fisher-Yates shuffle and take first N
  const shuffled = [...users];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, n);
};

// Keep track of request count to ensure alternation
let requestCounter = 0;

// Get a random user from selected pool
export const getRandomUser = (selectedUsers) => {
  if (!Array.isArray(selectedUsers) || selectedUsers.length === 0) {
    console.error("No users provided to getRandomUser");
    return ""; // Return empty string if no users available
  }

  // Use counter to alternate between users
  const index = requestCounter % selectedUsers.length;
  requestCounter++;

  const selectedUser = selectedUsers[index];
  console.log("Selected user for request", requestCounter, ":", selectedUser);
  return selectedUser;
};
