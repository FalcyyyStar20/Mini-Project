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

app.use(cors());
app.use(express.json());

// Pure local leaderboard: Starts completely empty with NO dummy / unnecessary people
const INITIAL_RECORDS = [];

// Helper to safely read leaderboard from local JSON file
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

// Helper to write leaderboard to local JSON file
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

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'SYS_ONLINE',
    system: 'CYBER_ESCAPE_SYS_CORE',
    version: '2.0.4',
    storage: 'LOCAL_JSON_FS',
    timestamp: new Date().toISOString()
  });
});

// GET /api/leaderboard - Sorted by fastest completion time (ascending)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const records = await readLeaderboardFile();
    // Sort ascending by completionTimeSeconds (fastest operative first)
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

// POST /api/leaderboard - Save player completion record (Local Only, No Duplicate Spam)
app.post('/api/leaderboard', async (req, res) => {
  try {
    const { agentName, email, completionTimeSeconds, roomsCompleted } = req.body;

    // Strict validation
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
    if (timeInSec < 90) clearanceLevel = 'Elite Infiltrator';
    else if (timeInSec < 150) clearanceLevel = 'Cyber Specialist';
    else if (timeInSec < 240) clearanceLevel = 'Senior Operative';

    const currentRecords = await readLeaderboardFile();

    // Deduplicate: If this local player already exists, update their record with their best time
    const existingIndex = currentRecords.findIndex(
      (rec) =>
        rec.email.toLowerCase() === email.trim().toLowerCase() &&
        rec.agentName.toLowerCase() === agentName.trim().toLowerCase()
    );

    let recordId = `rec_${Date.now()}`;
    if (existingIndex !== -1) {
      recordId = currentRecords[existingIndex].id;
      // If new time is faster, update it; otherwise preserve best time
      if (timeInSec < currentRecords[existingIndex].completionTimeSeconds) {
        currentRecords[existingIndex].completionTimeSeconds = timeInSec;
        currentRecords[existingIndex].formattedTime = formattedTime;
        currentRecords[existingIndex].completedAt = new Date().toISOString();
        currentRecords[existingIndex].clearanceLevel = clearanceLevel;
      }
    } else {
      const newRecord = {
        id: recordId,
        agentName: agentName.trim(),
        email: email.trim(),
        completionTimeSeconds: timeInSec,
        formattedTime,
        roomsCompleted: Number(roomsCompleted) || 6,
        completedAt: new Date().toISOString(),
        clearanceLevel
      };
      currentRecords.push(newRecord);
    }

    // Sort ascending by completion time
    const sorted = currentRecords.sort(
      (a, b) => a.completionTimeSeconds - b.completionTimeSeconds
    );

    await writeLeaderboardFile(sorted);

    // Determine operative's rank
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

app.listen(PORT, () => {
  console.log(`[CYBER_CORE_ONLINE] Express server running on port ${PORT}`);
  console.log(`[STORAGE_READY] Local leaderboard file linked to: ${LEADERBOARD_FILE}`);
});
