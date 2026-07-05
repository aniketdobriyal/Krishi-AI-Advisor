import Crop from "../models/crop.js";

class CropService {
  async getAll() {
    return await Crop.find({});
  }
}

export default new CropService();

