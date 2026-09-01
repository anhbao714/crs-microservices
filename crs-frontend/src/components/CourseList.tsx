import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
}: CourseListProps) {
  if (state === 'loading') {
    return (
      <div className="state">
        <div className="spinner" />
        Dang tai danh sach mon hoc...
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="alert alert--column">
        <span>{errorMessage}</span>
        <button type="button" className="btn btn--danger" onClick={onRetry}>
          Thu lai
        </button>
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div className="state">
        <span className="state__icon">&#128269;</span>
        Khong tim thay mon hoc nao phu hop.
      </div>
    );
  }

  return (
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
            {(onEdit || onDelete) && (
              <div className="course-card__actions">
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn--sm btn--secondary"
                    onClick={() => onEdit(course)}
                  >
                    ✎ Sửa
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="btn btn--sm btn--danger"
                    onClick={() => onDelete(course)}
                  >
                    ✕ Xóa
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
