import React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { Search } from '@material-ui/icons';

interface InputSearchProps {
  searchText: string;
  handleSearch(value: string): void;
}

const InputSearch: React.FC<InputSearchProps> = ({ searchText, handleSearch }) => {
  return (
    <>
      <TextField
        label="Buscar"
        placeholder="Buscar endereço e número"
        margin="normal"
        fullWidth
        value={searchText}
        onChange={e => handleSearch(e.target.value)}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default InputSearch;
