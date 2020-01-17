import React, { useEffect, useContext, useState } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import {
  setUser,
  userChange,
  customerChange,
  selectImage,
  deleteImage,
  deleteCustomerAddress,
} from '../../store/redux/modules/user/actions';
import { MessagingContext } from '../messaging/Messaging';
import CustomAppbar from '../appbar/CustomAppbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountForm from './AccountForm';
import AccountTabs from './AccountTabs';
import AccountTabsAppbar from './AccountTabsAppbar';
import { AppContext } from '../../App';
import AccountAddresses from './addresses/AccountAddresses';
import Loading from '../loading/Loading';
import DialogDelete from '../dialog/delete/DialogDelete';
import PageHeader from 'src/components/pageHeader/PageHeader';
import AccountActions from 'src/components/account/AccountActions';

const useStyles = makeStyles(theme => ({
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
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
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

  function handleDeleteAddress(address) {
    setDialogDeleteAddress(true);
    setSelectedAddress(address);
  }

  function handleConfirmDelete(addressId) {
    setSaving(true);
    api()
      .delete(`/customerAddresses/${selectedAddress.id}`)
      .then(() => {
        messaging.handleOpen('Excluído');
        dispatch(deleteCustomerAddress(selectedAddress.id));
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleSubmit() {
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
        actionComponent={<AccountActions tabIndex={tabIndex} handleSubmit={handleSubmit} />}
        TabComponent={<AccountTabsAppbar tabIndex={tabIndex} handleTabChange={handleTabChange} />}
      />
      {dialogDeleteAddress && (
        <DialogDelete
          title="Excluir endereço"
          message="Deseja realmente excluir esse endereço?"
          onExited={() => setDialogDeleteAddress(false)}
          handleDelete={handleConfirmDelete}
          buttonText="Sim, excluir"
        />
      )}
      {saving && <Loading background="rgba(250,250,250, 0.5)" />}

      {loading ? (
        <Loading background="rgba(250,250,250, 0.5)" />
      ) : (
        <Grid container>
          <PageHeader title="Minha conta" description="Gerencie os dados e endereços da sua conta" />
          {!isMobile && windowWidth >= 960 && (
            <Grid item xs={12} container>
              <AccountTabs tabIndex={tabIndex} handleTabChange={handleTabChange} />
            </Grid>
          )}
          <div className={classes.container}>
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
              tabIndex === 1 && (
                <AccountAddresses handleDeleteAddress={handleDeleteAddress} addresses={user.customer.addresses} />
              )
            )}
          </div>
        </Grid>
      )}
    </>
  );
}
