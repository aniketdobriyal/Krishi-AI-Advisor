import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    password: {
      type: String,
      required: function() {
        // Password is only required if the provider is local
        return this.provider === "local";
      }
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Pre-save hook to hash password if it was modified
userSchema.pre("save", async function() {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
});

// Helper method to verify passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
