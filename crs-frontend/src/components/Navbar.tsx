import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        gap: 20,
        padding: 16,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center',
        boxShadow: 'var(--shadow)',
      }}
    >
      <Link to="/courses" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>
        📚 Danh sách môn học
      </Link>
      {isAuthenticated && user?.role === 'ADMIN' && (
        <Link to="/admin/courses" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>
          ⚙️ Quản trị môn học
        </Link>
      )}
      {isAuthenticated && user?.role === 'STUDENT' && (
        <>
          <Link to="/register-course" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>
            ✍️ Đăng ký học phần
          </Link>
          <Link to="/my-registrations" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 600 }}>
            📚 Môn học đã đăng ký
          </Link>
        </>
      )}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
              👤 {user?.username} <span style={{ fontWeight: 600, color: 'var(--primary)' }}>({user?.role})</span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 4,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
