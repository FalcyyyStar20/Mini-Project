import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { ROOMS, Puzzle } from './puzzles';
import './App.css';

interface LeaderboardEntry { id: number; playerName: string; timeInSeconds: number; date: string; }

const TerminalHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="terminal-header">
    <div className="window-dots"><span className="dot red"/><span className="dot yellow"/><span className="dot green"/></div>
    <div className="terminal-title">{title}</div>
  </div>
);

const Lobby: React.FC<{ onStart: (name: string) => void }> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) { setError('Name must be at least 2 characters.'); return; }
    if (!/^[^\s@]+@gmail\.com$/.test(email.trim().toLowerCase())) { setError('Institutional protocol requires a valid @gmail.com email.'); return; }
    setError('');
    onStart(name.trim());
    navigate('/room/1');
  };

  return (
    <div className="card">
      <TerminalHeader title="IT_ENG_MINI_PROJECT // LOBBY" />
      <div className="card-body">
        <div className="badge">SECURITY CLEARANCE</div>
        <h1>CYBER ESCAPE: 6 ROOMS</h1>
        <p className="subtitle">Enter your details to initialize the evaluation session.</p>
        <form onSubmit={handleRegister} className="escape-form" noValidate>
          <div className="form-group"><label>Student Name</label><input type="text" placeholder="John Pinto" value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="form-group"><label>Student Email (@gmail.com)</label><input type="email" placeholder="student@gmail.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
          {error && <div className="alert error">{error}</div>}
          <button type="submit" className="btn-primary">START GAME</button>
        </form>
      </div>
    </div>
  );
};

const RoomView: React.FC<{ playerName: string; startTime: number | null; unlockedRoom: number; onUnlockNext: (r: number) => void }> = ({ playerName, startTime, unlockedRoom, onUnlockNext }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roomIndex = Number(id) - 1;
  const puzzle = ROOMS[roomIndex];

  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => { setAnswer(''); setFeedback(null); setFailedAttempts(0); setShowHint(false); }, [id]);
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (!playerName || !startTime) return <Navigate to="/" replace />;
  if (!puzzle || Number(id) > unlockedRoom) return <Navigate to={`/room/${unlockedRoom}`} replace />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = puzzle.validate(answer);
    setFeedback(result);
    if (result.isValid) {
      setTimeout(() => {
        if (puzzle.roomNumber < ROOMS.length) { onUnlockNext(puzzle.roomNumber + 1); navigate(`/room/${puzzle.roomNumber + 1}`); }
        else { onUnlockNext(ROOMS.length + 1); navigate('/escaped'); }
      }, 800);
    } else { setFailedAttempts(prev => prev + 1); }
  };

  return (
    <div className="card">
      <TerminalHeader title={`ROOM_0${puzzle.roomNumber}.EXE`} />
      <div className="card-body">
        <div className="topbar"><span className="agent-tag">AGENT: {playerName.toUpperCase()}</span><span className="timer">TIME: {elapsed}s</span></div>
        <div className="progress-bar">
          {ROOMS.map(r => (
            <div key={r.roomNumber} className={`step ${r.roomNumber < puzzle.roomNumber ? 'done' : r.roomNumber === puzzle.roomNumber ? 'active' : ''}`}>
              {r.roomNumber < puzzle.roomNumber ? '✓' : `R${r.roomNumber}`}
            </div>
          ))}
        </div>
        <div className="badge">{puzzle.category}</div>
        <h2>{puzzle.title}</h2>
        <pre className="question-box">{puzzle.question}</pre>
        <form onSubmit={handleSubmit} className="escape-form">
          <input type="text" placeholder="Enter key..." value={answer} onChange={e => setAnswer(e.target.value)} autoFocus />
          <div className="btn-row">
            <button type="submit" className="btn-primary">SUBMIT</button>
            {failedAttempts < 3 ? (
              <button type="button" className="btn-secondary" disabled style={{ opacity: 0.5 }}>🔒 HINT LOCKED ({3 - failedAttempts} tries left)</button>
            ) : (
              <button type="button" className="btn-secondary" onClick={() => setShowHint(!showHint)}>{showHint ? 'HIDE HINT' : '💡 HINT'}</button>
            )}
          </div>
        </form>
        {showHint && <div className="alert hint">HINT: {puzzle.hint}</div>}
        {feedback && <div className={`alert ${feedback.isValid ? 'success' : 'error'}`}>{feedback.message}</div>}
      </div>
    </div>
  );
};

const Victory: React.FC<{ playerName: string; totalTime: number; onReset: () => void }> = ({ playerName, totalTime, onReset }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!playerName) { navigate('/'); return; }
    fetch('http://localhost:5000/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerName, timeInSeconds: totalTime })
    })
    .then(() => fetch('http://localhost:5000/api/leaderboard'))
    .then(res => res.json())
    .then(data => setLeaderboard(data))
    .catch(err => console.error(err));
  }, [playerName, totalTime, navigate]);

  return (
    <div className="card">
      <TerminalHeader title="VICTORY" />
      <div className="card-body">
        <h1>ESCAPED SUCCESSFULLY!</h1>
        <p className="subtitle">Completed in {totalTime} seconds.</p>
        <h3>LEADERBOARD</h3>
        <div className="leaderboard-box">
          <table>
            <thead><tr><th>Rank</th><th>Name</th><th>Time</th><th>Date</th></tr></thead>
            <tbody>
              {leaderboard.map((e, i) => <tr key={e.id}><td>#{i+1}</td><td>{e.playerName}</td><td>{e.timeInSeconds}s</td><td>{e.date}</td></tr>)}
            </tbody>
          </table>
        </div>
        <button className="btn-primary" onClick={() => { onReset(); navigate('/'); }}>PLAY AGAIN</button>
      </div>
    </div>
  );
};

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [unlockedRoom, setUnlockedRoom] = useState(1);
  const [finalTime, setFinalTime] = useState(0);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Lobby onStart={n => { setPlayerName(n); setStartTime(Date.now()); setUnlockedRoom(1); }} />} />
          <Route path="/room/:id" element={<RoomView playerName={playerName} startTime={startTime} unlockedRoom={unlockedRoom} onUnlockNext={r => { setUnlockedRoom(r); if(r > ROOMS.length) setFinalTime(Math.floor((Date.now() - (startTime||0))/1000)); }} />} />
          <Route path="/escaped" element={<Victory playerName={playerName} totalTime={finalTime} onReset={() => { setPlayerName(''); setStartTime(null); setUnlockedRoom(1); }} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
