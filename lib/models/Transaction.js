import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: "Certificate", required: true },
  qty: { type: Number, required: true },
  type: { type: String, enum: ["buy", "sell"], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
