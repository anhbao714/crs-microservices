import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { getMyRegistrations, cancelRegistration } from '../api/registrationApi';
import { getCourseById } from '../api/courseApi';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';
import type { Registration } from '../types/registration';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

interface RegistrationRow extends Registration {
  courseName: string;
}

export default function MyRegistrationsPage() {
  const [rows, setRows] = useState<RegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await getMyRegistrations();
      const activeRegistrations = res.data.filter((r) => r.trangThai === 'DA_DANG_KY');

      const enriched = await Promise.all(
        activeRegistrations.map(async (reg) => {
          try {
            const courseRes = await getCourseById(reg.courseId);
            return { ...reg, courseName: (courseRes.data as Course).tenMonHoc };
          } catch {
            return {
              ...reg,
              courseName: `Môn học #${reg.courseId} (không tìm thấy thông tin)`,
            };
          }
        }),
      );
      setRows(enriched);
    } catch (err) {
      let message = 'Không tải được danh sách đăng ký.';
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCancel = async (row: RegistrationRow) => {
    if (!window.confirm(`Huỷ đăng ký môn "${row.courseName}"?`)) return;
    setCancellingId(row.id);
    try {
      await cancelRegistration(row.id);
      showToast(`Đã huỷ đăng ký môn "${row.courseName}"`, 'success');
      loadData();
    } catch (err) {
      let message = 'Huỷ đăng ký không thành công.';
      if (axios.isAxiosError<ApiErrorResponse>(err) && err.response?.data?.message) {
        message = err.response.data.message;
      }
      showToast(message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px', color: 'var(--text)', fontSize: '28px', fontWeight: 600 }}>
          📚 Môn học đã đăng ký
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
          Danh sách các môn học bạn đã đăng ký
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '4px solid var(--border)',
              borderTop: '4px solid var(--primary)',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Đang tải...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {!loading && loadError && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fee2e2',
            borderLeft: '4px solid #dc2626',
            borderRadius: '4px',
            color: '#991b1b',
          }}
        >
          <p style={{ margin: 0, fontWeight: 500 }}>⚠️ {loadError}</p>
        </div>
      )}

      {!loading && !loadError && rows.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '24px' }}>
            Bạn chưa đăng ký môn học nào
          </p>
          <a
            href="/register-course"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.9')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
          >
            Đi đăng ký ngay
          </a>
        </div>
      )}

      {!loading && !loadError && rows.length > 0 && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {rows.map((row) => (
            <div
              key={row.id}
              style={{
                padding: '16px',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'box-shadow 0.2s',
                boxShadow: 'var(--shadow)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow)';
              }}
            >
              <div>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    color: 'var(--text)',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  {row.courseName}
                </h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
                  📅 Đăng ký lúc: {new Date(row.ngayDangKy).toLocaleString('vi-VN')}
                </p>
              </div>
              <button
                onClick={() => handleCancel(row)}
                disabled={cancellingId === row.id}
                style={{
                  padding: '8px 16px',
                  backgroundColor: cancellingId === row.id ? '#d1d5db' : '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: cancellingId === row.id ? 'not-allowed' : 'pointer',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  marginLeft: '16px',
                }}
                onMouseEnter={(e) => {
                  if (cancellingId !== row.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b91c1c';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cancellingId !== row.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dc2626';
                  }
                }}
              >
                {cancellingId === row.id ? '⏳ Đang huỷ...' : '🗑️ Huỷ đăng ký'}
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
    </div>
  );
}
