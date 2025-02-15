import React from 'react';
import './SearchInput.css';

function SearchInput({ city, setCity, onSearch }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="search-input">
      <label htmlFor="city" className="search-label">Ville :</label>
      <input
        id="city"
        type="text"
        placeholder="Entrez le nom d'une ville"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={onSearch}>Rechercher</button>
    </div>
  );
}

export default SearchInput;
