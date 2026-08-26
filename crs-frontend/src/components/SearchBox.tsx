import { useEffect, useState } from 'react';

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export default function SearchBox({ onSearch, placeholder }: SearchBoxProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="search-box">
      <svg className="search-box__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="search-box__input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder ?? 'Tim kiem theo ten mon hoc...'}
      />
      {inputValue && (
        <button
          type="button"
          className="search-box__clear"
          onClick={() => setInputValue('')}
          aria-label="Xoa tu khoa"
        >
          &times;
        </button>
      )}
    </div>
  );
}
