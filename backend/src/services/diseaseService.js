import Disease from "../models/disease.js";

class DiseaseService {
  async getAll() {
    return await Disease.find({});
  }

  async getById(id) {
    return await Disease.findOne({ id });
  }
}

export default new DiseaseService();

