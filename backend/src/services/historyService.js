import { db } from "../config/db.js";

class HistoryService {
  getAll() {
    // Return newest sessions first
    return db.history;
  }

  save(session) {
    if (!session.messages || !Array.isArray(session.messages) || session.messages.length === 0) {
      const error = new Error("Session messages must be a non-empty array");
      error.statusCode = 400;
      throw error;
    }

    // If session ID exists, update it
    if (session.id) {
      const index = db.history.findIndex(h => h.id === session.id);
      if (index !== -1) {
        db.history[index] = {
          ...db.history[index],
          titleEn: session.titleEn || db.history[index].titleEn,
          titleHi: session.titleHi || db.history[index].titleHi,
          messages: session.messages,
          date: new Date().toISOString()
        };
        return db.history[index];
      }
    }

    // Otherwise create a new session
    const newSession = {
      id: session.id || `hist-${Date.now()}`,
      titleEn: session.titleEn || "Crop Advisor Chat",
      titleHi: session.titleHi || "फसल सलाहकार चैट",
      date: session.date || new Date().toISOString(),
      messages: session.messages
    };

    db.history.unshift(newSession);
    return newSession;
  }

  delete(id) {
    const index = db.history.findIndex(h => h.id === id);
    if (index === -1) {
      return false;
    }
    db.history.splice(index, 1);
    return true;
  }
}

export default new HistoryService();
