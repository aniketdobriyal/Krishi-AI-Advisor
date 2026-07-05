import Pest from "../models/pest.js";

class PestService {
  async getAll() {
    return await Pest.find({});
  }
}

export default new PestService();

