const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

app.use(cors());
app.use(express.json());

const readLeaderboard = () => {
  if (!fs.existsSync(LEADERBOARD_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8')); }
  catch (err) { return []; }
};

const writeLeaderboard = (data) => {
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/api/leaderboard', (req, res) => {
  const leaderboard = readLeaderboard();
  leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  res.json(leaderboard);
});

app.post('/api/leaderboard', (req, res) => {
  const { playerName, timeInSeconds } = req.body;
  if (!playerName || typeof timeInSeconds !== 'number') {
    return res.status(400).json({ error: 'Invalid payload.' });
  }
  const leaderboard = readLeaderboard();
  const newEntry = { id: Date.now(), playerName: playerName.trim(), timeInSeconds, date: new Date().toLocaleDateString() };
  leaderboard.push(newEntry);
  leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  writeLeaderboard(leaderboard);
  res.status(201).json({ success: true, entry: newEntry });
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
