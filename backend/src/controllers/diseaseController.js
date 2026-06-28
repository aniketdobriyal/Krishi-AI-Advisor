import diseaseService from "../services/diseaseService.js";

export const getDiseases = async (req, res, next) => {
  try {
    const diseases = diseaseService.getAll();
    return res.status(200).json(diseases);
  } catch (error) {
    return next(error);
  }
};

export const getDiseaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const disease = diseaseService.getById(id);
    
    if (!disease) {
      const error = new Error(`Disease with ID '${id}' not found`);
      error.statusCode = 404;
      return next(error);
    }
    
    return res.status(200).json(disease);
  } catch (error) {
    return next(error);
  }
};
