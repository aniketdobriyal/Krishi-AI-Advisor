import History from "../models/history.js";

class HistoryService {
  async getAll() {
    // Return newest sessions first (sorted by date descending)
    return await History.find({}).sort({ date: -1 });
  }

  async save(session) {
    if (!session.messages || !Array.isArray(session.messages) || session.messages.length === 0) {
      const error = new Error("Session messages must be a non-empty array");
      error.statusCode = 400;
      throw error;
    }

    const sessionDate = session.date || new Date().toISOString();

    // If session ID exists, try to update it
    if (session.id) {
      const updated = await History.findOneAndUpdate(
        { id: session.id },
        {
          $set: {
            titleEn: session.titleEn,
            titleHi: session.titleHi,
            messages: session.messages,
            date: sessionDate
          }
        },
        { new: true } // return the updated document
      );
      if (updated) {
        return updated;
      }
    }

    // Otherwise create a new session
    const newSession = new History({
      id: session.id || `hist-${Date.now()}`,
      titleEn: session.titleEn || "Crop Advisor Chat",
      titleHi: session.titleHi || "फसल सलाहकार चैट",
      date: sessionDate,
      messages: session.messages
    });

    return await newSession.save();
  }

  async delete(id) {
    const deleted = await History.findOneAndDelete({ id });
    return !!deleted;
  }
}

export default new HistoryService();

