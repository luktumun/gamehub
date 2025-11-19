import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✔ Use your MongoDB Connection String
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://raje:<password>@cluster0.8mmip.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let db; // global db

// 🔌 Connect to MongoDB once at startup
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db("videoplayer");      // your database name
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectDB();


// 🎮 POST: Fetch PC Game Videos
app.post("/api/videos", async (req, res) => {
  try {
    const videos = await db.collection("videos").find().toArray();
    res.json(videos);
  } catch (err) {
    console.error("❌ Error fetching videos:", err);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});


// ⚽ POST: Fetch Sports Torrent Files
app.post("/api/torrentfiles", async (req, res) => {
  try {
    const torrents = await db.collection("torrentfiles").find().toArray();
    res.json(torrents);
  } catch (err) {
    console.error("❌ Error fetching torrents:", err);
    res.status(500).json({ error: "Failed to fetch torrent files" });
  }
});


// 🧪 Health Check
app.get("/api/videos", (req, res) => res.send("Backend running ✔"));
app.get("/api/torrentfiles", (req, res) => res.send("Backend running ✔"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
