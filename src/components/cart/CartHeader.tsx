import { IconButton, Typography, makeStyles } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useApp } from 'src/providers/AppProvider';

const styles = makeStyles(theme => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const CartHeader: React.FC = () => {
  const classes = styles();

  const app = useApp();

  return (
    <div className={classes.header}>
      <IconButton onClick={() => app.handleCartVisibility(false)}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h5" color="primary">
        carrinho
      </Typography>
    </div>
  );
};

export default CartHeader;
