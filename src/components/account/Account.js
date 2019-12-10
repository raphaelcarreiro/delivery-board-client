import React, { useEffect, useContext, useState } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { setUser } from '../../store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';

export function Account() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user);
    if (user.loadedFromStorage) {
      api()
        .get(`/users/${user.id}`)
        .then(response => {
          dispatch(setUser(response.data));
        })
        .catch(err => {
          if (err.response) messaging(err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {loading ? (
        <span>Carregando...</span>
      ) : (
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
