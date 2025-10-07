// lib/getUserFromToken.js
import jwt from "jsonwebtoken";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function getUserFromToken(token) {
  if (!token) return null;
  try {
    // Accept "Bearer <token>" or raw token
    if (token.startsWith?.("Bearer ")) token = token.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);
    const client = await clientPromise;
    const db = client.db("carbon-bazzar");

    const id = decoded.userId || decoded.id || decoded._id;
    if (id) {
      try {
        return await db.collection("users").findOne({ _id: new ObjectId(id) });
      } catch (e) {
        // if id isn't ObjectId (maybe email stored), fall through
      }
    }

    if (decoded.email) {
      return await db.collection("users").findOne({ email: decoded.email });
    }

    return null;
  } catch (err) {
    return null;
  }
}
