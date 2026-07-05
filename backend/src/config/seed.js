import Crop from "../models/crop.js";
import Disease from "../models/disease.js";
import Pest from "../models/pest.js";
import PostHarvest from "../models/postHarvest.js";
import History from "../models/history.js";
import { crops, diseases, pests, postHarvestGuides, history } from "./db.js";

export const seedDatabase = async () => {
  try {
    // 1. Seed Crops
    const cropCount = await Crop.countDocuments();
    if (cropCount === 0) {
      console.log("Seeding Crops collection...");
      await Crop.insertMany(crops);
      console.log(`Successfully seeded ${crops.length} crops.`);
    } else {
      console.log("Crops collection already populated.");
    }

    // 2. Seed Diseases
    const diseaseCount = await Disease.countDocuments();
    if (diseaseCount === 0) {
      console.log("Seeding Diseases collection...");
      await Disease.insertMany(diseases);
      console.log(`Successfully seeded ${diseases.length} diseases.`);
    } else {
      console.log("Diseases collection already populated.");
    }

    // 3. Seed Pests
    const pestCount = await Pest.countDocuments();
    if (pestCount === 0) {
      console.log("Seeding Pests collection...");
      await Pest.insertMany(pests);
      console.log(`Successfully seeded ${pests.length} pests.`);
    } else {
      console.log("Pests collection already populated.");
    }

    // 4. Seed PostHarvest Guides
    const postHarvestCount = await PostHarvest.countDocuments();
    if (postHarvestCount === 0) {
      console.log("Seeding PostHarvest guides collection...");
      await PostHarvest.insertMany(postHarvestGuides);
      console.log(`Successfully seeded ${postHarvestGuides.length} post-harvest guides.`);
    } else {
      console.log("PostHarvest guides collection already populated.");
    }

    // 5. Seed Chat History (Optional, to match starting state)
    const historyCount = await History.countDocuments();
    if (historyCount === 0) {
      console.log("Seeding History collection...");
      await History.insertMany(history);
      console.log(`Successfully seeded ${history.length} default history items.`);
    } else {
      console.log("History collection already populated.");
    }

  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
};
