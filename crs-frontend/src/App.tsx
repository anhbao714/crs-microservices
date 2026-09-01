import { useCallback, useState } from 'react';
import axios from 'axios';
import { useCourses } from './api/useCourses';
import { createCourse, updateCourse, deleteCourse } from './api/courseApi';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';
import type { Course, CourseFormValues } from './types/course';
import type { ApiErrorResponse } from './types/apiError';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  const extractErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
      const data = err.response?.data;
      if (data?.message) return data.message;
      if (data) {
        const firstFieldError = Object.values(data).find((v) => typeof v === 'string');
        if (firstFieldError) return firstFieldError;
      }
    }
    return 'Đã xảy ra lỗi, vui lòng thử lại.';
  };

  const handleFormSubmit = async (values: CourseFormValues) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
      } else {
        await createCourse(values);
      }
      setEditingCourse(null);
      refetch();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xóa môn học "${course.tenMonHoc}"?`)) return;
    try {
      await deleteCourse(course.id);
      refetch();
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  return (
    <div className="page">
      <div className="page__inner">
        <div className="page__header">
          <div>
            <h1 className="page__title">Quản lý môn học (Admin)</h1>
            <p className="page__subtitle">Thêm, sửa, xóa và tìm kiếm môn học qua API Gateway</p>
          </div>
          {state === 'success' && (
            <span className="badge">
              <span className="badge__dot" />
              {courses.length} môn học
            </span>
          )}
        </div>

        <CourseForm
          editingCourse={editingCourse}
          onSubmit={handleFormSubmit}
          onCancel={() => setEditingCourse(null)}
          submitting={submitting}
          serverError={formError}
        />

        <div className="toolbar">
          <SearchBox onSearch={handleSearch} />
        </div>

        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onEdit={setEditingCourse}
          onDelete={handleDelete}
        />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default App;
