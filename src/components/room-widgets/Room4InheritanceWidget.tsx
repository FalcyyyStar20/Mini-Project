import React, { useState } from 'react';
import { Network, FileCode, Code2 } from 'lucide-react';
import { sound } from '../../utils/sound';

export const Room4InheritanceWidget: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<'Puzzle' | 'TypeScriptInheritancePuzzle' | 'AnalyticsPuzzle'>('TypeScriptInheritancePuzzle');

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-white/95 dark:bg-[#060c1d] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2 text-cyan-700 dark:text-cyan-300 font-orbitron font-bold text-xs uppercase tracking-wider">
          <Network className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Experiment 4: TypeScript OOP Inheritance &amp; Class Polymorphism</span>
        </div>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <FileCode className="w-3.5 h-3.5" />
          <span>src/models/Puzzle.ts</span>
        </span>
      </div>

      {/* Class Hierarchy Diagram & Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Parent Class Card */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedClass('Puzzle');
          }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedClass === 'Puzzle'
              ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 text-cyan-900 dark:text-cyan-200 glow-cyan-sm'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
          }`}
        >
          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
            Abstract Superclass
          </div>
          <div className="font-orbitron font-bold text-sm mt-0.5 text-slate-900 dark:text-white">
            abstract class Puzzle
          </div>
          <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>readonly id: number</li>
            <li>readonly question: string</li>
            <li>abstract validate(): Result</li>
          </ul>
        </div>

        {/* Subclass 1 */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedClass('TypeScriptInheritancePuzzle');
          }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedClass === 'TypeScriptInheritancePuzzle'
              ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 text-cyan-900 dark:text-cyan-200 glow-cyan-sm'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
          }`}
        >
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            Derived Subclass (Room 4)
          </div>
          <div className="font-orbitron font-bold text-sm mt-0.5 text-slate-900 dark:text-white">
            class TypeScriptInheritancePuzzle
          </div>
          <p className="mt-1 text-[10px] text-cyan-700 dark:text-cyan-300 font-bold">
            extends Puzzle &#123; super(...) &#125;
          </p>
          <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>acceptedKeywords: string[]</li>
            <li>override validate(input)</li>
          </ul>
        </div>

        {/* Subclass 2 */}
        <div
          onClick={() => {
            sound.playClick();
            setSelectedClass('AnalyticsPuzzle');
          }}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedClass === 'AnalyticsPuzzle'
              ? 'bg-cyan-100 dark:bg-cyan-950/80 border-cyan-500 text-cyan-900 dark:text-cyan-200 glow-cyan-sm'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
          }`}
        >
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            Derived Subclass (Room 1)
          </div>
          <div className="font-orbitron font-bold text-sm mt-0.5 text-slate-900 dark:text-white">
            class AnalyticsPuzzle
          </div>
          <p className="mt-1 text-[10px] text-cyan-700 dark:text-cyan-300 font-bold">
            extends Puzzle &#123; super(...) &#125;
          </p>
          <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
            <li>acceptedAnswers: string[]</li>
            <li>override validate(input)</li>
          </ul>
        </div>
      </div>

      {/* Code Viewer showing TypeScript Inheritance in action */}
      <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 font-mono text-xs text-slate-300 space-y-2 leading-relaxed overflow-x-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px]">
          <span className="text-cyan-400 font-bold flex items-center space-x-1.5">
            <Code2 className="w-3.5 h-3.5" />
            <span>TypeScript OOP Code Structure:</span>
          </span>
          <span className="text-amber-400">Constructor super() Invocation</span>
        </div>

        <div className="text-[11px]">
          <div><span className="text-rose-400 font-bold">export class</span> <span className="text-emerald-300 font-bold">TypeScriptInheritancePuzzle</span> <span className="text-rose-400 font-bold">extends</span> <span className="text-amber-300 font-bold">Puzzle</span> &#123;</div>
          <div className="pl-4"><span className="text-slate-500">// Derived class constructor must invoke super()</span></div>
          <div className="pl-4"><span className="text-rose-400 font-bold">constructor</span>(id: <span className="text-cyan-400">number</span>, name: <span className="text-cyan-400">string</span>, ...) &#123;</div>
          <div className="pl-8 bg-cyan-950/40 border-l-2 border-cyan-400 py-0.5 text-cyan-200">
            <span className="text-amber-300 font-bold">super</span>(id, roomCode, name, title, question, hint, ...); <span className="text-slate-400">// &lt;-- Parent constructor call</span>
          </div>
          <div className="pl-8"><span className="text-cyan-400 font-bold">this</span>.acceptedKeywords = [<span className="text-emerald-300">&quot;super&quot;</span>, <span className="text-emerald-300">&quot;super()&quot;</span>];</div>
          <div className="pl-4">&#125;</div>
          <div className="pl-4"><span className="text-slate-500">// Polymorphic implementation of abstract validate()</span></div>
          <div className="pl-4"><span className="text-emerald-300 font-bold">validate</span>(input: <span className="text-cyan-400">string</span>): <span className="text-amber-300">PuzzleValidationResult</span> &#123; ... &#125;</div>
          <div>&#125;</div>
        </div>
      </div>
    </div>
  );
};
