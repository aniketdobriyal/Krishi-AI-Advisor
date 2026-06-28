// In-memory Database for Krishi AI Advisor
// This mimics a database state that can be transitioned to MongoDB in Week 5

export const crops = [
  {
    id: "tomato",
    nameEn: "Tomato",
    nameHi: "टमाटर",
    scientificName: "Solanum lycopersicum",
    descriptionEn: "Highly popular vegetable crop grown across Uttarakhand hills and plains, susceptible to blight and wilt under high humidity.",
    descriptionHi: "उत्तराखंड के पर्वतीय और मैदानी क्षेत्रों में उगाई जाने वाली लोकप्रिय सब्जी फसल, जो उच्च आर्द्रता में झुलसा और म्लानि रोग के प्रति संवेदनशील है।",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "potato",
    nameEn: "Potato",
    nameHi: "आलू",
    scientificName: "Solanum tuberosum",
    descriptionEn: "Major cash crop in hill districts like Almora, Nainital, and Uttarkashi, requiring cool climates and disease-free seeds.",
    descriptionHi: "अल्मोड़ा, नैनीताल और उत्तरकाशी जैसे पहाड़ी जिलों की प्रमुख नकदी फसल, जिसे ठंडी जलवायु और रोग-मुक्त बीजों की आवश्यकता होती है।",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "wheat",
    nameEn: "Wheat",
    nameHi: "गेहूं",
    scientificName: "Triticum aestivum",
    descriptionEn: "Primary rabi crop in the valleys and plains of Uttarakhand, prone to rust diseases during warm springs.",
    descriptionHi: "उत्तराखंड की घाटियों और मैदानों की प्राथमिक रबी फसल, जो गर्म वसंत ऋतु के दौरान गेरूई (रस्ट) रोगों के प्रति संवेदनशील होती है।",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "rice",
    nameEn: "Rice (Paddy)",
    nameHi: "धान (चावल)",
    scientificName: "Oryza sativa",
    descriptionEn: "Main kharif crop in the valleys and Terai regions, requiring standing water and protection from stem borers.",
    descriptionHi: "घाटियों और तराई क्षेत्रों की मुख्य खरीफ फसल, जिसे खड़े पानी और तना छेदक से सुरक्षा की आवश्यकता होती है।",
    image: "https://images.unsplash.com/photo-1536657464919-8925412993d3?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "maize",
    nameEn: "Maize",
    nameHi: "मक्का",
    scientificName: "Zea mays",
    descriptionEn: "Cultivated in both hills and plains during monsoon, providing grain and fodder. Prone to leaf spot and armyworm.",
    descriptionHi: "मानसून के दौरान पहाड़ों और मैदानों दोनों में उगाई जाने वाली फसल, जो अनाज और चारा प्रदान करती है। पत्ती धब्बा और लश्करी कीट के प्रति संवेदनशील।",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "beans",
    nameEn: "Kidney Beans (Rajma)",
    nameHi: "राजमा (बीन)",
    scientificName: "Phaseolus vulgaris",
    descriptionEn: "High-value specialty crop of Harshil, Munsiari and other high-altitude regions of Uttarakhand, demanding proper storage.",
    descriptionHi: "हर्षिल, मुनस्यारी और उत्तराखंड के अन्य उच्च ऊंचाई वाले क्षेत्रों की उच्च मूल्य वाली विशिष्ट फसल, जिसे उचित भंडारण की आवश्यकता होती है।",
    image: "https://images.unsplash.com/photo-1551893665-f8a9150c9aa8?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "mustard",
    nameEn: "Mustard",
    nameHi: "सरसों",
    scientificName: "Brassica juncea",
    descriptionEn: "Important oilseed crop grown in rabi season, requiring cold climate and protection from aphids and powdery mildew.",
    descriptionHi: "रबी सीजन में उगाई जाने वाली महत्वपूर्ण तिलहन फसल, जिसे ठंडी जलवायु और एफिड्स तथा चूर्णिल आसिता से सुरक्षा की आवश्यकता होती है।",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "brinjal",
    nameEn: "Brinjal (Eggplant)",
    nameHi: "बैंगन",
    scientificName: "Solanum melongena",
    descriptionEn: "Warm-season vegetable cultivated widely, prone to shoot & fruit borer and bacterial wilt.",
    descriptionHi: "व्यापक रूप से उगाई जाने वाली गर्म मौसम की सब्जी, जो फल व तना छेदक और जीवाणु म्लानि रोग के प्रति संवेदनशील है।",
    image: "https://images.unsplash.com/photo-1615485500704-8f990f2400f9?w=600&auto=format&fit=crop&q=80"
  }
];

export const diseases = [
  {
    id: "late-blight",
    nameEn: "Late Blight",
    nameHi: "पछेती झुलसा",
    pathogen: "Phytophthora infestans",
    cropIds: ["tomato", "potato"],
    symptomsEn: "Water-soaked dark spots on leaves, rapidly turning brown/black with white fuzzy mold growth on the undersides during humid weather.",
    symptomsHi: "पत्तियों पर पानी से भीगे हुए काले धब्बे, जो तेजी से भूरे/काले हो जाते हैं और नम मौसम के दौरान पत्तियों के निचले हिस्से पर सफेद फफूंद उग आती है।",
    preventionEn: "Use certified disease-free seeds, avoid overhead irrigation, maintain plant spacing for ventilation, and practice crop rotation.",
    preventionHi: "प्रमाणित रोग-मुक्त बीजों का उपयोग करें, फव्वारा सिंचाई से बचें, हवा के संचार के लिए पौधों के बीच उचित दूरी रखें और फसल चक्र अपनाएं।",
    treatmentEn: "Spray Copper Oxychloride (3g/L) or Mancozeb (2g/L) immediately upon symptom detection. For organic farming, apply Trichoderma viride formulations.",
    treatmentHi: "लक्षण दिखने पर तुरंत कॉपर ऑक्सीक्लोराइड (3 ग्राम/लीटर) या मैंकोजेब (2 ग्राम/लीटर) का छिड़काव करें। जैविक खेती के लिए ट्राइकोडर्मा विरिडी का प्रयोग करें।",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "rust",
    nameEn: "Rust",
    nameHi: "गेरूई / रस्ट",
    pathogen: "Puccinia graminis",
    cropIds: ["wheat"],
    symptomsEn: "Orange-brown, powdery pustules appearing on leaves and stems resembling iron rust, leading to reduced grain filling.",
    symptomsHi: "पत्तियों और तनों पर नारंगी-भूरे रंग के पाउडर जैसे छाले दिखाई देना जो लोहे के जंग जैसे लगते हैं, जिससे दाने छोटे रह जाते हैं।",
    preventionEn: "Sow rust-resistant varieties (e.g., HPW series developed for hills), avoid late sowing, and balance nitrogen fertilizer application.",
    preventionHi: "रस्ट-प्रतिरोधी किस्मों (जैसे पहाड़ी क्षेत्रों के लिए विकसित HPW श्रृंखला) की बुवाई करें, देर से बुवाई से बचें, और नाइट्रोजन उर्वरक का संतुलित प्रयोग करें।",
    treatmentEn: "Apply Propiconazole 25 EC (1 ml/L) or Tebuconazole (1g/L) at the onset of rust pustules.",
    treatmentHi: "रस्ट के लक्षण दिखाई देने पर प्रोपिकोनाजोल 25 ईसी (1 मिली/लीटर) या टेबुकोनाजोल (1 ग्राम/लीटर) का छिड़काव करें।",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "powdery-mildew",
    nameEn: "Powdery Mildew",
    nameHi: "चूर्णिल आसिता (पाउडरी मिल्ड्यू)",
    pathogen: "Erysiphe polygoni / Erysiphe cruciferarum",
    cropIds: ["beans", "mustard"],
    symptomsEn: "White, powdery patches appearing on the upper surface of leaves, stems, and pods, causing leaves to yellow and drop prematurely.",
    symptomsHi: "पत्तियों, तनों और फलियों की ऊपरी सतह पर सफेद, पाउडर जैसे धब्बे दिखाई देना, जिससे पत्तियां पीली होकर समय से पहले गिर जाती हैं।",
    preventionEn: "Ensure adequate spacing for sunlight penetration, remove infected plant debris, and sow tolerant crop varieties.",
    preventionHi: "धूप के प्रवेश के लिए पौधों के बीच पर्याप्त जगह सुनिश्चित करें, संक्रमित पौधों के अवशेषों को हटा दें, और सहनशील किस्मों की बुवाई करें।",
    treatmentEn: "Spray Wettable Sulphur (2.5g/L) or Dinocap (1 ml/L). For organic solutions, spray neem oil (5 ml/L) or baking soda solution.",
    treatmentHi: "घुलनशील सल्फर (2.5 ग्राम/लीटर) या डिनोकैप (1 मिली/लीटर) का छिड़काव करें। जैविक समाधान के लिए नीम तेल (5 मिली/लीटर) या बेकिंग सोडा घोल का छिड़काव करें।",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "bacterial-wilt",
    nameEn: "Bacterial Wilt",
    nameHi: "जीवाणु म्लानि (विल्ट)",
    pathogen: "Ralstonia solanacearum",
    cropIds: ["tomato", "potato", "brinjal"],
    symptomsEn: "Rapid wilting of the plant starting from top leaves down during warm daytime, without initial yellowing. Stem cutting leaks white bacterial slime in water.",
    symptomsHi: "गर्म दिन के दौरान बिना किसी शुरुआती पीलेपन के पौधे का ऊपर से नीचे की ओर तेजी से मुरझाना। तने को काटकर पानी में डालने पर सफेद जीवाणु का स्राव निकलता है।",
    preventionEn: "Implement strict crop rotation (avoid solanaceous crops for 3 years), maintain soil pH around 6.5-7.0, and plant resistant rootstocks.",
    preventionHi: "सख्त फसल चक्र लागू करें (3 वर्षों तक सोलेनेसी परिवार की फसलों से बचें), मिट्टी का pH 6.5-7.0 के आसपास रखें, और प्रतिरोधी किस्मों का उपयोग करें।",
    treatmentEn: "No direct chemical cure exists. Drench soil with Streptocycline (0.1g/L) + Copper Oxychloride (2.5g/L) to prevent spreading. Remove and burn infected plants.",
    treatmentHi: "कोई सीधा रासायनिक उपचार उपलब्ध नहीं है। प्रसार रोकने के लिए स्ट्रेप्टोसाइक्लिन (0.1 ग्राम/लीटर) + कॉपर ऑक्सीक्लोराइड (2.5 ग्राम/लीटर) से मिट्टी का उपचार करें। संक्रमित पौधों को उखाड़कर जला दें।",
    image: "https://images.unsplash.com/photo-1615485500704-8f990f2400f9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "leaf-spot",
    nameEn: "Leaf Spot",
    nameHi: "पत्ती धब्बा रोग",
    pathogen: "Alternaria brassicae / Cercospora spp.",
    cropIds: ["mustard", "maize", "beans"],
    symptomsEn: "Small, circular brown or black spots with concentric rings (target board appearance) on leaves, leading to defoliation.",
    symptomsHi: "पत्तियों पर संकेंद्रीय छल्लों (निशाने जैसे बोर्ड) के साथ छोटे, गोलाकार भूरे या काले धब्बे बनना, जिससे पत्तियां झड़ने लगती हैं।",
    preventionEn: "Clean cultivation, destroy weed hosts, treat seeds with Thiram (2.5g/kg), and optimize nitrogenous fertilizer levels.",
    preventionHi: "स्वच्छ खेती करें, खरपतवारों को नष्ट करें, थीरम (2.5 ग्राम/किग्रा) से बीजोपचार करें, और नाइट्रोजन उर्वरक के स्तर को संतुलित रखें।",
    treatmentEn: "Spray Mancozeb (2g/L) or Carbendazim (1g/L) at intervals of 10-14 days upon observation.",
    treatmentHi: "लक्षण दिखने पर 10-14 दिनों के अंतराल पर मैंकोजेब (2 ग्राम/लीटर) या कार्बेन्डाजिम (1 ग्राम/लीटर) का छिड़काव करें।",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80"
  }
];

export const pests = [
  {
    id: "aphids",
    nameEn: "Aphids",
    nameHi: "माहू (एफिड्स)",
    cropIds: ["mustard", "beans", "potato"],
    descriptionEn: "Tiny, soft-bodied insects sucking sap from buds and undersides of leaves, secreting honey-dew which attracts sooty mold.",
    descriptionHi: "छोटे, कोमल शरीर वाले कीट जो कलियों और पत्तियों के निचले हिस्से से रस चूसते हैं, और शहद जैसा पदार्थ स्रावित करते हैं जिससे काली फफूंद लगती है।",
    preventionEn: "Sow early to escape high aphid population, install yellow sticky traps (15-20 per acre), and protect natural predators like ladybird beetles.",
    preventionHi: "एफिड्स की अधिक आबादी से बचने के लिए अगेती बुवाई करें, पीले चिपचिपे जाल (15-20 प्रति एकड़) लगाएं, और लेडीबर्ड बीटल जैसे प्राकृतिक शिकारियों की रक्षा करें।",
    controlEn: "Spray Neem Oil (5ml/L) or Dimethoate 30 EC (1.5 ml/L) or Imidacloprid (0.5 ml/L) in severe cases.",
    controlHi: "नीम का तेल (5 मिली/लीटर) या गंभीर मामलों में डायमेथोएट 30 ईसी (1.5 मिली/लीटर) या इमिडाक्लोप्रिड (0.5 मिली/लीटर) का छिड़काव करें।"
  },
  {
    id: "whiteflies",
    nameEn: "Whiteflies",
    nameHi: "सफेद मक्खी",
    cropIds: ["tomato", "brinjal", "beans"],
    descriptionEn: "Minute white-winged insects sucking sap and acting as vectors for deadly viruses like Tomato Leaf Curl Virus.",
    descriptionHi: "सफेद पंखों वाले सूक्ष्म कीट जो रस चूसते हैं और टमाटर पर्ण कुंचन (लीफ कर्ल) जैसे घातक वायरसों के वाहक के रूप में कार्य करते हैं।",
    preventionEn: "Install yellow sticky traps, use insect-proof net nurseries, and avoid growing solanaceous crops continuously.",
    preventionHi: "पीले चिपचिपे जाल लगाएं, कीट-रोधी नेट नर्सरी का उपयोग करें, और लगातार सोलेनेसी फसलों को उगाने से बचें।",
    controlEn: "Spray Neem Seed Kernel Extract (NSKE 5%) or Acetamiprid 20 SP (0.5g/L) or Diafenthiuron (1g/L) for control.",
    controlHi: "नियंत्रण के लिए नीम बीज गिरी अर्क (NSKE 5%) या एसिटामिप्रिड 20 एसपी (0.5 ग्राम/लीटर) या डायफेन्थियूरॉन (1 ग्राम/लीटर) का छिड़काव करें।"
  },
  {
    id: "fruit-borer",
    nameEn: "Shoot & Fruit Borer",
    nameHi: "फल व तना छेदक",
    cropIds: ["tomato", "brinjal"],
    descriptionEn: "Caterpillars boring into shoots causing wilting, and later into fruits making them unfit for consumption and sale.",
    descriptionHi: "इल्लियां जो तनों में छेद करके उन्हें मुरझा देती हैं, और बाद में फलों में छेद करके उन्हें खाने और बेचने के अयोग्य बना देती हैं।",
    preventionEn: "Intercrop with marigold as a trap crop, collect and destroy affected shoots/fruits, and install pheromone traps (5 per acre).",
    preventionHi: "गेंदे की सह-फसली खेती करें (ट्रैप क्रॉप), प्रभावित तनों/फलों को इकट्ठा करके नष्ट करें, और फेरोमोन ट्रैप (5 प्रति एकड़) लगाएं।",
    controlEn: "Spray Bacillus thuringiensis (Bt) formulations (2g/L) or Spinosad 45 SC (0.3 ml/L) or Chlorantraniliprole 18.5 SC (0.4 ml/L).",
    controlHi: "बैसिलस थुरिंगिएंसिस (Bt) फॉ़र्मूलेशन (2 ग्राम/लीटर) या स्पिनोसैड 45 एससी (0.3 मिली/लीटर) या क्लोरेंट्रानिलिप्रोल 18.5 एससी (0.4 मिली/लीटर) का छिड़काव करें।"
  },
  {
    id: "armyworm",
    nameEn: "Armyworm",
    nameHi: "लश्करी कीट",
    cropIds: ["maize", "rice", "wheat"],
    descriptionEn: "Voracious defoliating pest feeding on crop foliage in groups, leaving leaves skeletal. Highly destructive in maize (Fall Armyworm).",
    descriptionHi: "पत्तियों को खाने वाला विनाशकारी कीट जो समूहों में फसल के पत्तों को खाता है और केवल शिराएं छोड़ता है। मक्के में अत्यधिक विनाशकारी (फॉल आर्मीवॉर्म)।",
    preventionEn: "Deep summer plowing to expose pupae, install pheromone traps, and perform crop monitoring in early morning/late evening.",
    preventionHi: "प्यूपा को नष्ट करने के लिए गर्मियों में गहरी जुताई करें, फेरोमोन जाल लगाएं, और सुबह/देर शाम खेतों की निगरानी करें।",
    controlEn: "Apply Emamectin Benzoate 5 SG (0.4g/L) or Spinetoram 11.7 SC (0.5 ml/L) targeting the plant whorl.",
    controlHi: "पौधे के बीच के भाग (भंवर) को लक्षित करते हुए इमामेक्टिन बेंजोएट 5 एसजी (0.4 ग्राम/लीटर) या स्पिनेटोरम 11.7 एससी (0.5 मिली/लीटर) का छिड़काव करें।"
  },
  {
    id: "thrips",
    nameEn: "Thrips",
    nameHi: "थ्रिप्स",
    cropIds: ["mustard", "beans", "tomato", "brinjal"],
    descriptionEn: "Very small, slender insects causing upward curling of leaves, silvery scars, and dry leaf tips by scraping tissues.",
    descriptionHi: "अत्यधिक छोटे, पतले कीट जो ऊतकों को खरोंचकर पत्तियों के ऊपर की ओर मुड़ने, चांदी जैसे निशानों और पत्ती के सिरों के सूखने का कारण बनते हैं।",
    preventionEn: "Install blue sticky traps (15-20 per acre), maintain field sanitation, and use overhead sprinkler systems to wash off thrips.",
    preventionHi: "नीले चिपचिपे जाल (15-20 प्रति एकड़) लगाएं, खेत की स्वच्छता बनाए रखें, और थ्रिप्स को धोने के लिए फव्वारा सिंचाई प्रणाली का उपयोग करें।",
    controlEn: "Spray Fipronil 5 SC (2 ml/L) or spinosad 45 SC (0.3 ml/L).",
    controlHi: "फिप्रोनिल 5 एससी (2 मिली/लीटर) या स्पिनोसैड 45 एससी (0.3 मिली/लीटर) का छिड़काव करें।"
  },
  {
    id: "stem-borer",
    nameEn: "Stem Borer",
    nameHi: "तना छेदक",
    cropIds: ["rice", "maize"],
    descriptionEn: "Larvae boring into stems causing 'dead hearts' in young tillers or 'whiteheads' in mature rice plants, leaving empty grains.",
    descriptionHi: "लार्वो जो तनों में छेद करते हैं जिससे युवा कल्लों में 'डेड हार्ट' या पके हुए धान के पौधों में खाली बालियां (सफेद बालियां) बनती हैं।",
    preventionEn: "Clip leaf tips of seedlings before transplanting to destroy egg masses, release Trichogramma japonicum parasites, and harvest close to ground level.",
    preventionHi: "अंडे के समूहों को नष्ट करने के लिए रोपाई से पहले पौध की पत्तियों के सिरों को काट लें, ट्राइकोगामा जैपोनिकम परजीवी छोड़ें, और जमीन के पास से कटाई करें।",
    controlEn: "Apply Cartap Hydrochloride 4G granules (10 kg/acre) in standing water, or spray Chlorantraniliprole 18.5 SC (0.4 ml/L).",
    controlHi: "खड़े पानी में कारटाप हाइड्रोक्लोराइड 4G दानेदार (10 किग्रा/एकड़) डालें, या क्लोरेंट्रानिलिप्रोल 18.5 एससी (0.4 मिली/लीटर) का छिड़काव करें।"
  }
];

export const postHarvestGuides = [
  {
    id: "harvesting",
    titleEn: "Harvesting Practices",
    titleHi: "कटाई के तरीके",
    descriptionEn: "Correct timing and picking techniques determine crop shelf life and prevent post-harvest loss.",
    descriptionHi: "सही समय और तुड़ाई तकनीक फसल की शेल्फ लाइफ निर्धारित करती है और कटाई के बाद के नुकसान को रोकती है।",
    icon: "Scissors",
    itemsEn: [
      "Harvest tomatoes at the 'breaker' stage (slight pink at blossom end) for distant markets, and red-ripe for local consumption.",
      "Harvest wheat when grains are hard and dry (moisture below 12-14%). Straw should be completely golden and brittle.",
      "Harvest potatoes 10-14 days after skin-curing (dehalming or cutting leaves) to allow the potato skin to mature and resist bruising.",
      "Pick beans/rajma pods when they are fully dry and turn yellowish-brown but before they shatter.",
      "Harvest maize when the husks turn papery and brown, and grain moisture drops to 15-20%."
    ],
    itemsHi: [
      "दूर के बाजारों के लिए टमाटर की तुड़ाई 'ब्रेकर' अवस्था (फूल के सिरे पर हल्का गुलाबी रंग) पर करें, और स्थानीय खपत के लिए पूरी तरह लाल होने पर करें।",
      "गेहूं की कटाई तब करें जब दाने कड़े और सूखे हों (नमी 12-14% से कम)। पुआल पूरी तरह से सुनहरा और भंगुर होना चाहिए।",
      "आलू की त्वचा को परिपक्व करने और खरोंच प्रतिरोधी बनाने के लिए पत्तियों की कटाई (डीहामिंग) के 10-14 दिन बाद खुदाई करें।",
      "राजमा/बीन की फलियों की तुड़ाई तब करें जब वे पूरी तरह सूख जाएं और पीली-भूरी हो जाएं, लेकिन उनके चटकने से पहले।",
      "मक्के की कटाई तब करें जब छिलके कागज जैसे और भूरे हो जाएं और दानों की नमी 15-20% तक गिर जाए।"
    ]
  },
  {
    id: "cleaning-sorting",
    titleEn: "Cleaning & Sorting",
    titleHi: "सफाई और छँटाई",
    descriptionEn: "Removing soil, damaged items, and weeds protects healthy crops from decay spreading.",
    descriptionHi: "मिट्टी, क्षतिग्रस्त उपज और खरपतवारों को हटाने से स्वस्थ फसल सड़ने से बचती है।",
    icon: "Sparkles",
    itemsEn: [
      "Wipe harvested tomatoes with clean damp cloth; do not wash them in stagnant field water to prevent fungal contamination.",
      "Sort out sun-burnt, pest-attacked, green-shouldered, and bruised fruits immediately to halt rot spread.",
      "Grade potatoes based on size (Extra Large, Medium, Small/Seed size) and discard rotten or green potatoes.",
      "Winnow wheat grains to remove chaff, dust, weed seeds, and broken kernels.",
      "Dry cleaned grains on clean tarpaulins under direct sun to reach safe storage moisture levels."
    ],
    itemsHi: [
      "कटे हुए टमाटरों को साफ गीले कपड़े से पोंछें; फफूंद के संदूषण को रोकने के लिए उन्हें खेत के ठहरे हुए पानी में न धोएं।",
      "सड़न के प्रसार को रोकने के लिए धूप से झुलसे, कीट-प्रभावित, हरे कंधे वाले और खरोंच वाले फलों को तुरंत अलग करें।",
      "आकार के आधार पर आलू की ग्रेडिंग करें (अतिरिक्त बड़ा, मध्यम, छोटा/बीज आकार) और सड़े या हरे आलुओं को फेंक दें।",
      "भूसा, धूल, खरपतवार के बीज और टूटे दानों को हटाने के लिए गेहूं के दानों को ओसाएं।",
      "सुरक्षित भंडारण नमी स्तर तक पहुंचने के लिए साफ दानों को सीधे धूप में साफ तिरपाल पर सुखाएं।"
    ]
  },
  {
    id: "packaging",
    titleEn: "Packaging Methods",
    titleHi: "पैकेजिंग के तरीके",
    descriptionEn: "Proper materials cushion produce, avoid sweat accumulation, and facilitate transport.",
    descriptionHi: "उचित पैकेजिंग सामग्री उपज को सुरक्षा देती है, उमस जमा होने से रोकती है, और परिवहन को सुगम बनाती है।",
    icon: "Package",
    itemsEn: [
      "Pack tomatoes in well-ventilated plastic crates; avoid using deep wooden boxes that crush bottom layers.",
      "Use clean, dry gunny bags (preferably food-grade HDPE or jute) for storing grains like wheat, rice, and beans.",
      "Use leno bags (mesh bags) for potato packaging to ensure maximum airflow and prevent sprouting.",
      "Never mix different crop varieties or grades in the same packaging unit.",
      "Label crates and bags with crop type, grade, harvest date, and origin village for traceability."
    ],
    itemsHi: [
      "टमाटरों को हवादार प्लास्टिक क्रेटों में पैक करें; गहरे लकड़ी के बक्सों का उपयोग करने से बचें जो नीचे की परतों को कुचल देते हैं।",
      "गेहूं, चावल और बीन्स जैसे अनाजों के भंडारण के लिए साफ, सूखी बोरी (अधिमानतः खाद्य-ग्रेड एचडीपीई या जूट) का उपयोग करें।",
      "अधिकतम वायु प्रवाह सुनिश्चित करने और अंकुरण को रोकने के लिए आलू की पैकेजिंग के लिए लैनो बैग (जाल वाले बैग) का उपयोग करें।",
      "एक ही पैकेजिंग यूनिट में अलग-अलग फसलों की किस्मों या ग्रेडों को कभी न मिलाएं।",
      "ट्रेसेबिलिटी के लिए क्रेटों और बैगों पर फसल का प्रकार, ग्रेड, कटाई की तारीख और मूल गांव का नाम अंकित करें।"
    ]
  },
  {
    id: "storage",
    titleEn: "Storage Conditions",
    titleHi: "भंडारण की स्थिति",
    descriptionEn: "Climate control in storage units keeps molds away and extends market availability.",
    descriptionHi: "भंडारण इकाइयों में तापमान और नमी नियंत्रण फफूंद को दूर रखता है और बाजार में उपलब्धता बढ़ाता है।",
    icon: "Home",
    itemsEn: [
      "Store tomatoes at 12-15°C and 85-90% Relative Humidity. Never store them below 10°C as they suffer chilling injury.",
      "Store potatoes in cool, dark, well-ventilated godowns or cold storage (2-4°C for table potatoes) to prevent sprouting.",
      "Maintain grain moisture below 12% in silos or hermetic bags to prevent weevil infestations and mold.",
      "Keep storage areas free from rodents and dampness; raise bags on wooden pallets at least 6 inches off the floor.",
      "Do not store onions/garlic next to potatoes or tomatoes, as they release ethylene gas that speeds up spoilage."
    ],
    itemsHi: [
      "टमाटरों को 12-15°C तापमान and 85-90% सापेक्ष आर्द्रता पर स्टोर करें। उन्हें कभी भी 10°C से नीचे न रखें क्योंकि उन्हें पाला (चिलिंग इंजरी) लग सकता है।",
      "अंकुरण को रोकने के लिए आलुओं को ठंडे, अंधेरे, हवादार गोदामों या कोल्ड स्टोरेज (खाने वाले आलू के लिए 2-4°C) में स्टोर करें।",
      "घुन के प्रकोप और फफूंद को रोकने के लिए साइलो या वायुरोधी (हर्मेटिक) बैगों में अनाज की नमी 12% से नीचे बनाए रखें।",
      "भंडारण क्षेत्रों को कृन्तकों (चूहों) और नमी से मुक्त रखें; बोरियों को फर्श से कम से कम 6 इंच ऊपर लकड़ी के पैलेट पर रखें।",
      "प्याज/लहसुन को आलू या टमाटर के पास न रखें, क्योंकि वे एथिलीन गैस छोड़ते हैं जो सड़ने की गति तेज करती है।"
    ]
  },
  {
    id: "transportation",
    titleEn: "Transportation Guidelines",
    titleHi: "परिवहन दिशानिर्देश",
    descriptionEn: "Rules to reduce mechanical damage, vibration, and temperature abuse during transit.",
    descriptionHi: "परिवहन के दौरान यांत्रिक क्षति, कंपन और अनुचित तापमान के प्रभाव को कम करने के नियम।",
    icon: "Truck",
    itemsEn: [
      "Transport perishable items like tomatoes during cooler hours (night or early morning) to prevent heat buildup.",
      "Stack crates securely in trucks to avoid shifting and bruising on mountainous Himalayan roads.",
      "Cover open trucks with tarpaulins to protect grains and produce from unexpected rain and direct sun.",
      "Ensure vehicles are thoroughly cleaned before loading; do not transport crops in trucks previously carrying livestock or chemicals.",
      "For long-distance transport of tomatoes, use refrigerated trucks maintained at 13-15°C."
    ],
    itemsHi: [
      "गर्मी बढ़ने से रोकने के लिए टमाटर जैसी जल्दी खराब होने वाली वस्तुओं का परिवहन ठंडे घंटों (रात या सुबह जल्दी) में करें।",
      "हिमालय की पहाड़ी सड़कों पर हिलने-डुलने और खरोंच से बचने के लिए ट्रकों में क्रेटों को सुरक्षित रूप से व्यवस्थित करें।",
      "अनाज और उपज को अचानक बारिश और सीधी धूप से बचाने के लिए खुले ट्रकों को तिरपाल से ढकें।",
      "लोड करने से पहले वाहनों की पूरी तरह से सफाई सुनिश्चित करें; पहले पशुधन या रसायनों को ढोने वाले ट्रकों में फसलों का परिवहन न करें।",
      "टमाटर के लंबी दूरी के परिवहन के लिए, 13-15°C पर बनाए रखे जाने वाले रेफ्रिजेरेटेड ट्रकों का उपयोग करें।"
    ]
  }
];

export const history = [
  {
    id: "hist-1",
    titleEn: "Tomato Yellow Spot Diagnostic",
    titleHi: "टमाटर के पीले धब्बे का निदान",
    date: "2026-06-08T10:30:00Z",
    messages: [
      { sender: "user", text: "My tomato leaves have yellow spots. What could be the reason?" },
      {
        sender: "ai",
        isAdvisory: true,
        advisory: {
          problem: "Late Blight (Phytophthora infestans) / Early Leaf Spot",
          causes: "High relative humidity (above 90%), prolonged leaf wetness, and cool temperatures between 15-22°C common in Uttarakhand hills.",
          actions: "1. Spray Copper Oxychloride (3g/L) or Mancozeb (2g/L) immediately.\n2. Prune infected lower leaves to improve air circulation.\n3. Keep distance between plants.",
          precautions: "Do not apply sprinkler irrigation in late evenings as it prolongs leaf wetness. Wear protective gear while spraying chemical fungicides.",
          disclaimer: "This guidance is for informational purposes. Please verify symptoms with a local agricultural extension officer (KVK) before chemical application."
        }
      }
    ]
  },
  {
    id: "hist-2",
    titleEn: "Wheat Rust Prevention",
    titleHi: "गेहूं के रस्ट की रोकथाम",
    date: "2026-06-07T16:15:00Z",
    messages: [
      { sender: "user", text: "How to prevent rust in wheat?" },
      {
        sender: "ai",
        isAdvisory: true,
        advisory: {
          problem: "Yellow/Brown Rust (Puccinia spp.)",
          causes: "Warm days, cool nights, dew formation on leaves, and using susceptible traditional seed varieties.",
          actions: "1. Grow rust-resistant varieties like HPW-349 or HS-507 developed for Uttarakhand hills.\n2. Spray Propiconazole (1 ml/liter of water) at first appearance of orange pustules.",
          precautions: "Avoid excess Nitrogen dosage which leads to thick lush green foliage, creating a micro-climate highly favorable for rust fungi.",
          disclaimer: "Confirm rust strain with block extension staff. Always spray in calm wind conditions."
        }
      }
    ]
  }
];

// Helper wrapper to interact with database collections
export const db = {
  crops: [...crops],
  diseases: [...diseases],
  pests: [...pests],
  postHarvest: [...postHarvestGuides],
  history: [...history]
};
