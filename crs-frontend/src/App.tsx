import { useEffect, useState } from 'react';
import { getCourses } from './api/courseApi';
import type { Course } from './types/course';
import './App.css';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data.content))
      .catch(() => setError('Khong the ket noi den api-gateway. Kiem tra lai cac service da chay chua.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page__inner">
        <div className="page__header">
          <div>
            <h1 className="page__title">Danh sach mon hoc</h1>
            <p className="page__subtitle">Test ket noi Frontend &rarr; API Gateway (localhost:8080)</p>
          </div>
          <span className="badge">
            <span className="badge__dot" />
            {courses.length} mon hoc
          </span>
        </div>

        {error && <div className="alert">{error}</div>}

        {loading && !error && (
          <div className="state">
            <div className="spinner" />
            Dang tai du lieu...
          </div>
        )}

        {!loading && !error && (
          <div className="course-grid">
            {courses.map((course) => {
              const isFull = course.soChoConLai === 0;
              const percentFilled = Math.round(
                ((course.soChoToiDa - course.soChoConLai) / course.soChoToiDa) * 100,
              );
              return (
                <div className="course-card" key={course.id}>
                  <h2 className="course-card__name">{course.tenMonHoc}</h2>
                  <span className="course-card__credits">{course.soTinChi} tin chi</span>
                  <div className="seat-bar">
                    <div
                      className={`seat-bar__fill${isFull ? ' seat-bar__fill--full' : ''}`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                  <div className="seat-info">
                    <span>
                      Con lai {course.soChoConLai}/{course.soChoToiDa} cho
                    </span>
                    <span className={`seat-tag ${isFull ? 'seat-tag--full' : 'seat-tag--open'}`}>
                      {isFull ? 'Het cho' : 'Con cho'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
