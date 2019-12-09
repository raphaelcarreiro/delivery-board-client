import React, { useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { AppContext } from '../../../pages/_app';

export function Account() {
  const appContext = useContext(AppContext);
  const { user } = appContext;

  return (
    <>
      {user && (
        <Grid container>
          <Grid item xs={12}>
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
}
