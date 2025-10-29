const seedPosts = require("../lib/seed").default;

seedPosts()
  .then(() => process.exit(0))
  .catch(console.error);
