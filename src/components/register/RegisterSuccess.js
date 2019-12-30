import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import Link from '../link/Link';

const useStyles = makeStyles({
  container: {
    textAlign: 'center',
  },
});

export default function RegisterSucess() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography gutterBottom>Pronto! Você já pode matar sua fome.</Typography>
      <Button color="primary" component={Link} href="/menu" variant="text" size="large">
        Ver cardápio
      </Button>
    </div>
  );
}
