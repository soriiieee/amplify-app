import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!loginId.trim() || !password) { setError('IDとパスワードを入力してください'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      if (res.status === 401) { setError('IDまたはパスワードが違います'); return; }
      if (!res.ok) throw new Error();
      const { token } = await res.json();
      sessionStorage.setItem('metsu_token', token);
      navigate('/', { replace: true });
    } catch {
      setError('通信エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">嫌すぎて滅</h1>
        <p className="login-sub">ログインして始める</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ID</label>
            <input
              type="text"
              placeholder="ログインID"
              value={loginId}
              onChange={e => setLoginId(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'ログイン中…' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
