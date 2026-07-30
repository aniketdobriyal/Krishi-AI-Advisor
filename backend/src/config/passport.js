import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../../.env");

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Google OAuth Credentials
// NOTE FOR PRODUCTION DEPLOYMENT:
// You must go to the Google Cloud Console (https://console.cloud.google.com) and configure:
// 1. Authorized JavaScript Origins:
//    - Development: http://localhost:5173
//    - Production: https://YOUR-VERCEL-APP.vercel.app (or whatever Vercel URL you are assigned)
// 2. Authorized Redirect URIs:
//    - Development: http://localhost:5000/api/auth/google/callback
//    - Production: https://YOUR-RENDER-APP.onrender.com/api/auth/google/callback
//
// These are managed dynamically via environment variables (CLIENT_URL and BACKEND_URL) and must NOT be hardcoded.
const clientID = process.env.GOOGLE_CLIENT_ID || "dummy_google_client_id";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "dummy_google_client_secret";
const rawBackendURL = process.env.BACKEND_URL || "http://localhost:5000";
const backendURL = rawBackendURL.replace(/\/$/, "");
const callbackURL = `${backendURL}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
      scope: ["profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("Google account does not expose email"), null);
        }

        // Check if user exists
        let user = await User.findOne({ email: email.toLowerCase() });
        
        if (user) {
          // If local user exists, return it, or if google user exists, return it
          return done(null, user);
        }

        // If not, create a new user
        user = new User({
          name: profile.displayName || "Google User",
          email: email.toLowerCase(),
          provider: "google",
          avatar: profile.photos?.[0]?.value || "",
          // password not required since provider is google
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
