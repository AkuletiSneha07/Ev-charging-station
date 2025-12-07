function logAction(action, userId, details = "") {
  console.log(`[${new Date().toISOString()}] ACTION: ${action}, USER: ${userId}, DETAILS: ${details}`);
}
