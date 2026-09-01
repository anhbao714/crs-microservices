import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import type { ApiErrorResponse } from '../types/apiError';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await loginApi({ username, password });
      login(res.data);
      navigate('/courses');
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          padding: 40,
          backgroundColor: 'var(--surface)',
          borderRadius: 12,
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
        }}
      >
        <h2 style={{ marginBottom: 28, color: 'var(--text)', textAlign: 'center' }}>🔐 Đăng nhập CRS</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
              Tên đăng nhập
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              style={{
                width: '100%',
                padding: '10px 12px',
                boxSizing: 'border-box',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 14,
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{
                width: '100%',
                padding: '10px 12px',
                boxSizing: 'border-box',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 14,
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
              }}
            />
          </div>
          {error && (
            <div
              style={{
                marginBottom: 16,
                padding: 12,
                backgroundColor: 'var(--danger-soft)',
                color: 'var(--danger)',
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: submitting ? 'var(--text-muted)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 16,
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4338ca';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--primary)';
              }
            }}
          >
            {submitting ? '⏳ Đang xử lý...' : '🔓 Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}
