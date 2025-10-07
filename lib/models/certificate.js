import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  issuedBy: { type: String, required: true },
  credits: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "listed" }, // listed / sold / inactive
});

export default mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);
