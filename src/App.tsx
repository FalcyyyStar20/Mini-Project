import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Lobby } from './pages/Lobby';
import { RoomPage } from './pages/RoomPage';
import { EscapedPage } from './pages/EscapedPage';

export const App: React.FC = () => {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-[#030712] text-slate-100 cyber-grid flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
          {/* Ambient Glowing Gradients */}
          <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
          <div className="fixed top-[40%] right-[20%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />

          {/* Top Global Status Header Bar */}
          <div className="w-full bg-[#050914]/80 border-b border-cyan-500/15 py-1.5 px-4 text-[10px] font-mono text-slate-400 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-cyan-400 font-semibold tracking-wider">IT_ENG_MINI_PROJECT // PRACTICAL_EXAMINATION_PORTAL</span>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <span>COURSE: IT_ENG_302</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400">STATUS: EVALUATION_SYSTEM_ACTIVE</span>
            </div>
          </div>

          {/* Main App Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center py-4 sm:py-6">
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/room/:id" element={<RoomPage />} />
              <Route path="/escaped" element={<EscapedPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global System Watermark Footer */}
          <footer className="w-full py-3 px-4 text-center text-[10px] font-mono text-slate-500 border-t border-cyan-500/10 bg-[#02050e]/60">
            IT ENGINEERING MINI-PROJECT // CYBER ESCAPE: 6 ROOMS // REACT + TYPESCRIPT + EXPRESS FS LEADERBOARD
          </footer>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
};

export default App;
