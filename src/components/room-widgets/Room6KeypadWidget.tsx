import React from 'react';
import { Lock, Unlock, Delete, RotateCcw, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  currentPin: string;
  onPinChange: (pin: string) => void;
  onSubmitPin: () => void;
}

export const Room6KeypadWidget: React.FC<Props> = ({ currentPin, onPinChange, onSubmitPin }) => {
  const handleDigit = (digit: string) => {
    sound.playKeypress();
    if (currentPin.length < 4) {
      onPinChange(currentPin + digit);
    }
  };

  const handleBackspace = () => {
    sound.playClick();
    onPinChange(currentPin.slice(0, -1));
  };

  const handleClear = () => {
    sound.playClick();
    onPinChange('');
  };

  const handleExecute = () => {
    if (currentPin.length === 4) {
      onSubmitPin();
    } else {
      sound.playError();
    }
  };

  // 4 PIN slot indicators
  const slots = [0, 1, 2, 3];

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-white/95 dark:bg-[#070c18] space-y-5 max-w-sm mx-auto shadow-2xl glow-amber">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 text-amber-600 dark:text-amber-400">
        <span className="flex items-center space-x-2 font-orbitron font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
          <span>Master Overlord Vault Keypad</span>
        </span>
        <span className="text-[10px] font-mono text-slate-500">SYS_CORE_PIN</span>
      </div>

      {/* 4 Digit LED Screen */}
      <div className="bg-slate-950 dark:bg-[#02040a] p-4 rounded-xl border border-amber-500/50 shadow-inner flex flex-col items-center space-y-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          {currentPin.length === 4 ? 'PIN BUFFER FULL // READY TO DISARM' : 'ENTER 4-DIGIT AUTHORIZATION CODE'}
        </span>
        <div className="flex space-x-3">
          {slots.map((idx) => {
            const digit = currentPin[idx];
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center font-orbitron text-2xl font-black transition-all duration-200 ${
                  digit
                    ? 'border-amber-400 bg-amber-950/60 text-amber-300 text-glow-amber scale-105'
                    : 'border-slate-800 bg-slate-900/60 text-slate-700'
                }`}
              >
                {digit ? digit : '•'}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3x4 Cyber Keypad Buttons */}
      <div className="grid grid-cols-3 gap-2.5">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="h-12 rounded-lg bg-slate-100 hover:bg-amber-100 border border-slate-300 hover:border-amber-500 text-slate-800 hover:text-amber-900 dark:bg-slate-900/90 dark:hover:bg-amber-950/60 dark:border-slate-700 dark:hover:border-amber-400 dark:text-slate-200 dark:hover:text-amber-300 font-orbitron font-bold text-lg transition transform active:scale-95 shadow cursor-pointer"
          >
            {digit}
          </button>
        ))}

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="h-12 rounded-lg bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-600 hover:text-rose-600 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-rose-400 font-mono text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition active:scale-95"
          title="Clear all digits"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>CLR</span>
        </button>

        {/* Digit 0 */}
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="h-12 rounded-lg bg-slate-100 hover:bg-amber-100 border border-slate-300 hover:border-amber-500 text-slate-800 hover:text-amber-900 dark:bg-slate-900/90 dark:hover:bg-amber-950/60 dark:border-slate-700 dark:hover:border-amber-400 dark:text-slate-200 dark:hover:text-amber-300 font-orbitron font-bold text-lg transition transform active:scale-95 shadow cursor-pointer"
        >
          0
        </button>

        {/* Delete Button */}
        <button
          type="button"
          onClick={handleBackspace}
          className="h-12 rounded-lg bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-600 hover:text-amber-600 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:text-amber-400 font-mono text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer transition active:scale-95"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
          <span>DEL</span>
        </button>
      </div>

      {/* Disarm Vault Button */}
      <button
        type="button"
        onClick={handleExecute}
        disabled={currentPin.length !== 4}
        className={`w-full py-3.5 rounded-xl font-orbitron font-bold text-sm tracking-wider uppercase flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer ${
          currentPin.length === 4
            ? 'bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            : 'bg-slate-200 border border-slate-300 text-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600 cursor-not-allowed'
        }`}
      >
        {currentPin.length === 4 ? (
          <>
            <Unlock className="w-4 h-4 text-slate-950" />
            <span>DISARM MASTER VAULT (EXECUTE)</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>AWAITING 4 DIGITS...</span>
          </>
        )}
      </button>
    </div>
  );
};
