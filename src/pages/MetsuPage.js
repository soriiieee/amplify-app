import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MetsuPage.css';

export default function MetsuPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, finalBlow } = state || {};

  const [phase, setPhase] = useState('crack'); // crack | metsu | vanish | done

  useEffect(() => {
    if (!state) { navigate('/'); return; }
    const t1 = setTimeout(() => setPhase('metsu'), 800);
    const t2 = setTimeout(() => setPhase('vanish'), 2200);
    const t3 = setTimeout(() => setPhase('done'), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className={`metsu-page phase-${phase}`}>
      <div className="crack-overlay" />

      <div className="boss-container">
        <div className="boss-final">👨‍💼</div>
        <div className="final-blow-text">「{finalBlow}」</div>
      </div>

      <div className="metsu-kanji">滅</div>

      <div className="explosion">
        {['💥', '✨', '⚡', '🔥', '💫'].map((e, i) => (
          <span key={i} className={`spark spark-${i}`}>{e}</span>
        ))}
      </div>

      {phase === 'done' && (
        <div className="done-screen">
          <h1 className="done-title">⚡ {name} を滅した ⚡</h1>
          <p className="done-msg">スッキリしたか？</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            もう一度やる 🔥
          </button>
        </div>
      )}
    </div>
  );
}
