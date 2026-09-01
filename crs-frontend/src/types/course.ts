export interface Course {
  id: number;
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
  soChoConLai: number;
}

export interface CourseRequest {
  tenMonHoc: string;
  soTinChi: number;
  soChoToiDa: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CourseFormValues {
  tenMonHoc: string;
  soTinChi: string;
  soChoToiDa: string;
}

export const emptyCourseForm: CourseFormValues = {
  tenMonHoc: '',
  soTinChi: '',
  soChoToiDa: '',
};
