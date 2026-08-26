import { useCallback, useState } from 'react';
import { useCourses } from './api/useCourses';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  return (
    <div className="page">
      <div className="page__inner">
        <div className="page__header">
          <div>
            <h1 className="page__title">Danh sach mon hoc</h1>
            <p className="page__subtitle">Tim kiem va phan trang qua API Gateway (localhost:8080)</p>
          </div>
          {state === 'success' && (
            <span className="badge">
              <span className="badge__dot" />
              {courses.length} mon hoc
            </span>
          )}
        </div>

        <div className="toolbar">
          <SearchBox onSearch={handleSearch} />
        </div>

        <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default App;
