const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = process.argv[2];

  if (!password) {
    console.log("Usage: node scripts/hashPassword.js <password>");
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    console.log("\nPassword:");
    console.log(password);

    console.log("\nHash:");
    console.log(hash);

  } catch (error) {
    console.error(error);
  }
}

hashPassword();