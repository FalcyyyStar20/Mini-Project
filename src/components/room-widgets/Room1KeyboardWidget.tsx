import React from 'react';
import { Keyboard as KeyboardIcon, Sparkles } from 'lucide-react';

interface Props {
  onVirtualKeyPress: (char: string) => void;
}

export const Room1KeyboardWidget: React.FC<Props> = ({ onVirtualKeyPress }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/25 bg-white/95 dark:bg-[#050b1a]/80 space-y-3">
      <div className="flex items-center justify-between text-xs font-mono text-cyan-700 dark:text-cyan-400 border-b border-cyan-500/20 pb-2">
        <span className="flex items-center space-x-1.5">
          <KeyboardIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider">Tactile Interface Matrix</span>
        </span>
        <span className="text-[10px] text-slate-500">HARDWARE_BUS_01</span>
      </div>

      <div className="space-y-1.5 flex flex-col items-center select-none py-1">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex space-x-1 sm:space-x-1.5">
            {row.map((char) => (
              <button
                key={char}
                type="button"
                onClick={() => onVirtualKeyPress(char.toLowerCase())}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded bg-slate-100 hover:bg-cyan-100 border border-slate-300 hover:border-cyan-500 text-slate-800 hover:text-cyan-900 dark:bg-slate-900/90 dark:hover:bg-cyan-950/70 dark:border-slate-700 dark:hover:border-cyan-400 dark:text-slate-200 dark:hover:text-cyan-300 font-mono text-xs font-bold transition-all transform active:scale-95 shadow-xs cursor-pointer"
              >
                {char}
              </button>
            ))}
          </div>
        ))}

        <div className="flex space-x-2 pt-1 w-full max-w-xs justify-center">
          <div className="h-6 px-8 rounded bg-slate-200 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-400 flex items-center justify-center">
            SPACE_BAR
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 text-center italic">
        <Sparkles className="w-3 h-3 inline mr-1 text-cyan-600 dark:text-cyan-400" />
        "I have keys but open no locks. I have space but no room."
      </p>
    </div>
  );
};
