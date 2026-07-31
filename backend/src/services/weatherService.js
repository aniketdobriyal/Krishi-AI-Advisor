const locations = [
  { name: "Almora", nameHi: "अल्मोड़ा", lat: 29.5892, lon: 79.6467, region: "hills", crops: ["Tomato", "Potato", "Kidney Beans (Rajma)"] },
  { name: "Pithoragarh", nameHi: "पिथौरागढ़", lat: 29.5829, lon: 80.2182, region: "hills", crops: ["Tomato", "Potato", "Kidney Beans (Rajma)"] },
  { name: "Nainital", nameHi: "नैनीताल", lat: 29.3803, lon: 79.4636, region: "hills", crops: ["Tomato", "Potato", "Kidney Beans (Rajma)"] },
  { name: "Haridwar", nameHi: "हरिद्वार", lat: 29.9457, lon: 78.1642, region: "plains", crops: ["Wheat", "Paddy (Rice)", "Mustard"] },
  { name: "Udham Singh Nagar", nameHi: "ऊधम सिंह नगर", lat: 28.9800, lon: 79.4000, region: "plains", crops: ["Wheat", "Paddy (Rice)", "Mustard"] }
];

let cache = {
  data: null,
  timestamp: 0
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const fetchDistrictWeather = async (loc) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=precipitation_probability&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo HTTP error ${res.status} for ${loc.name}`);
  }
  const data = await res.json();
  
  if (!data.current) {
    throw new Error(`Invalid weather data returned for ${loc.name}`);
  }

  // Calculate average precipitation probability for next 12 hours
  let rainProb = 0;
  if (data.hourly && data.hourly.precipitation_probability) {
    const next12Hours = data.hourly.precipitation_probability.slice(0, 12);
    rainProb = Math.round(next12Hours.reduce((sum, val) => sum + val, 0) / next12Hours.length);
  }

  return {
    name: loc.name,
    nameHi: loc.nameHi,
    region: loc.region,
    crops: loc.crops,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    precipitation: data.current.precipitation,
    windSpeed: data.current.wind_speed_10m,
    rainProbability: rainProb
  };
};

const processWeatherAlerts = (weatherData) => {
  const alerts = [];
  const weather = [];

  weatherData.forEach(d => {
    // Collect clean current weather format for frontend
    weather.push({
      district: d.name,
      districtHi: d.nameHi,
      region: d.region,
      temperature: d.temperature,
      humidity: d.humidity,
      windSpeed: d.windSpeed,
      rainProbability: d.rainProbability,
      precipitation: d.precipitation
    });

    // Rule 1: Late Blight Risk (Tomato & Potato in Hills)
    if (d.region === "hills" && d.humidity > 85 && (d.rainProbability > 30 || d.precipitation > 0)) {
      alerts.push({
        id: `blight-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "humidity",
        district: d.name,
        districtHi: d.nameHi,
        region: d.region,
        title: "Late Blight Threat",
        titleHi: "झुलसा रोग का खतरा",
        text: `High humidity (${d.humidity}%) and rain expected in ${d.name}. Potato and Tomato crops are at high risk for Late Blight. Advise fields to check lower leaves.`,
        textHi: `${d.nameHi} में उच्च आर्द्रता (${d.humidity}%) और बारिश की संभावना है। आलू और टमाटर की फसलों में झुलसा रोग (Late Blight) का अत्यधिक जोखिम है। खेतों में निचली पत्तियों की जाँच करें।`
      });
    }

    // Rule 2: Heat Stress (Rajma in Hills / Paddy in Plains)
    if (d.temperature > 35) {
      if (d.region === "hills") {
        alerts.push({
          id: `heat-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
          type: "heat",
          district: d.name,
          districtHi: d.nameHi,
          region: d.region,
          title: "Rajma Heat Stress Warning",
          titleHi: "राजमा ताप तनाव चेतावनी",
          text: `Extreme temperature of ${d.temperature}°C in ${d.name} may cause flower drop in Rajma (Kidney Beans). Implement light sprinkler irrigation immediately.`,
          textHi: `${d.nameHi} में ${d.temperature}°C का अत्यधिक तापमान राजमा में फूलों के गिरने का कारण बन सकता है। तुरंत शाम को हल्की स्प्रिंकलर सिंचाई करें।`
        });
      } else {
        alerts.push({
          id: `heat-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
          type: "heat",
          district: d.name,
          districtHi: d.nameHi,
          region: d.region,
          title: "Plains Crop Heat Stress Alert",
          titleHi: "मैदानी फसल ताप तनाव चेतावनी",
          text: `High temperature (${d.temperature}°C) in ${d.name} may accelerate crop transpiration. Ensure standing water for Paddy or schedule frequent irrigation to avoid moisture stress.`,
          textHi: `${d.nameHi} में उच्च तापमान (${d.temperature}°C) फसल के वाष्पोत्सर्जन को तेज कर सकता है। धान के लिए खड़ा पानी सुनिश्चित करें या सिंचाई की योजना बनाएं।`
        });
      }
    }

    // Rule 3: Harvest Protection Warning (Wheat/Paddy in Plains)
    if (d.region === "plains" && (d.rainProbability > 50 || d.precipitation > 1.5)) {
      alerts.push({
        id: `harvest-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "rainfall",
        district: d.name,
        districtHi: d.nameHi,
        region: d.region,
        title: "Harvest Protection Alert",
        titleHi: "फसल कटाई सुरक्षा चेतावनी",
        text: `Showers predicted in plains district ${d.name} (${d.rainProbability}% probability). Wheat and cereal harvests must be covered with tarpaulins immediately. Avoid winnowing in wind.`,
        textHi: `मैदानी जिले ${d.nameHi} में बारिश की संभावना (${d.rainProbability}%) है। गेहूं और अनाज की फसल को तुरंत तिरपाल से ढकना सुनिश्चित करें। हवा में ओसाई (winnowing) करने से बचें।`
      });
    }

    // Rule 4: Pest Migration Warning (Mustard in Plains)
    if (d.region === "plains" && d.windSpeed > 15) {
      alerts.push({
        id: `pest-${d.name.toLowerCase().replace(/\s+/g, "-")}`,
        type: "wind",
        district: d.name,
        districtHi: d.nameHi,
        region: d.region,
        title: "Mustard Aphid Alert",
        titleHi: "सरसों माहू (एफिड्स) कीट चेतावनी",
        text: `Strong winds of ${d.windSpeed} km/h in ${d.name} plains may accelerate aphid migrations in mustard fields. Supervisors must check yellow sticky traps weekly.`,
        textHi: `${d.nameHi} के मैदानी इलाकों में ${d.windSpeed} किमी/घंटा की तेज हवाएं सरसों के खेतों में माहू (एफिड्स) के प्रवास को तेज कर सकती हैं। पर्यवेक्षक साप्ताहिक रूप से पीले चिपचिपे ट्रैप की जांच करें।`
      });
    }
  });

  // Dynamic Agromet Advisory selection
  let advisoryEn = "Weather conditions in Uttarakhand districts are currently stable for organic farming. Continue regular weeding and bio-pesticide applications.";
  let advisoryHi = "उत्तराखंड के जिलों में मौसम की स्थिति वर्तमान में जैविक खेती के लिए स्थिर है। नियमित निराई और जैव-कीटनाशकों का छिड़काव जारी रखें।";

  if (alerts.length > 0) {
    // Prioritize Blight, then Harvest, then Pest, then Heat for advisory highlight
    const blightAlert = alerts.find(a => a.type === "humidity");
    const harvestAlert = alerts.find(a => a.type === "rainfall");
    const pestAlert = alerts.find(a => a.type === "wind");
    const primaryAlert = blightAlert || harvestAlert || pestAlert || alerts[0];
    
    advisoryEn = primaryAlert.text;
    advisoryHi = primaryAlert.textHi;
  }

  return {
    alerts,
    weather,
    advisoryEn,
    advisoryHi,
    generatedAt: new Date().toISOString()
  };
};

export const getWeatherAlerts = async () => {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
    return cache.data;
  }

  try {
    const results = await Promise.all(locations.map(fetchDistrictWeather));
    const processed = processWeatherAlerts(results);
    cache.data = processed;
    cache.timestamp = now;
    return processed;
  } catch (err) {
    console.error("Open-Meteo Weather API Error:", err.message);
    if (cache.data) {
      console.log("Serving stale weather data from cache due to API error...");
      return cache.data;
    }
    // Safe Fallback
    return {
      alerts: [],
      weather: [],
      advisoryEn: "Weather data currently unavailable. Using organic guidelines for seasonal cropping.",
      advisoryHi: "मौसम डेटा वर्तमान में अनुपलब्ध है। मौसमी फसल चक्र के लिए जैविक दिशानिर्देशों का पालन करें।",
      generatedAt: new Date().toISOString()
    };
  }
};
