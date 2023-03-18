import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';

const styles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: theme.palette.warning.light,
    padding: 10,
    fontWeight: 'bold',
  },
}));

const BoardNoMovement: FC = () => {
  const classes = styles();

  return (
    <div className={classes.container}>
      <div className={classes.warning}>
        <Typography variant="h6">Você precisa escanear o código QR disponível na mesa para enviar pedidos</Typography>
      </div>
    </div>
  );
};

export default BoardNoMovement;
