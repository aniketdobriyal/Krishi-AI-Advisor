import { db } from "../config/db.js";

class SearchService {
  search(query) {
    if (!query || query.trim() === "") {
      return { crops: [], diseases: [], pests: [] };
    }

    const q = query.toLowerCase().trim();

    const matchedCrops = db.crops.filter(c => 
      (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
      (c.nameHi && c.nameHi.toLowerCase().includes(q)) ||
      (c.scientificName && c.scientificName.toLowerCase().includes(q)) ||
      (c.descriptionEn && c.descriptionEn.toLowerCase().includes(q)) ||
      (c.descriptionHi && c.descriptionHi.toLowerCase().includes(q))
    );

    const matchedDiseases = db.diseases.filter(d => 
      (d.nameEn && d.nameEn.toLowerCase().includes(q)) ||
      (d.nameHi && d.nameHi.toLowerCase().includes(q)) ||
      (d.pathogen && d.pathogen.toLowerCase().includes(q)) ||
      (d.symptomsEn && d.symptomsEn.toLowerCase().includes(q)) ||
      (d.symptomsHi && d.symptomsHi.toLowerCase().includes(q))
    );

    const matchedPests = db.pests.filter(p => 
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      (p.nameHi && p.nameHi.toLowerCase().includes(q)) ||
      (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q)) ||
      (p.descriptionHi && p.descriptionHi.toLowerCase().includes(q))
    );

    return {
      crops: matchedCrops,
      diseases: matchedDiseases,
      pests: matchedPests
    };
  }
}

export default new SearchService();
