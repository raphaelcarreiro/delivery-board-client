import React, { useEffect, useContext, useState } from 'react';
import { Typography, Grid, TextField, Tabs, Tab } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { setUser, userChange, customerChange, selectImage, deleteImage } from '../../store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
import CustomAppbar from '../appbar/CustomAppbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountForm from './AccountForm';
import AccountTabs from './AccountTabs';
import AccountTabsAppbar from './AccountTabsAppbar';
import { AppContext } from '../../App';
import AccountAddresses from './AccountAddresses';
import Loading from '../loading/Loading';

const useStyles = makeStyles(theme => ({
  header: {
    marginBottom: 20,
  },
  container: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: 20,
    },
  },
}));

export function Account() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messaging = useContext(MessagingContext);
  const { isMobile, windowWidth } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const classes = useStyles();

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

  function handleTabChange(event, value) {
    setTabIndex(value);
  }

  function handleUserChange(index, value) {
    dispatch(userChange(index, value));
  }

  function handleCustomerChange(index, value) {
    dispatch(customerChange(index, value));
  }

  function handleImageSelect() {
    dispatch(selectImage());
  }

  function handleImageDelete() {
    dispatch(deleteImage());
  }

  function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    api()
      .put(`users/${user.id}`, user)
      .then(response => {
        messaging.handleOpen('Salvo');
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <>
      <CustomAppbar
        title="Minha conta"
        TabComponent={<AccountTabsAppbar tabIndex={tabIndex} handleTabChange={handleTabChange} />}
      />
      {saving && <Loading background="rgba(250,250,250, 0.5)" />}

      {loading ? (
        <Loading background />
      ) : (
        <Grid container>
          <Grid item xs={12} className={classes.header}>
            <Typography variant="h6">Minha conta</Typography>
            <Typography color="textSecondary">Gerencie os dados e endereços da sua conta</Typography>
          </Grid>
          {!isMobile && windowWidth >= 960 && (
            <Grid item xs={12} container>
              <AccountTabs tabIndex={tabIndex} handleTabChange={handleTabChange} />
            </Grid>
          )}
          <Grid item xs={12} className={classes.container}>
            {tabIndex === 0 ? (
              <AccountForm
                user={user}
                handleUserChange={handleUserChange}
                handleCustomerChange={handleCustomerChange}
                handleImageSelect={handleImageSelect}
                handleImageDelete={handleImageDelete}
                handleSubmit={handleSubmit}
                saving={saving}
              />
            ) : (
              tabIndex === 1 && <AccountAddresses addresses={user.customer.addresses} />
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}
