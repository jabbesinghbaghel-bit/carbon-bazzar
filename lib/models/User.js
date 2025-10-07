import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  portfolio: [
    { 
      certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }, 
      qty: Number 
    }
  ],
  isAdmin: { type: Boolean, default: false } // optional, for admin checks
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
