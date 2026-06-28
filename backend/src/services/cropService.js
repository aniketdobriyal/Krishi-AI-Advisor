import { db } from "../config/db.js";

class CropService {
  getAll() {
    return db.crops;
  }
}

export default new CropService();
