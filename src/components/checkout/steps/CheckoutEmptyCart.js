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
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Você precisa escolher alguns itens para finalizar o pedido.
        </Typography>
        <Link color="primary" className={classes.link} href="/menu">
          Ir ao cardápio
        </Link>
      </Grid>
    </Grid>
  );
}
