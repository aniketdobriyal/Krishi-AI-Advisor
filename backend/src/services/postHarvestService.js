import PostHarvest from "../models/postHarvest.js";

class PostHarvestService {
  async getAll() {
    return await PostHarvest.find({});
  }
}

export default new PostHarvestService();

