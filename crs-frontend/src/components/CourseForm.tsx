import { useState, useEffect } from 'react';
import type { Course, CourseFormValues } from '../types/course';
import { emptyCourseForm } from '../types/course';

interface CourseFormProps {
  editingCourse: Course | null;
  onSubmit: (values: CourseFormValues) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
  serverError: string | null;
}

export default function CourseForm({
  editingCourse,
  onSubmit,
  onCancel,
  submitting,
  serverError,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(emptyCourseForm);
  const [clientErrors, setClientErrors] = useState<Partial<CourseFormValues>>({});

  useEffect(() => {
    if (editingCourse) {
      setValues({
        tenMonHoc: editingCourse.tenMonHoc,
        soTinChi: String(editingCourse.soTinChi),
        soChoToiDa: String(editingCourse.soChoToiDa),
      });
    } else {
      setValues(emptyCourseForm);
    }
    setClientErrors({});
  }, [editingCourse]);

  const validate = (): boolean => {
    const errors: Partial<CourseFormValues> = {};

    if (!values.tenMonHoc.trim()) {
      errors.tenMonHoc = 'Tên môn học không được để trống';
    }

    const soTinChi = Number(values.soTinChi);
    if (!values.soTinChi || isNaN(soTinChi) || soTinChi <= 0) {
      errors.soTinChi = 'Số tín chỉ phải là số lớn hơn 0';
    }

    const soChoToiDa = Number(values.soChoToiDa);
    if (!values.soChoToiDa || isNaN(soChoToiDa) || soChoToiDa <= 0) {
      errors.soChoToiDa = 'Số chỗ tối đa phải là số lớn hơn 0';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  };

  return (
    <div className="form-section">
      <h2 className="form-section__title">
        {editingCourse ? '✎ Chỉnh sửa môn học' : '➕ Thêm môn học mới'}
      </h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label htmlFor="tenMonHoc" className="form__label">
            Tên môn học
            <span className="form__required">*</span>
          </label>
          <input
            id="tenMonHoc"
            type="text"
            value={values.tenMonHoc}
            onChange={(e) => setValues({ ...values, tenMonHoc: e.target.value })}
            placeholder="Nhập tên môn học"
            className={`form__input ${clientErrors.tenMonHoc ? 'form__input--error' : ''}`}
            disabled={submitting}
          />
          {clientErrors.tenMonHoc && (
            <p className="form__error">
              <span className="form__error-icon">⚠</span>
              {clientErrors.tenMonHoc}
            </p>
          )}
        </div>

        <div className="form__row">
          <div className="form__group">
            <label htmlFor="soTinChi" className="form__label">
              Số tín chỉ
              <span className="form__required">*</span>
            </label>
            <input
              id="soTinChi"
              type="number"
              value={values.soTinChi}
              onChange={(e) => setValues({ ...values, soTinChi: e.target.value })}
              placeholder="0"
              className={`form__input ${clientErrors.soTinChi ? 'form__input--error' : ''}`}
              disabled={submitting}
              min="1"
            />
            {clientErrors.soTinChi && (
              <p className="form__error">
                <span className="form__error-icon">⚠</span>
                {clientErrors.soTinChi}
              </p>
            )}
          </div>

          <div className="form__group">
            <label htmlFor="soChoToiDa" className="form__label">
              Số chỗ tối đa
              <span className="form__required">*</span>
            </label>
            <input
              id="soChoToiDa"
              type="number"
              value={values.soChoToiDa}
              onChange={(e) => setValues({ ...values, soChoToiDa: e.target.value })}
              placeholder="0"
              className={`form__input ${clientErrors.soChoToiDa ? 'form__input--error' : ''}`}
              disabled={submitting}
              min="1"
            />
            {clientErrors.soChoToiDa && (
              <p className="form__error">
                <span className="form__error-icon">⚠</span>
                {clientErrors.soChoToiDa}
              </p>
            )}
          </div>
        </div>

        {serverError && (
          <div className="alert alert--error">
            <span className="alert__icon">✕</span>
            <span>{serverError}</span>
          </div>
        )}

        <div className="form__actions">
          <button type="submit" disabled={submitting} className="btn btn--primary">
            {submitting
              ? editingCourse
                ? '⏳ Đang cập nhật...'
                : '⏳ Đang thêm...'
              : editingCourse
                ? '💾 Cập nhật'
                : '➕ Thêm mới'}
          </button>

          {editingCourse && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="btn btn--secondary"
            >
              ✕ Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
