import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BattlePage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function BattlePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, persona, stages, situation, collapse_type, provider = 'claude' } = state || {};

  const [phase, setPhase] = useState('loading'); // loading | narrative
  const [process, setProcess] = useState(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state) { navigate('/'); return; }
    loadProcess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadProcess() {
    setError('');
    try {
      const res = await fetch(`${API}/api/battle/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, persona, stages, situation, collapse_type, provider }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProcess(data);
      setPhase('narrative');
    } catch {
      setError('通信エラーが発生しました。');
    }
  }

  function handleTap() {
    if (transitioning || !process || phase !== 'narrative') return;

    if (currentStage >= process.stages.length - 1) {
      navigate('/metsu', { state: { name, finalBlow: process.final_blow } });
      return;
    }

    setTransitioning(true);
    setTimeout(() => {
      setCurrentStage(prev => prev + 1);
      setTransitioning(false);
    }, 280);
  }

  if (!state) return null;

  const totalStages = process?.stages?.length || 1;
  const progress = totalStages === 1 ? 1 : currentStage / (totalStages - 1);
  const fontSize = totalStages === 1 ? 2.4 : 1.0 + progress * 1.6;
  const isLast = currentStage >= totalStages - 1;

  return (
    <div
      className={`battle-page ${phase === 'narrative' ? 'tappable' : ''}`}
      onClick={handleTap}
    >
      {phase === 'loading' && (
        <div className="loading-phase">
          <p className="loading-text">🤖 滅のプロセスを生成中…</p>
          <div className="spinner" />
          {error && (
            <p
              className="error-msg retry"
              onClick={e => { e.stopPropagation(); loadProcess(); }}
            >
              {error} タップで再試行
            </p>
          )}
        </div>
      )}

      {phase === 'narrative' && process && (
        <div className={`narrative-phase ${transitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="stage-dots">
            {process.stages.map((_, i) => (
              <span
                key={i}
                className={`dot ${i < currentStage ? 'done' : i === currentStage ? 'current' : ''}`}
              />
            ))}
          </div>

          <div
            className="stage-text"
            style={{ fontSize: `${fontSize.toFixed(2)}rem` }}
            data-intensity={Math.round(progress * 10)}
          >
            {process.stages[currentStage]?.text}
          </div>

          <p className={`tap-hint ${isLast ? 'final' : ''}`}>
            {isLast ? '── 滅 ──' : 'タップで続きへ'}
          </p>
        </div>
      )}
    </div>
  );
}
