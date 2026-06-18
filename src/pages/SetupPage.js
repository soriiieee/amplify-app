import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const BOSS_TAG_CATEGORIES = [
  {
    label: '態度・性格',
    tags: ['気分のムラが激しい', '怒鳴り声が大きい', '話が長い・くどい', 'えこひいきが酷い', '昭和脳・老害'],
  },
  {
    label: '責任・成果',
    tags: ['手柄は自分のもの', '失敗は部下のせい', '責任を取らない', '成果を横取りする', '言うことがコロコロ変わる'],
  },
  {
    label: 'マネジメント・指示',
    tags: ['マイクロマネジメントが激しい', '急な仕事を説明なしで振る', '残業を美徳と思っている', '部下の意見を無視する', '飲み会への参加を強制する'],
  },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [extraMemo, setExtraMemo] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [provider, setProvider] = useState('claude');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleTag(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('上司の名前を入力してください'); return; }
    if (selectedTags.length === 0 && !extraMemo.trim() && !image) {
      setError('タグを選ぶか、メモを入力するか、写真をアップロードしてください');
      return;
    }
    setError('');
    setLoading(true);

    const memo = [
      ...selectedTags,
      ...(extraMemo.trim() ? [extraMemo.trim()] : []),
    ].join('、');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('memo', memo);
      formData.append('provider', provider);
      if (image) formData.append('image', image);

      const res = await fetch(`${API}/api/persona/analyze`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('API エラー');
      const persona = await res.json();
      navigate('/refine', { state: { name, persona, rally: 1, provider } });
    } catch (err) {
      setError('通信エラーが発生しました。バックエンドが起動しているか確認してください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="setup-page">
      <h1 className="setup-title">嫌すぎて滅</h1>
      <p className="setup-subtitle">まずは誰をボコボコにする？</p>

      <div className="provider-selector">
        {[{ value: 'claude', label: 'Claude' }, { value: 'openai', label: 'GPT' }].map(p => (
          <button
            key={p.value}
            type="button"
            className={`provider-btn ${provider === p.value ? 'active' : ''}`}
            onClick={() => setProvider(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ヤなやつ <span className="required">*</span></label>
          <input
            type="text"
            placeholder="例: 田中部長"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label>
            特徴タグ
            <span className="hint">（当てはまるものをタップ）</span>
            {selectedTags.length > 0 && (
              <span className="tag-count">{selectedTags.length}個選択中</span>
            )}
          </label>
          <div className="tag-categories">
            {BOSS_TAG_CATEGORIES.map(cat => (
              <div key={cat.label} className="tag-category">
                <p className="tag-category-label">{cat.label}</p>
                <div className="tag-grid">
                  {cat.tags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>追加メモ <span className="hint">（任意・タグにない特徴など）</span></label>
          <textarea
            placeholder="例: 朝だけ機嫌が良い。語尾に「ね？」をつける癖がある。"
            value={extraMemo}
            onChange={e => setExtraMemo(e.target.value)}
            rows={2}
          />
        </div>

        <div className="form-group">
          <label>写真アップロード <span className="hint">（任意・AIが性格推定）</span></label>
          <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
            {preview
              ? <img src={preview} alt="プレビュー" className="preview-img" />
              : <span className="upload-placeholder">📷 タップして写真を選択</span>
            }
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImage}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '分析中…🔍' : '次へ →'}
        </button>
      </form>
    </div>
  );
}
