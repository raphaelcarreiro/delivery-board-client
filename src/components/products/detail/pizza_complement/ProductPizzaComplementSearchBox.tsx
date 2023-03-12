import { useState, useRef, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface ProductPizzaComplementSearchBoxProps {
  handleSearch(categoryId: number, searchValue: string): void;
  closeSearchBox(): void;
  categoryId: number;
}

export default function ProductPizzaComplementSearchBox({
  handleSearch,
  closeSearchBox,
  categoryId,
}: ProductPizzaComplementSearchBoxProps) {
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    handleSearch(categoryId, search);
  }, [categoryId, handleSearch, search]);

  function handleInputChange(event) {
    setSearch(event.target.value);
  }

  function handleClearSearch() {
    setSearch('');

    ref.current?.focus();
  }

  function handleCloseBoxClick() {
    closeSearchBox();
    handleSearch(categoryId, '');
  }

  return (
    <>
      <IconButton onClick={handleCloseBoxClick} style={{ marginRight: 10 }}>
        <ArrowBackIcon />
      </IconButton>
      <TextField
        inputRef={ref}
        value={search}
        placeholder="Digite o sabor..."
        fullWidth
        autoFocus
        onChange={handleInputChange}
        InputProps={
          search
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClearSearch} color="inherit">
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : undefined
        }
      />
    </>
  );
}
