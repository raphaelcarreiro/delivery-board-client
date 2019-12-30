import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'src/components/link/Link';

const useStyles = makeStyles({
  container: {
    flex: 1,
  },
  content: {
    textAlign: 'center',
  },
  link: {
    fontSize: 20,
  },
});

export default function CheckoutEmptyCart() {
  const classes = useStyles();
  return (
    <Grid container justify="center" alignItems="center" direction="column" className={classes.container}>
      <Grid item xs={12} className={classes.content}>
        <Typography variant="h4" color="textSecondary" gutterBottom>
          Adicione alguns itens na sua Carrinho :)
        </Typography>
        <Link className={classes.link} href="/menu">
          Acessar cardápio
        </Link>
      </Grid>
    </Grid>
  );
}
