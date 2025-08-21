// run-seed.js
import devData from "../data/development-data/index.js";
import seed from "./seed.js";

const runSeed = async () => {
  try {
    await seed(devData);
    console.log("Firestore seeding completed ✅");
  } catch (err) {
    console.error("Error in seeding process:", err);
  }
};

runSeed();