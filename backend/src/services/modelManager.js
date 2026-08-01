import { GoogleGenerativeAI } from "@google/generative-ai";
import { modelConfig } from "../config/models.js";

const cooldownCache = new Map();
const COOLDOWN_DURATION = 10 * 60 * 1000; // 10 minutes

class ModelManager {
  getModelConfig() {
    return modelConfig;
  }

  getModelDisplayName(modelId) {
    const found = modelConfig.find(m => m.id === modelId);
    return found ? found.name : modelId;
  }

  async executeRequest(systemPrompt, temp) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("APIKeyMissing");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const enabledModels = modelConfig.filter(m => m.enabled);

    if (enabledModels.length === 0) {
      throw new Error("No models are enabled in configuration.");
    }

    // Filter out models currently in cooldown
    const now = Date.now();
    let candidates = enabledModels.filter(m => {
      if (cooldownCache.has(m.id)) {
        const cooldownTime = cooldownCache.get(m.id);
        if (cooldownTime > now) {
          console.log(`Skipping model: ${m.name} (In cooldown cache)...`);
          return false;
        }
      }
      return true;
    });

    // Fail-safe: if all enabled models are in cooldown, clear cache and retry all
    if (candidates.length === 0) {
      console.warn("All enabled models are in cooldown. Resetting cooldown cache for last-resort attempt.");
      cooldownCache.clear();
      candidates = enabledModels;
    }

    let lastError = null;

    for (const m of candidates) {
      console.log(`Trying ${m.name}...`);
      try {
        const model = genAI.getGenerativeModel({ model: m.id });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
          generationConfig: { temperature: parseFloat(temp) || 0.2 }
        });

        const response = await result.response;
        const text = response.text().trim();
        
        console.log(`Success.`);
        console.log(`Selected model: ${m.name}.`);

        // If it succeeded, remove from cooldown cache if it was there
        cooldownCache.delete(m.id);

        return {
          text,
          model: m.id
        };
      } catch (err) {
        // Classify non-retryable vs. retryable errors
        const isAuthError = err.status === 401 || err.status === 403 || err.message?.includes("API key not valid") || err.message?.includes("API_KEY_INVALID");
        const isClientError = err.status === 400 || err.message?.includes("400") || err.message?.includes("invalid argument");

        if (isAuthError || isClientError) {
          console.error(`Non-retryable error encountered: ${err.message}. Aborting model switch loop.`);
          throw err; // Stop loop and throw immediately
        }

        // Standardize retryable logs
        if (err.status === 429 || err.message?.includes("Quota exceeded") || err.message?.includes("Too Many Requests")) {
          console.log("Quota exceeded.");
        } else {
          console.log("Model request failed.");
        }

        // Put model in cooldown cache
        console.log(`Putting model ${m.name} in cooldown cache for 10 minutes.`);
        cooldownCache.set(m.id, Date.now() + COOLDOWN_DURATION);

        lastError = err;
      }
    }

    throw lastError || new Error("All configured models failed.");
  }
}

export default new ModelManager();
