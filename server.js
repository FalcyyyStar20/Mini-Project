/**
 * [EXPERIMENT 7: TO BUILD A SIMPLE WEB SERVER AND PERFORM FILE HANDLING USING NODE.JS]
 * IT Engineering Curriculum Mini-Project Backend Server
 * 
 * Features:
 * - Express HTTP Web Server (REST API endpoints)
 * - Node.js File Handling using asynchronous `fs.promises` (readFile, writeFile)
 * - Handles `leaderboard.json` and `feedback.json` disk persistence
 */

import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');
const FEEDBACK_FILE = path.join(__dirname, 'feedback.json');

app.use(cors());
app.use(express.json());

// Pure local leaderboard: Starts completely empty with NO dummy / unnecessary people
const INITIAL_RECORDS = [];

// Helper to safely read leaderboard from local JSON file using fs.promises
async function readLeaderboardFile() {
  try {
    if (!fs.existsSync(LEADERBOARD_FILE)) {
      await fs.promises.writeFile(
        LEADERBOARD_FILE,
        JSON.stringify(INITIAL_RECORDS, null, 2),
        'utf-8'
      );
      return INITIAL_RECORDS;
    }
    const rawData = await fs.promises.readFile(LEADERBOARD_FILE, 'utf-8');
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[CYBER_SYS_ERR] Failed reading leaderboard file:', error);
    return [];
  }
}

// Helper to write leaderboard to local JSON file using fs.promises
async function writeLeaderboardFile(data) {
  try {
    await fs.promises.writeFile(
      LEADERBOARD_FILE,
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    return true;
  } catch (error) {
    console.error('[CYBER_SYS_ERR] Failed writing leaderboard file:', error);
    return false;
  }
}

// Helper to format seconds to MM:SS
function formatSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// System Health Check (Experiment 7)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SYS_ONLINE',
    system: 'CYBER_ESCAPE_SYS_CORE',
    version: '2.5.0',
    curriculum: '8_EXPERIMENTS_LAB',
    storage: 'LOCAL_JSON_FS_PROMISES',
    timestamp: new Date().toISOString()
  });
});

// GET /api/leaderboard - Sorted by fastest completion time (ascending)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const records = await readLeaderboardFile();
    const sorted = records.sort(
      (a, b) => a.completionTimeSeconds - b.completionTimeSeconds
    );
    res.json({
      success: true,
      count: sorted.length,
      leaderboard: sorted
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve telemetry leaderboard data.',
      error: String(error)
    });
  }
});

// DELETE /api/leaderboard - Clear all local records
app.delete('/api/leaderboard', async (req, res) => {
  try {
    await writeLeaderboardFile([]);
    res.json({
      success: true,
      message: 'Local leaderboard records purged successfully.',
      leaderboard: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to purge local leaderboard records.',
      error: String(error)
    });
  }
});

// POST /api/leaderboard - Save player completion record
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { agentName, email, completionTimeSeconds, roomsCompleted } = req.body;

    if (!agentName || agentName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Agent Callsign. Minimum 2 characters required.'
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Validation Error: Institutional protocol requires a valid @gmail.com student email address.'
      });
    }

    const timeInSec = Math.max(1, Number(completionTimeSeconds) || 60);
    const formattedTime = formatSeconds(timeInSec);

    let clearanceLevel = 'Field Operative';
    if (timeInSec < 120) clearanceLevel = 'Master Infiltrator (A+)';
    else if (timeInSec < 240) clearanceLevel = 'Senior Infiltrator (A)';
    else clearanceLevel = 'Certified Operative (B+)';

    const currentRecords = await readLeaderboardFile();

    const existingIndex = currentRecords.findIndex(
      (rec) =>
        rec.email.toLowerCase() === email.trim().toLowerCase() &&
        rec.agentName.toLowerCase() === agentName.trim().toLowerCase()
    );

    let recordId = `rec_${Date.now()}`;
    if (existingIndex !== -1) {
      recordId = currentRecords[existingIndex].id;
      if (timeInSec < currentRecords[existingIndex].completionTimeSeconds) {
        currentRecords[existingIndex].completionTimeSeconds = timeInSec;
        currentRecords[existingIndex].formattedTime = formattedTime;
        currentRecords[existingIndex].completedAt = new Date().toISOString();
        currentRecords[existingIndex].clearanceLevel = clearanceLevel;
        currentRecords[existingIndex].roomsCompleted = Number(roomsCompleted) || 8;
      }
    } else {
      const newRecord = {
        id: recordId,
        agentName: agentName.trim(),
        email: email.trim(),
        completionTimeSeconds: timeInSec,
        formattedTime,
        roomsCompleted: Number(roomsCompleted) || 8,
        completedAt: new Date().toISOString(),
        clearanceLevel
      };
      currentRecords.push(newRecord);
    }

    const sorted = currentRecords.sort(
      (a, b) => a.completionTimeSeconds - b.completionTimeSeconds
    );

    await writeLeaderboardFile(sorted);

    const playerRank = sorted.findIndex((rec) => rec.id === recordId) + 1;

    res.status(201).json({
      success: true,
      message: 'Operative mission record successfully verified and logged.',
      record: sorted[playerRank - 1] || null,
      rank: playerRank,
      leaderboard: sorted
    });
  } catch (error) {
    console.error('[CYBER_SYS_ERR] Leaderboard submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while logging mission telemetry.',
      error: String(error)
    });
  }
});

// [EXPERIMENT 8]: Feedback Endpoint Handler (Node.js fallback alongside Flask app.py)
app.post('/api/feedback', async (req, res) => {
  try {
    const { agentName, email, rating, category, comments } = req.body;
    let records = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      try {
        const raw = await fs.promises.readFile(FEEDBACK_FILE, 'utf-8');
        records = JSON.parse(raw);
        if (!Array.isArray(records)) records = [];
      } catch {
        records = [];
      }
    }

    const newFeedback = {
      id: `fb_${Date.now()}`,
      agentName: agentName || 'Anonymous Operative',
      email: email || 'student@gmail.com',
      rating: Number(rating) || 5,
      category: category || 'Curriculum',
      comments: comments || '',
      submittedAt: new Date().toISOString()
    };

    records.push(newFeedback);
    await fs.promises.writeFile(FEEDBACK_FILE, JSON.stringify(records, null, 2), 'utf-8');

    res.status(201).json({
      success: true,
      message: 'Feedback successfully persisted to feedback.json via Node/Flask handler.',
      record: newFeedback
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    if (!fs.existsSync(FEEDBACK_FILE)) return res.json({ success: true, count: 0, feedback: [] });
    const raw = await fs.promises.readFile(FEEDBACK_FILE, 'utf-8');
    const records = JSON.parse(raw);
    res.json({ success: true, count: records.length, feedback: records });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`[CYBER_CORE_ONLINE] Express server running on port ${PORT}`);
  console.log(`[STORAGE_READY] Local leaderboard file linked to: ${LEADERBOARD_FILE}`);
});
