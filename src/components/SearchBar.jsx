import { useState, useRef, useEffect } from 'react';

function SearchBar({ query, onSearch, onClear }) {
  const [input, setInput] = useState(query);
  const inputRef = useRef(null);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  const handleClear = () => {
    setInput('');
    onClear();
    inputRef.current?.focus();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a keyword (e.g., pizza, food, pune)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {input && (
          <button type="button" className="clear-btn" onClick={handleClear} title="Clear search">
            ✕
          </button>
        )}
        <button type="submit" className="search-btn">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;

