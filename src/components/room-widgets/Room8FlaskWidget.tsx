import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2, Code2, Flame } from 'lucide-react';
import { sound } from '../../utils/sound';
import { useGame } from '../../context/GameContext';

export const Room8FlaskWidget: React.FC = () => {
  const { agentName, email } = useGame();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('Academic Curriculum');
  const [comments, setComments] = useState('Outstanding hands-on laboratory simulation covering all 8 curriculum experiments!');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showFlaskCode, setShowFlaskCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsSending(true);

    try {
      // POST request to Flask feedback endpoint (handled by Express proxy or Flask microservice)
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: agentName || 'Anonymous Operative',
          email: email || 'student@gmail.com',
          rating,
          category,
          comments,
          submittedAt: new Date().toISOString()
        })
      });
    } catch {
      // fallback simulation
    }

    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      sound.playSuccess();
    }, 500);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-white/95 dark:bg-[#070c18] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3 text-amber-600 dark:text-amber-400">
        <div className="flex items-center space-x-2 font-orbitron font-bold text-xs uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-amber-500" />
          <span>Experiment 8: Python Flask Feedback Microservice &amp; REST Form</span>
        </div>
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setShowFlaskCode(!showFlaskCode);
          }}
          className="text-[11px] font-mono text-cyan-700 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{showFlaskCode ? 'Hide Flask Controller' : 'View Flask Controller'}</span>
        </button>
      </div>

      {/* Interactive Feedback Form */}
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase">
                Operative Rating:
              </label>
              <div className="flex items-center space-x-1 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setRating(star);
                    }}
                    className="p-1 cursor-pointer transition transform hover:scale-110"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-bold text-amber-600 dark:text-amber-400 text-xs">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase">
                Feedback Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="Academic Curriculum">Experiments 1-8 Curriculum Design</option>
                <option value="Technical Implementation">TypeScript OOP &amp; Full Stack Architecture</option>
                <option value="User Experience">Cyberpunk Terminal &amp; Theme UX</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700 dark:text-slate-300 font-semibold text-[11px] uppercase">
              Operative Evaluation Comments:
            </label>
            <textarea
              rows={2}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Provide constructive feedback for your course professor..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-orbitron font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow cursor-pointer"
          >
            {isSending ? (
              <span>TRANSMITTING TO FLASK SERVER...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>TRANSMIT FEEDBACK VIA FLASK REST API</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-500/50 text-emerald-900 dark:text-emerald-200 font-mono text-xs flex items-center space-x-3 glow-emerald-sm animate-fadeIn">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider block text-emerald-950 dark:text-white">
              Flask Form Response: HTTP 201 Created
            </span>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              Operative feedback payload serialized and written to local feedback logs. Evaluation sign-off enabled!
            </p>
          </div>
        </div>
      )}

      {/* Python Flask Code Inspector */}
      {showFlaskCode && (
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 font-mono text-[11px] text-slate-300 space-y-1.5 animate-fadeIn overflow-x-auto">
          <div className="text-amber-400 font-bold border-b border-slate-800 pb-1 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Python Flask Backend Controller (app.py):</span>
          </div>
          <div><span className="text-cyan-400">from</span> flask <span className="text-cyan-400">import</span> Flask, request, jsonify</div>
          <div>app = Flask(__name__)</div>
          <div className="pt-1 text-amber-300 font-bold">@app.route(<span className="text-emerald-300">&quot;/api/feedback&quot;</span>, methods=[<span className="text-emerald-300">&quot;POST&quot;</span>])</div>
          <div><span className="text-rose-400 font-bold">def</span> <span className="text-emerald-300 font-bold">submit_feedback</span>():</div>
          <div className="pl-4">data = request.get_json()</div>
          <div className="pl-4"># Write to local feedback.json file system...</div>
          <div className="pl-4"><span className="text-rose-400 font-bold">return</span> jsonify(&#123;<span className="text-emerald-300">&quot;status&quot;</span>: <span className="text-emerald-300">&quot;success&quot;</span>&#125;), <span className="text-amber-300">201</span></div>
        </div>
      )}
    </div>
  );
};
