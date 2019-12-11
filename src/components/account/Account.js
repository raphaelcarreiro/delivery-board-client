import React, { useEffect, useContext, useState } from 'react';
import { Typography, Grid, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { setUser } from '../../store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
import CustomAppbar from '../appbar/CustomAppbar';
import { AppContext } from '../../App';

export function Account() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <CustomAppbar title="Minha conta" />
      {loading ? (
        <span>Carregando...</span>
      ) : (
        <Grid container>
          <Grid item xs={12}>
            <Typography>{user.name}</Typography>
            <Typography>{user.email}</Typography>
            <Button onClick={appContext.handleLogout} color="primary" variant="contained">
              Sair
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
}
