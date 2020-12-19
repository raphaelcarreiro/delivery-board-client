import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { IconButton, TextField, InputAdornment } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'src/store/redux/selector';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  cartBadge: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 3,
    left: 25,
    backgroundColor: theme.palette.primary.dark,
    borderRadius: '50%',
    height: 20,
    width: 20,
    fontSize: 12,
    color: '#FFF',
  },
}));

const theme = createMuiTheme({
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
  openSearchBox(): void;
  handleSearch(value: string): void;
};

const ProductsAction: React.FC<ProductsActionsProps> = ({ isSearching, openSearchBox, handleSearch }) => {
  const cart = useSelector(state => state.cart);
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLInputElement>();
  const app = useApp();

  useEffect(() => {
    handleSearch(search);
  }, [search]); //eslint-disable-line

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
        </MuiThemeProvider>
      ) : (
        <>
          <IconButton color="inherit" onClick={openSearchBox}>
            <SearchIcon />
          </IconButton>
          <IconButton onClick={() => app.handleCartVisibility(true)} color="inherit">
            {cart.products.length > 0 && <span className={classes.cartBadge}>{cart.products.length}</span>}
            <ShoppingCartIcon />
          </IconButton>
        </>
      )}
    </>
  );
};

export default ProductsAction;
