import React, { useState } from 'react';
import { User, Code2, Palette, GraduationCap, Shield } from 'lucide-react';
import { sound } from '../../utils/sound';
import { useGame } from '../../context/GameContext';

export const Room2ProfileWidget: React.FC = () => {
  const { agentName, email } = useGame();
  const [glowEnabled, setGlowEnabled] = useState(true);
  const [roundedDegree, setRoundedDegree] = useState<'sm' | 'lg' | 'full'>('lg');
  const [showHtmlCode, setShowHtmlCode] = useState(false);

  const roundedClass =
    roundedDegree === 'sm' ? 'rounded-md' : roundedDegree === 'full' ? 'rounded-3xl' : 'rounded-xl';

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 2: HTML5 Semantic Profile &amp; CSS Styling Sandbox</span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowHtmlCode(!showHtmlCode);
          }}
          className="text-[11px] font-mono text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showHtmlCode ? 'Hide Semantic HTML5' : 'View Semantic HTML5'}</span>
        </button>
      </div>

      {/* Interactive CSS Control Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#02050f] border border-cyan-500/20 text-xs font-mono">
        <span className="text-slate-600 dark:text-slate-400 flex items-center space-x-1">
          <Palette className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>CSS Style Controls:</span>
        </span>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setGlowEnabled(!glowEnabled);
          }}
          className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer transition ${
            glowEnabled
              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
          }`}
        >
          {glowEnabled ? 'box-shadow: ON' : 'box-shadow: OFF'}
        </button>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setRoundedDegree((prev) => (prev === 'sm' ? 'lg' : prev === 'lg' ? 'full' : 'sm'));
          }}
          className="px-2.5 py-1 rounded text-[11px] bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          border-radius: {roundedDegree}
        </button>
      </div>

      {/* Semantic HTML5 Profile Card (<article>) */}
      <article
        className={`p-5 border transition-all duration-300 bg-white dark:bg-slate-900/90 ${roundedClass} ${
          glowEnabled
            ? 'border-cyan-500 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
            : 'border-slate-300 dark:border-slate-800 shadow-xs'
        }`}
      >
        <header className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <figure className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shrink-0 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-cyan-300">
              <User className="w-8 h-8" />
            </div>
            <figcaption className="sr-only">Student Avatar</figcaption>
          </figure>

          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] font-mono text-cyan-700 dark:text-cyan-400 font-bold uppercase tracking-wider block">
              &lt;article&gt; Student Personal Profile
            </span>
            <h3 className="font-orbitron font-extrabold text-xl text-slate-900 dark:text-white">
              {agentName || 'Alex Chen'}
            </h3>
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {email || 'alex.chen@gmail.com'}
            </p>
          </div>
        </header>

        <section className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">Department / Course</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
                <span>Information Technology Engineering (IT_ENG_302)</span>
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] text-slate-400 block uppercase">Security Clearance</span>
              <span className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center space-x-1 mt-0.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Tier 1 Assessment Operative</span>
              </span>
            </div>
          </div>

          <aside className="p-3 rounded-lg bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-500/20 text-slate-700 dark:text-slate-300">
            <span className="font-bold text-cyan-800 dark:text-cyan-300 text-[11px] block uppercase mb-1">
              Technical Competencies:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['HTML5 Semantic Web', 'CSS3 Flex & Grid', 'JavaScript Control Structures', 'TypeScript OOP', 'React Router SPA', 'AngularJS', 'Node.js FS', 'Flask'].map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-slate-900 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </aside>
        </section>
      </article>

      {/* Semantic Markup Code Viewer */}
      {showHtmlCode && (
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-[11px] text-slate-300 space-y-1 animate-fadeIn overflow-x-auto">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 mb-2">
            Semantic HTML5 Architecture:
          </div>
          <div>&lt;<span className="text-rose-400 font-bold">article</span> class=&quot;profile-card&quot;&gt;</div>
          <div className="pl-4">&lt;<span className="text-rose-400">header</span>&gt;</div>
          <div className="pl-8">&lt;<span className="text-rose-400">figure</span>&gt;&lt;<span className="text-rose-400">img</span> src=&quot;avatar.png&quot; /&gt;&lt;/<span className="text-rose-400">figure</span>&gt;</div>
          <div className="pl-8">&lt;<span className="text-rose-400">h3</span>&gt;Student Name&lt;/<span className="text-rose-400">h3</span>&gt;</div>
          <div className="pl-4">&lt;/<span className="text-rose-400">header</span>&gt;</div>
          <div className="pl-4">&lt;<span className="text-rose-400">section</span> class=&quot;academic-metadata&quot;&gt;...&lt;/<span className="text-rose-400">section</span>&gt;</div>
          <div className="pl-4">&lt;<span className="text-rose-400">aside</span> class=&quot;skills-list&quot;&gt;...&lt;/<span className="text-rose-400">aside</span>&gt;</div>
          <div>&lt;/<span className="text-rose-400 font-bold">article</span>&gt;</div>
        </div>
      )}
    </div>
  );
};
