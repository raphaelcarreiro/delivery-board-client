import React from 'react';
import { IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingBasket';
import Link from '../link/Link';

export default function IndexAppbarActions() {
  return (
    <>
      <IconButton color="inherit">
        <SearchIcon />
      </IconButton>
      <IconButton component={Link} href="/cart" color="inherit">
        <ShoppingCartIcon />
      </IconButton>
    </>
  );
}
