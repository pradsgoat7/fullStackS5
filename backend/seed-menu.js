// Adds the canteen menu (data/menu.json) to the database, or updates existing items by name.
// Prices and display details are refreshed; live stock is only set for new items.
// Run once per database: npm run seed:menu
const mongoose = require("mongoose");
require("dotenv").config();

const Food = require("./models/Food");
const menu = require("./data/menu.json");

const seedMenu = async () => {
  if (!process.env.MONGO_URI) {
    console.error("Set MONGO_URI in backend/.env first");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const result = await Food.bulkWrite(
    menu.map(({ name, category, price, prepTime, tag, image, stock }) => ({
      updateOne: {
        filter: { name },
        update: {
          $set: { category, price, prepTime, tag, image, available: true },
          $setOnInsert: { stock, description: tag }
        },
        upsert: true
      }
    }))
  );

  console.log(`Menu synced: ${result.upsertedCount} added, ${result.modifiedCount} updated (${menu.length} items)`);
  await mongoose.disconnect();
};

seedMenu().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
