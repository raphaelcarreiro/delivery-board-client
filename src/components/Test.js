import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Test() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Button color="primary" variant="contained">
        Teste
      </Button>
    </div>
  );
}

export default Test;
