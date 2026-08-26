import { useState, useEffect, useCallback } from 'react';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';
import type { ApiErrorResponse } from '../types/apiError';
import axios from 'axios';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

// Do lai tren localhost API tra ve qua nhanh, khong kip thay hieu ung loading.
// Cho loading hien thi toi thieu MIN_LOADING_MS truoc khi chuyen sang trang thai ke tiep.
const MIN_LOADING_MS = 600;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useCourses(keyword: string, page: number, size = 9) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchCourses = useCallback(() => {
    setState('loading');
    Promise.all([getCourses(keyword, page, size), wait(MIN_LOADING_MS)])
      .then(([res]) => {
        const data = res.data;
        setCourses(data.content);
        setTotalPages(data.totalPages);
        setState(data.content.length === 0 ? 'empty' : 'success');
      })
      .catch((err) => {
        let message = 'Da xay ra loi khong xac dinh, vui long thu lai.';
        if (axios.isAxiosError<ApiErrorResponse>(err)) {
          if (err.response?.data?.message) {
            message = err.response.data.message;
          } else if (!err.response) {
            message = 'Khong ket noi duoc toi he thong. Vui long thu lai sau.';
          }
        }
        setErrorMessage(message);
        setState('error');
      });
  }, [keyword, page, size]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, totalPages, state, errorMessage, refetch: fetchCourses };
}
