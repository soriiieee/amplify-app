import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PersonaRefinePage.css';

const SITUATIONS = ['オフィス', 'クライアント先', '会議中', '道端で', '家庭内で'];
const COLLAPSE_TYPES = ['物理的なもの', '精神的なもの'];

export default function PersonaRefinePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, persona, provider = 'claude' } = state || {};

  const [stageMode, setStageMode] = useState('four'); // 'one' | 'four' | 'custom'
  const [customStages, setCustomStages] = useState(4);
  const [situation, setSituation] = useState('');
  const [situationNote, setSituationNote] = useState('');
  const [collapseType, setCollapseType] = useState('');

  if (!state) {
    navigate('/');
    return null;
  }

  const stages = stageMode === 'one' ? 1 : stageMode === 'four' ? 4 : customStages;
  const canProceed = situation && collapseType;

  function handleGoToBattle() {
    if (!canProceed) return;
    const fullSituation = situationNote.trim()
      ? `${situation}（${situationNote.trim()}）`
      : situation;
    navigate('/battle', { state: { name, persona, stages, situation: fullSituation, collapse_type: collapseType, provider } });
  }

  return (
    <div className="refine-page">
      <h1 className="refine-title">🔍 上司ペルソナ確認</h1>

      <div className="persona-card">
        <h2>「{name}」の性格分析</h2>
        <div className="traits">
          {persona?.traits?.map((t, i) => <span key={i} className="trait-tag">{t}</span>)}
        </div>
        <div className="persona-detail">
          <p><span className="label">口癖:</span> 「{persona?.catchphrase}」</p>
          <p><span className="label">弱点:</span> {persona?.weakness}</p>
          <div className="annoyance">
            <span className="label">嫌さレベル:</span>
            <span className="annoyance-bar">
              {'😡'.repeat(Math.min(persona?.annoyance_level || 0, 10))}
            </span>
            <span className="annoyance-num">{persona?.annoyance_level}/10</span>
          </div>
        </div>
      </div>

      <div className="metsu-setup">
        <h3 className="setup-section-title">「滅」の設定</h3>

        <div className="setup-section">
          <p className="setup-label">段階数</p>
          <div className="stage-options">
            {[['one', '1発で滅'], ['four', '4段落ち'], ['custom', '自由設定']].map(([mode, label]) => (
              <button
                key={mode}
                className={`stage-btn ${stageMode === mode ? 'active' : ''}`}
                onClick={() => setStageMode(mode)}
              >
                {label}
              </button>
            ))}
          </div>
          {stageMode === 'custom' && (
            <div className="custom-stage">
              <input
                type="range"
                min={2}
                max={8}
                value={customStages}
                onChange={e => setCustomStages(Number(e.target.value))}
                className="stage-slider"
              />
              <span className="stage-value">{customStages}段落ち</span>
            </div>
          )}
        </div>

        <div className="setup-section">
          <p className="setup-label">状況</p>
          <div className="option-grid">
            {SITUATIONS.map(s => (
              <button
                key={s}
                className={`option-btn ${situation === s ? 'active' : ''}`}
                onClick={() => setSituation(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            className="situation-note"
            placeholder="補足があれば自由に（例: 大事なプレゼン直前に難クレームを押しつけてきた）"
            value={situationNote}
            onChange={e => setSituationNote(e.target.value)}
            rows={2}
          />
        </div>

        <div className="setup-section">
          <p className="setup-label">崩壊するのは？</p>
          <div className="option-grid">
            {COLLAPSE_TYPES.map(c => (
              <button
                key={c}
                className={`option-btn ${collapseType === c ? 'active' : ''}`}
                onClick={() => setCollapseType(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn-primary"
        onClick={handleGoToBattle}
        disabled={!canProceed}
      >
        滅のプロセスを生成 →
      </button>
    </div>
  );
}
