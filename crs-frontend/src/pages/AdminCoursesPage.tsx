import { useCallback, useState } from 'react';
import axios from 'axios';
import { useCourses } from '../api/useCourses';
import { createCourse, updateCourse, deleteCourse } from '../api/courseApi';
import SearchBox from '../components/SearchBox';
import CourseList from '../components/CourseList';
import Pagination from '../components/Pagination';
import CourseForm from '../components/CourseForm';
import Modal from '../components/Modal';
import type { Course, CourseFormValues } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';

export default function AdminCoursesPage() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handlePageChange = useCallback((newPage: number) => {
    console.log(`[AdminCoursesPage] setPage called with: ${newPage}, current courses: ${courses.map((c) => c.id).join(',')}`);
    setPage(newPage);
  }, [courses]);

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormError(null);
  };

  const handleOpenAddForm = () => {
    setEditingCourse(null);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setFormError(null);
    setIsModalOpen(true);
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
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xoa mon hoc "${course.tenMonHoc}"?`)) return;
    try {
      await deleteCourse(course.id);
      refetch();
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <h1 style={{ marginBottom: 8, color: 'var(--text)' }}>⚙️ Quản lý môn học</h1>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Thêm, sửa, xóa và quản lý các môn học trong hệ thống</p>
          </div>
          <button
            className="btn btn--primary"
            onClick={handleOpenAddForm}
            style={{ whiteSpace: 'nowrap', height: 'fit-content' }}
          >
            ➕ Thêm môn học mới
          </button>
        </div>
      </div>

      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onEdit={handleEditCourse}
          onDelete={handleDelete}
        />
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCourse ? '✏️ Chỉnh sửa môn học' : '➕ Thêm môn học mới'}
      >
        <CourseForm
          editingCourse={editingCourse}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          submitting={submitting}
          serverError={formError}
        />
      </Modal>
    </div>
  );
}
