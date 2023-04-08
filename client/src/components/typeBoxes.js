import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import '../styles/TypeBox.css';

function TypeBox({ currentFilters, setFilters }) {
  const [pokeTypes, setPokeTypes] = useState([]);
  const url = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json';

  useEffect(() => {
    fetch(url)
      .then((resp) => {
        return resp.json();
      })
      .then((processedResp) => {
        setPokeTypes(processedResp.map((type) => ({ label: type.english, value: type.english })));
      })
      .catch((err) => console.log('error:', err));
  }, []);

  const handleChange = (selectedOptions) => {
    setFilters(selectedOptions.map((option) => option.value));
  };

  return (
    <div className="typebox-container">
      <Select
        options={pokeTypes}
        isMulti
        className="typebox-select"
        onChange={handleChange}
        placeholder="Select Pokemon Types"
      />
    </div>
  );
}

export default TypeBox;
