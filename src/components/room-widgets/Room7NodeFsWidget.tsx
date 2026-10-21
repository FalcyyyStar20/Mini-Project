import React, { useState } from 'react';
import { Server, HardDrive, Play, Terminal } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Room7NodeFsWidget: React.FC = () => {
  const [fsStatus, setFsStatus] = useState<string>('IDLE');
  const [lastPayload, setLastPayload] = useState<string | null>(null);

  const testFileRead = async () => {
    sound.playClick();
    setFsStatus('READING');
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setFsStatus('SUCCESS_200');
        setLastPayload(JSON.stringify(data, null, 2));
        sound.playSuccess();
      } else {
        setFsStatus('HTTP_ERROR');
      }
    } catch {
      setFsStatus('OFFLINE_OR_CORS');
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Server className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 7: Node.js Web Server &amp; File System (fs.promises) Monitor</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <HardDrive className="w-3.5 h-3.5" />
          <span>LOCAL_FS: leaderboard.json</span>
        </span>
      </div>

      {/* Node.js Backend Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/20 space-y-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 block uppercase text-[11px]">
            Node.js server.js Runtime Specs:
          </span>
          <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
            <li>• HTTP Protocol: Express.js (Port 5000)</li>
            <li>• File Module: <code className="text-cyan-600 dark:text-cyan-400 font-bold">fs.promises</code></li>
            <li>• Target File: <code className="text-emerald-600 dark:text-emerald-400">leaderboard.json</code></li>
            <li>• Concurrency: Non-blocking Event Loop</li>
          </ul>

          <button
            type="button"
            onClick={testFileRead}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>TRIGGER fs.promises.readFile() TEST</span>
          </button>
        </div>

        {/* Live File IO Log Console */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono space-y-1.5 text-slate-300 overflow-x-auto">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-1">
            <span className="flex items-center space-x-1 text-cyan-400">
              <Terminal className="w-3.5 h-3.5" />
              <span>Node.js Asynchronous Event Log</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold">{fsStatus}</span>
          </div>

          <div className="text-slate-400 text-[10px] space-y-0.5 leading-relaxed">
            <div>[NODE_EVENT_LOOP] Server listening on port 5000</div>
            <div>[FS_DISPATCH] fs.promises.readFile(&apos;leaderboard.json&apos;, &apos;utf-8&apos;)</div>
            <div>[JSON_PARSE] Serialized records parsed into memory array</div>
            {lastPayload && (
              <div className="text-emerald-400 mt-1 font-mono text-[9px] max-h-24 overflow-y-auto bg-slate-900 p-1.5 rounded border border-slate-800">
                {lastPayload}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
