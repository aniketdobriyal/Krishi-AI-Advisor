import Crop from "../models/crop.js";
import Disease from "../models/disease.js";
import Pest from "../models/pest.js";

class SearchService {
  async search(query) {
    if (!query || query.trim() === "") {
      return { crops: [], diseases: [], pests: [] };
    }

    const q = query.trim();
    const regex = new RegExp(q, "i");

    const [matchedCrops, matchedDiseases, matchedPests] = await Promise.all([
      Crop.find({
        $or: [
          { nameEn: regex },
          { nameHi: regex },
          { scientificName: regex },
          { descriptionEn: regex },
          { descriptionHi: regex }
        ]
      }),
      Disease.find({
        $or: [
          { nameEn: regex },
          { nameHi: regex },
          { pathogen: regex },
          { symptomsEn: regex },
          { symptomsHi: regex }
        ]
      }),
      Pest.find({
        $or: [
          { nameEn: regex },
          { nameHi: regex },
          { descriptionEn: regex },
          { descriptionHi: regex }
        ]
      })
    ]);

    return {
      crops: matchedCrops,
      diseases: matchedDiseases,
      pests: matchedPests
    };
  }
}

export default new SearchService();

