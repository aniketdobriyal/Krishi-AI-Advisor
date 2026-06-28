import { db } from "../config/db.js";

class DiseaseService {
  getAll() {
    return db.diseases;
  }

  getById(id) {
    return db.diseases.find(disease => disease.id === id);
  }
}

export default new DiseaseService();
