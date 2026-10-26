// Creates the admin account from ADMIN_* values in .env (or promotes it if the email already exists).
// Admins can't be created through /api/auth/register, so run this once: npm run seed:admin
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const seedAdmin = async () => {
  const { MONGO_URI, ADMIN_NAME = "Canteen Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first");
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Promoted ${email} to admin`);
  } else {
    await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD, role: "admin" });
    console.log(`Created admin ${email}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
