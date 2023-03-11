import React, { useState, useRef, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { IconButton, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { ArrowBack } from '@material-ui/icons';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#ff7008',
    },
  },
  overrides: {
    MuiTypography: {
      root: {
        color: '#fff',
      },
    },
    MuiInputBase: {
      root: {
        color: '#fff',
      },
    },
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          borderColor: 'rgba(255,255,255,0.23)',
        },
        '&:hover:not($disabled):not($focused):not($error) $notchedOutline': {
          borderColor: 'white',
        },
      },
      disabled: {},
      focused: {},
      error: {},
    },
    MuiInputLabel: {
      root: {
        color: '#fff',
        '&$focused': {
          color: '#fff',
        },
      },
      focused: {},
    },
    MuiButton: {
      root: {
        '&:hover$disabled': {
          borderColor: 'rgba(0,0,0,0.23)',
        },
      },
      containedSecondary: {
        color: '#fff',
      },
    },
  },
});

type ProductsActionsProps = {
  isSearching: boolean;
  handleSearch(value: string): void;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
};

const ProductsAction: React.FC<ProductsActionsProps> = ({ isSearching, handleSearch, setIsSearching }) => {
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLInputElement>();

  useEffect(() => {
    handleSearch(search);
  }, [handleSearch, search]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  function handleClearSearch() {
    setSearch('');
    ref.current?.focus();
  }

  return (
    <>
      {isSearching ? (
        <MuiThemeProvider theme={theme}>
          <TextField
            inputRef={ref}
            value={search}
            placeholder="pesquisar..."
            fullWidth
            autoFocus
            onChange={handleInputChange}
            InputProps={{
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} color="inherit">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : (
                undefined
              ),
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small" onClick={() => setIsSearching(false)} color="inherit">
                    <ArrowBack />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </MuiThemeProvider>
      ) : (
        <>
          <IconButton color="inherit" onClick={() => setIsSearching(true)}>
            <SearchIcon />
          </IconButton>
        </>
      )}
    </>
  );
};

export default ProductsAction;
