import React from 'react';
import './SearchInput.css';

function SearchInput({ city, setCity, onSearch }) {
  return (
    <div className="search-input">
      <input
        type="text"
        placeholder="Entrez le nom d'une ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={onSearch}>Rechercher</button>
    </div>
  );
}

export default SearchInput;
