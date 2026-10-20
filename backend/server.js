const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Your existing API routes go here (e.g., /api/rooms, /api/leaderboard, etc.)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Cyber Escape Backend Active' });
});

// Serve frontend static files in production
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));