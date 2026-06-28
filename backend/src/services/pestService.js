import { db } from "../config/db.js";

class PestService {
  getAll() {
    return db.pests;
  }
}

export default new PestService();
