import History from "../models/history.js";

class HistoryService {
  async getAll(userId) {
    if (!userId) return [];
    // Return only histories that belong to the authenticated user
    const query = { user: userId };
    return await History.find(query).sort({ date: -1 });
  }

  async save(session, userId) {
    if (!userId) {
      const error = new Error("Authentication required to save chat history");
      error.statusCode = 401;
      throw error;
    }

    if (!session.messages || !Array.isArray(session.messages) || session.messages.length === 0) {
      const error = new Error("Session messages must be a non-empty array");
      error.statusCode = 400;
      throw error;
    }

    const sessionDate = session.date || new Date().toISOString();

    // If session ID exists, try to update it only if owned by this user
    if (session.id) {
      const existing = await History.findOne({ id: session.id });
      if (existing) {
        // If it belongs to another user (or is seeded history without a user field), reject the update
        if (!existing.user || existing.user.toString() !== userId.toString()) {
          const error = new Error("Unauthorized to update this history session");
          error.statusCode = 403;
          throw error;
        }

        const updated = await History.findOneAndUpdate(
          { id: session.id, user: userId },
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
        return updated;
      }
    }

    // Otherwise create a new session
    const newSession = new History({
      user: userId,
      id: session.id || `hist-${Date.now()}`,
      titleEn: session.titleEn || "Crop Advisor Chat",
      titleHi: session.titleHi || "फसल सलाहकार चैट",
      date: sessionDate,
      messages: session.messages
    });

    return await newSession.save();
  }

  async delete(id, userId) {
    if (!userId) return false;
    const query = { id, user: userId };
    const deleted = await History.findOneAndDelete(query);
    return !!deleted;
  }
}

export default new HistoryService();

