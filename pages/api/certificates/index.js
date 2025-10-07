import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const certificates = await Certificate.find({ status: "listed" });
      res.status(200).json(certificates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
