import { db } from "../config/db.js";

class PostHarvestService {
  getAll() {
    return db.postHarvest;
  }
}

export default new PostHarvestService();
