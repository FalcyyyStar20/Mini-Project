import React from 'react';
import { Route, MapPin, Compass, Cpu } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';

export const Room5ReactRouterWidget: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const routes = [
    { path: '/', component: 'Lobby', desc: 'Student Registration & Curriculum Portal' },
    { path: '/room/:id', component: 'RoomPage', desc: 'Dynamic Escape Room Challenge View (Active)', active: true },
    { path: '/escaped', component: 'EscapedPage', desc: 'Evaluation Certificate & Leaderboard Sign-off' }
  ];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Route className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 5: React SPA &amp; React Router Dynamic Route Dispatcher</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>REACT_ROUTER_V7 // SPA_CLIENT</span>
        </span>
      </div>

      {/* Live SPA Route Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/20 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
            Active Browser Path (location.pathname)
          </span>
          <div className="font-orbitron font-bold text-sm text-cyan-700 dark:text-cyan-300 flex items-center space-x-1.5">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>{location.pathname}</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/20 space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
            Extracted Route Param (useParams&lt;&#123; id &#125;&gt;())
          </span>
          <div className="font-orbitron font-bold text-sm text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>&#123; id: &quot;{id || '5'}&quot; &#125;</span>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className="space-y-2 font-mono text-xs">
        <span className="text-slate-600 dark:text-slate-400 font-semibold text-[11px] uppercase block">
          Client-Side SPA Route Table:
        </span>
        <div className="space-y-1.5">
          {routes.map((r) => (
            <div
              key={r.path}
              className={`p-2.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] ${
                r.active
                  ? 'bg-cyan-100 dark:bg-cyan-950/70 border-cyan-500 text-cyan-900 dark:text-cyan-200 font-semibold glow-cyan-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-950 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold">
                  {r.path}
                </code>
                <span>&lt;{r.component} /&gt;</span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
