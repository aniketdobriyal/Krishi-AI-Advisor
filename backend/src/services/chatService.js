import { getGeminiModel } from "../config/gemini.js";
import Disease from "../models/disease.js";
import Pest from "../models/pest.js";
import searchService from "./searchService.js";

// Normalized matching helper
const cleanStr = (str) => str.toLowerCase().replace(/[^a-z0-9\s\u0900-\u097F]/g, "");

// Offline Advisor Fallback
export async function getOfflineAdvisory(query, isHindi = false) {
  const q = cleanStr(query);
  
  // 1. Search for specific diseases
  // Late Blight
  if (q.includes("blight") || q.includes("झुलसा") || q.includes("late") || q.includes("पछेती")) {
    const d = await Disease.findOne({ id: "late-blight" });
    if (d) {
      return {
        problem: isHindi ? `${d.nameHi} (${d.pathogen})` : `${d.nameEn} (${d.pathogen})`,
        causes: isHindi ? d.symptomsHi : d.symptomsEn,
        actions: isHindi ? d.treatmentHi : d.treatmentEn,
        precautions: isHindi ? d.preventionHi : d.preventionEn,
        disclaimer: isHindi 
          ? "यह मार्गदर्शन स्थानीय मौसम स्थितियों (आर्द्रता >85%) पर आधारित है। कृपया छिड़काव से पहले कृषि विज्ञान केंद्र (KVK) से इसकी पुष्टि करें।" 
          : "This offline advisory is triggered by blight-related keywords. Please verify symptoms with your local Krishi Vigyan Kendra (KVK) agent."
      };
    }
  }

  // Rust
  if (q.includes("rust") || q.includes("गेरूई") || q.includes("रस्ट") || q.includes("wheat") || q.includes("गेहूं")) {
    const d = await Disease.findOne({ id: "rust" });
    if (d) {
      return {
        problem: isHindi ? `${d.nameHi} (${d.pathogen})` : `${d.nameEn} (${d.pathogen})`,
        causes: isHindi ? d.symptomsHi : d.symptomsEn,
        actions: isHindi ? d.treatmentHi : d.treatmentEn,
        precautions: isHindi ? d.preventionHi : d.preventionEn,
        disclaimer: isHindi 
          ? "जंग (रस्ट) रोग हवा से तेजी से फैलता है। कृपया ब्लॉक कृषि अधिकारी से प्रतिरोधी किस्मों की पुष्टि करें।" 
          : "Rust spores travel quickly in wind. Verify crop resistance levels with block agriculture officers."
      };
    }
  }

  // Powdery Mildew
  if (q.includes("mildew") || q.includes("आसिता") || q.includes("powdery") || q.includes("चूर्णिल")) {
    const d = await Disease.findOne({ id: "powdery-mildew" });
    if (d) {
      return {
        problem: isHindi ? `${d.nameHi} (${d.pathogen})` : `${d.nameEn} (${d.pathogen})`,
        causes: isHindi ? d.symptomsHi : d.symptomsEn,
        actions: isHindi ? d.treatmentHi : d.treatmentEn,
        precautions: isHindi ? d.preventionHi : d.preventionEn,
        disclaimer: isHindi 
          ? "यह चूर्णिल आसिता (पाउडरी मिल्ड्यू) रोग का एक सामान्य उपचार है। जैविक सल्फर छिड़काव दोपहर के समय न करें।" 
          : "Standard powdery mildew advisory. Refrain from spraying sulphur during peak midday temperatures."
      };
    }
  }

  // Bacterial Wilt
  if (q.includes("wilt") || q.includes("म्लानि") || q.includes("bacterial") || q.includes("जीवाणु")) {
    const d = await Disease.findOne({ id: "bacterial-wilt" });
    if (d) {
      return {
        problem: isHindi ? `${d.nameHi} (${d.pathogen})` : `${d.nameEn} (${d.pathogen})`,
        causes: isHindi ? d.symptomsHi : d.symptomsEn,
        actions: isHindi ? d.treatmentHi : d.treatmentEn,
        precautions: isHindi ? d.preventionHi : d.preventionEn,
        disclaimer: isHindi 
          ? "बैक्टीरियल विल्ट का कोई रासायनिक इलाज नहीं है। केवल पौधों को उखाड़कर और स्वच्छता बनाकर ही इसे नियंत्रित किया जा सकता है।" 
          : "Bacterial wilt has no effective chemical cure. Removal of affected plants is mandatory to protect the field."
      };
    }
  }

  // Leaf Spot
  if (q.includes("spot") || q.includes("धब्बा") || q.includes("leaf spot") || q.includes("पत्ती धब्बा")) {
    const d = await Disease.findOne({ id: "leaf-spot" });
    if (d) {
      return {
        problem: isHindi ? `${d.nameHi} (${d.pathogen})` : `${d.nameEn} (${d.pathogen})`,
        causes: isHindi ? d.symptomsHi : d.symptomsEn,
        actions: isHindi ? d.treatmentHi : d.treatmentEn,
        precautions: isHindi ? d.preventionHi : d.preventionEn,
        disclaimer: isHindi 
          ? "पत्ती धब्बा कवक जनित रोग है। प्रमाणित बीज और फफूंदनाशकों का उचित प्रयोग सुनिश्चित करें।" 
          : "Standard leaf spot warning. Confirm crop age and humidity context before chemical application."
      };
    }
  }

  // 2. Search for pests
  // Aphids
  if (q.includes("aphid") || q.includes("माहू") || q.includes("एफिड") || q.includes("sarso") || q.includes("mustard") || q.includes("सरसों")) {
    const p = await Pest.findOne({ id: "aphids" });
    if (p) {
      return {
        problem: isHindi ? p.nameHi : p.nameEn,
        causes: isHindi ? p.descriptionHi : p.descriptionEn,
        actions: isHindi ? p.controlHi : p.controlEn,
        precautions: isHindi ? p.preventionHi : p.preventionEn,
        disclaimer: isHindi 
          ? "एफिड्स (माहू) का प्रकोप मौसम बदलने पर बढ़ता है। रासायनिक छिड़काव तभी करें जब आर्थिक क्षति स्तर (ETL) पार हो।" 
          : "Monitor beneficial insects (like ladybugs) before applying intensive chemical aphidicides."
      };
    }
  }

  // Whiteflies
  if (q.includes("whitefl") || q.includes("सफेद मक्खी") || q.includes("makkhi")) {
    const p = await Pest.findOne({ id: "whiteflies" });
    if (p) {
      return {
        problem: isHindi ? p.nameHi : p.nameEn,
        causes: isHindi ? p.descriptionHi : p.descriptionEn,
        actions: isHindi ? p.controlHi : p.controlEn,
        precautions: isHindi ? p.preventionHi : p.preventionEn,
        disclaimer: isHindi 
          ? "सफेद मक्खी टमाटर में वायरस फैलाती है। वायरस-ग्रस्त पौधों को तुरंत नष्ट करना सबसे महत्वपूर्ण है।" 
          : "Whiteflies transmit leaf curl virus. Eradicate infected weed hosts and vector colonies simultaneously."
      };
    }
  }

  // Fruit Borer
  if (q.includes("fruit borer") || q.includes("shoot borer") || q.includes("फल छेदक") || q.includes("तना छेदक") || q.includes("brinjal") || q.includes("बैंगन")) {
    const p = await Pest.findOne({ id: "fruit-borer" });
    if (p) {
      return {
        problem: isHindi ? p.nameHi : p.nameEn,
        causes: isHindi ? p.descriptionHi : p.descriptionEn,
        actions: isHindi ? p.controlHi : p.controlEn,
        precautions: isHindi ? p.preventionHi : p.preventionEn,
        disclaimer: isHindi 
          ? "तना और फल छेदक बैंगन की प्रमुख समस्या है। केवल सुरक्षित जैविक कीटनाशकों (जैसे Bt) का पहला प्रयोग करें।" 
          : "Avoid continuous sprays of the same insecticide class to prevent pest resistance."
      };
    }
  }

  // Armyworm
  if (q.includes("armyworm") || q.includes("लश्करी") || q.includes("कीट") || q.includes("fall armyworm")) {
    const p = await Pest.findOne({ id: "armyworm" });
    if (p) {
      return {
        problem: isHindi ? p.nameHi : p.nameEn,
        causes: isHindi ? p.descriptionHi : p.descriptionEn,
        actions: isHindi ? p.controlHi : p.controlEn,
        precautions: isHindi ? p.preventionHi : p.preventionEn,
        disclaimer: isHindi 
          ? "लश्करी कीट (फॉ़ल आर्मीवॉर्म) मक्के में अत्यधिक विनाशकारी है। सुबह के समय तने के भंवर में सीधे कीटनाशक डालें।" 
          : "Ensure chemical hits the central whorl of maize where larvae feed during the night."
      };
    }
  }

  // Thrips / Stem Borer
  if (q.includes("thrip") || q.includes("थ्रिप्स") || q.includes("stem borer") || q.includes("rice") || q.includes("धान")) {
    const p = (await Pest.findOne({ id: "stem-borer" })) || (await Pest.findOne({ id: "thrips" }));
    if (p) {
      return {
        problem: isHindi ? p.nameHi : p.nameEn,
        causes: isHindi ? p.descriptionHi : p.descriptionEn,
        actions: isHindi ? p.controlHi : p.controlEn,
        precautions: isHindi ? p.preventionHi : p.preventionEn,
        disclaimer: isHindi 
          ? "धान के तना छेदक के लिए जलभराव वाले क्षेत्रों में दानेदार कीटनाशक का सही समय पर छिड़काव आवश्यक है।" 
          : "Stem borer control requires granular application in water or systemic sprays prior to heading stage."
      };
    }
  }

  // 3. Post-Harvest storage guidelines query
  if (q.includes("storage") || q.includes("harvest") || q.includes("packag") || q.includes("clean") || q.includes("भंडारण") || q.includes("कटाई") || q.includes("पैकेजिंग")) {
    return {
      problem: isHindi ? "कटाई के बाद की सामान्य प्रबंधन नियमावली" : "Post-Harvest Operations & Storage Standards",
      causes: isHindi 
        ? "गलत भंडारण आर्द्रता, गीली उपज की कटाई और चूहों/कीटों का संक्रमण उपज को नष्ट करता है।" 
        : "Inadequate drying, mixing decayed produce, poor ventilation, and high warehouse temperature lead to rapid rot.",
      actions: isHindi 
        ? "1. अनाजों को भंडारण से पहले धूप में 12% से कम नमी तक सुखाएं।\n2. आलू और टमाटर के भंडारण के लिए हवादार जाल वाले बैगों या क्रेटों का उपयोग करें।" 
        : "1. Air-dry grains to <12% moisture on tarpaulins before bagging.\n2. Clean warehouses, sanitize crates, and maintain ventilation to prevent heat buildup.",
      precautions: isHindi 
        ? "आलू के साथ प्याज को न रखें। भंडारण कक्ष को कीड़ों और नमी से मुक्त रखें।" 
        : "Keep storage away from water leaks. Avoid storing ripening fruits close to potatoes or greens.",
      disclaimer: isHindi 
        ? "उत्तराखंड बागवानी विभाग की कोल्ड स्टोरेज नियमों का पालन करें।" 
        : "Review local cold storage guidelines for district-level transport and subsidy updates."
    };
  }

  // 4. Fertilizer Query
  if (q.includes("fertilizer") || q.includes("khad") || q.includes("उर्वरक") || q.includes("खाद") || q.includes("nitrogen") || q.includes("urea")) {
    return {
      problem: isHindi ? "उत्तराखंड पहाड़ी क्षेत्रों के लिए संतुलित उर्वरक प्रबंधन" : "Balanced Fertilization & Soil Health Advice",
      causes: isHindi 
        ? "केवल यूरिया का अत्यधिक उपयोग करने से मिट्टी खराब होती है और फसलों में कीटों का हमला बढ़ता है।" 
        : "Over-reliance on Nitrogen (Urea) without Phosphorus and Potassium leads to weak stems and high disease risk.",
      actions: isHindi 
        ? "1. मिट्टी परीक्षण के अनुसार N:P:K (120:60:40) का संतुलित उपयोग करें।\n2. भरपूर जैविक खाद (गोबर की सड़ी खाद) बुवाई के समय मिट्टी में मिलाएं।" 
        : "1. Apply Nitrogen, Phosphorus, and Potassium in balanced ratios (e.g. 120:60:40 for wheat).\n2. Incorporate Well-rotted Farm Yard Manure (FYM) or vermicompost to improve hill soil organic carbon.",
      precautions: isHindi 
        ? "खड़ी फसल में यूरिया का प्रयोग हमेशा हल्की सिंचाई या बारिश के तुरंत बाद करें।" 
        : "Avoid top-dressing urea under direct blazing sun. Ensure soil is moist to prevent nitrogen volatilization.",
      disclaimer: isHindi 
        ? "उर्वरक की सही मात्रा के लिए मृदा स्वास्थ्य कार्ड (Soil Health Card) की सिफारिशों का पालन करें।" 
        : "Please refer to local soil health card test results for precise micro-nutrient applications."
    };
  }

  // Default Fallback - Uncertainty & Hallucination Prevention
  return {
    problem: isHindi 
      ? "अतिरिक्त जानकारी आवश्यक है" 
      : "Additional Information Required",
    causes: isHindi 
      ? "प्रदान किए गए लक्षण किसी विशिष्ट फसल रोग, कीट या पोषण की कमी की पहचान करने के लिए पर्याप्त नहीं हैं। गलत सलाह से बचने के लिए, हम अनुमान नहीं लगा सकते।" 
      : "The details provided are insufficient to identify a specific crop disease, pest, or deficiency with reasonable confidence. To prevent misdiagnosis, we cannot guess.",
    actions: isHindi 
      ? "कृपया निम्नलिखित जानकारी प्रदान करें:\n1. फसल का प्रकार और पौधे की उम्र क्या है?\n2. पत्तियों, तने या फल पर लक्षणों का स्पष्ट वर्णन करें (जैसे रंग, धब्बे, छेद)।\n3. हाल के मौसम की स्थिति क्या है (जैसे अधिक वर्षा, पाला, आर्द्रता)?\n4. यदि संभव हो तो प्रभावित हिस्से की एक स्पष्ट तस्वीर साझा करें।" 
      : "Please provide more details:\n1. What is the crop type and plant age?\n2. Describe the symptoms on leaves, stem, or fruit (e.g., spot color, hole patterns, insect shapes).\n3. What are the recent weather conditions (e.g., heavy rain, frost, high humidity)?\n4. Share a photograph of the affected plant if possible.",
    precautions: isHindi 
      ? "केवल सामान्य सुरक्षात्मक जैविक दिशानिर्देशों को अपनाएं (जैसे प्रभावित भागों को हटाना, खेत की स्वच्छता, जल निकासी)। निदान की पुष्टि होने तक किसी भी रासायनिक कीटनाशक का प्रयोग न करें।" 
      : "Adopt only general preventive organic guidelines (e.g., remove affected foliage manually, maintain field sanitation, improve drainage). Do not apply chemical treatments until a proper diagnosis is verified.",
    disclaimer: isHindi 
      ? "सामान्य लक्षणों के आधार पर कभी भी रासायनिक कीटनाशकों या उर्वरकों का प्रयोग न करें। ब्लॉक विस्तार अधिकारी या केवीके वैज्ञानिकों से इसकी पुष्टि करें।" 
      : "Never apply chemical pesticides or fertilizers based on generic symptoms. Verify with local extension officers or a KVK scientist."
  };
}

// Global status cache derived from actual requests
export let lastChatStatus = {
  online: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ""),
  fallbackReason: null,
  lastChecked: Date.now()
};

const getModelDisplayName = () => {
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return modelName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const classifyError = (error) => {
  if (!error) return "API unavailable";
  const msg = error.message ? error.message.toLowerCase() : "";
  if (msg.includes("quota") || msg.includes("429") || msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Rate limit exceeded";
  }
  if (msg.includes("timeout") || msg.includes("etimedout")) {
    return "Timeout";
  }
  if (msg.includes("network") || msg.includes("econnrefused") || msg.includes("fetch")) {
    return "Network error";
  }
  if (msg.includes("503") || msg.includes("service unavailable") || msg.includes("not found") || msg.includes("404")) {
    return "API unavailable";
  }
  return "API unavailable";
};

class ChatService {
  async ask(query, isHindi = false, temp = 0.2) {
    const model = getGeminiModel();
    if (!model) {
      console.log("No Gemini API key detected, triggering offline keyword diagnostics.");
      lastChatStatus.online = false;
      lastChatStatus.fallbackReason = "API unavailable";
      lastChatStatus.lastChecked = Date.now();

      const offlineResponse = await getOfflineAdvisory(query, isHindi);
      return {
        response: offlineResponse,
        source: "offline",
        model: getModelDisplayName(),
        fallbackReason: "API unavailable"
      };
    }

    try {
      // Find matching context from DB dynamically using regex searches
      const searchResults = await searchService.search(query);
      let contextString = "";
      
      if (searchResults.crops.length > 0) {
        contextString += "\nCrops Context:\n" + searchResults.crops.map(c => 
          `- Crop: ${c.nameEn} (${c.scientificName}). Description: ${c.descriptionEn}`
        ).join("\n") + "\n";
      }
      if (searchResults.diseases.length > 0) {
        contextString += "\nDiseases Context:\n" + searchResults.diseases.map(d => 
          `- Disease: ${d.nameEn} (Pathogen: ${d.pathogen}). Symptoms: ${d.symptomsEn}. Prevention: ${d.preventionEn}. Treatment: ${d.treatmentEn}`
        ).join("\n") + "\n";
      }
      if (searchResults.pests.length > 0) {
        contextString += "\nPests Context:\n" + searchResults.pests.map(p => 
          `- Pest: ${p.nameEn}. Description: ${p.descriptionEn}. Prevention: ${p.preventionEn}. Control: ${p.controlEn}`
        ).join("\n") + "\n";
      }

      const languageText = isHindi 
        ? "Hindi (हिंदी) language. Ensure all translations are natural, localized for Uttarakhand, and written in Devanagari script." 
        : "English language. Use clear professional terminology.";

      const systemPrompt = `
You are a senior agricultural scientist advising field supervisors in Uttarakhand, India.
Your task is to analyze the supervisor's query and provide professional, practical, and highly detailed agricultural guidance.

Use the following context from our official database if relevant to the query:
${contextString || "No specific database context matches the query. Provide professional guidance based on general organic agronomy practices."}

You MUST respond ONLY with a valid JSON object. Do not include markdown code fence wrappers (like \`\`\`json) or any pre/post text. Just return the raw JSON object.

Uncertainty & Hallucination Prevention Rules:
- If the symptoms described in the User Query are insufficient to identify a disease, pest, or deficiency with reasonable confidence, DO NOT GUESS.
- Instead, set "problem" to "Additional Information Required" (or Hindi translation). In "causes" and "actions", ask the supervisor for specific symptoms, crop type, plant age, weather conditions, or photographs. In "precautions", provide ONLY general organic preventive guidance and tell them to avoid chemical treatments until verified.
- NEVER invent or hallucinate pesticide names, chemical dosages, government recommendations, or scientific facts.

The JSON object MUST contain exactly these five keys, and the values must be strings:
{
  "problem": "Name of the crop disease, pest, or deficiency identified. If information is insufficient, set to 'Additional Information Required'.",
  "causes": "Detailed scientific and environmental causes. If details are insufficient, list what environmental and plant details are missing.",
  "actions": "Step-by-step recommended actions. Include organic/preventative actions first, followed by specific chemical controls (giving exact dosages like '2g/L') or technical practices. If details are insufficient, request specific symptoms, crop type, plant age, weather, or photos.",
  "precautions": "Precautions to take during spraying, harvesting, packing, or storing. If details are insufficient, provide only general organic preventions.",
  "disclaimer": "A brief verification disclaimer reminding supervisors to check symptoms with local block extension staff or a Krishi Vigyan Kendra (KVK) scientist before massive chemical treatments."
}

User Query: "${query}"
Language: Respond in ${languageText}
`;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: systemPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: parseFloat(temp) || 0.2
        }
      });
      const response = await result.response;
      const responseText = response.text().trim();

      // Clean any markdown wrapper formatting if Gemini returned it despite instructions
      let jsonText = responseText;
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }

      let parsedAdvisory;
      try {
        const parsed = JSON.parse(jsonText);
        const requiredKeys = ["problem", "causes", "actions", "precautions", "disclaimer"];
        const hasAllKeys = requiredKeys.every(key => key in parsed);

        if (hasAllKeys) {
          parsedAdvisory = parsed;
        } else {
          throw new Error("Missing keys in JSON");
        }
      } catch (e) {
        console.warn("Gemini response was not formatted in structured JSON. Parsing manually...", e);
        parsedAdvisory = {
          problem: isHindi ? "विशेषज्ञ एआई विश्लेषण रिपोर्ट" : "AI Specialist Diagnostic Report",
          causes: responseText.slice(0, 400) + "...",
          actions: isHindi ? "कृपया सलाह के मुख्य विवरण को नीचे दी गई प्रतिक्रिया में पढ़ें।" : "Please read the full response details in the main stream.",
          precautions: isHindi ? "छिड़काव के समय सामान्य सुरक्षा सावधानियां अपनाएं।" : "Adopt standard environmental safety protocols.",
          disclaimer: isHindi 
            ? "सलाहकार रिपोर्ट की पुष्टि जिला ब्लॉक कार्यालय से अवश्य करें।" 
            : "Verify recommendation details with your local block extension office.",
          rawText: responseText
        };
      }

      // Successful call: update cache
      lastChatStatus.online = true;
      lastChatStatus.fallbackReason = null;
      lastChatStatus.lastChecked = Date.now();

      return {
        response: parsedAdvisory,
        source: "gemini",
        model: getModelDisplayName(),
        fallbackReason: null
      };

    } catch (error) {
      console.error("Gemini API error in backend, falling back to local keywords:", error);
      const reason = classifyError(error);
      
      // Failed call: update cache
      lastChatStatus.online = false;
      lastChatStatus.fallbackReason = reason;
      lastChatStatus.lastChecked = Date.now();

      const offlineResponse = await getOfflineAdvisory(query, isHindi);
      return {
        response: offlineResponse,
        source: "offline",
        model: getModelDisplayName(),
        fallbackReason: reason
      };
    }
  }
}

export default new ChatService();
