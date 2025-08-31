import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_API_URL = 'https://data.mongodb-api.com/app/data-koewh/endpoint/data/v1/action/find';
const MONGO_API_KEY = process.env.MONGO_API_KEY || 'CQk2k1fBnHLvnoZFqALRZPTHzMgUUa9cYivK9VPOdo3tpNlyBKNjSNr6w14UoC7S'; // fallback for dev

const headers = {
  'Content-Type': 'application/json',
  'api-key': MONGO_API_KEY
};

// 🔍 Middleware for logging
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  next();
});

// 🎮 POST: Fetch PC Game Videos
app.post('/api/videos', async (req, res) => {
  try {
    const payload = {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection: 'videos',
      filter: {}
    };

    const response = await axios.post(MONGO_API_URL, payload, { headers });
    const documents = response.data?.documents ?? [];

    console.log('[Proxy] MongoDB response (videos):', documents);
    res.json(documents);
  } catch (err) {
    console.error('[Proxy Error] /api/videos:', err.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// ⚽ POST: Fetch Torrent Files for Sports
app.post('/api/torrentfiles', async (req, res) => {
  try {
    const payload = {
      dataSource: 'Cluster0',
      database: 'videoplayer',
      collection: 'torrentfiles',
      filter: {}
    };

    const response = await axios.post(MONGO_API_URL, payload, { headers });
    const documents = response.data?.documents ?? [];

    console.log('[Proxy] MongoDB response (torrentfiles):', documents);
    res.json(documents);
  } catch (err) {
    console.error('[Proxy Error] /api/torrentfiles:', err.message);
    res.status(500).json({ error: 'Failed to fetch torrent files' });
  }
});

// 🧪 GET: Health Check Routes
app.get('/api/videos', (req, res) => {
  res.send('✅ Proxy is alive. Use POST to fetch videos.');
});

app.get('/api/torrentfiles', (req, res) => {
  res.send('✅ Proxy is alive. Use POST to fetch torrent files.');
});

// 🚀 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Proxy running on http://localhost:${PORT}`));
