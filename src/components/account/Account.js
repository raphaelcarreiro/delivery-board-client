import React, { useEffect, useContext, useState, useReducer } from 'react';
import { Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../services/api';
import { setUser, deleteCustomerAddress } from '../../store/redux/modules/user/actions';
import CustomAppbar from '../appbar/CustomAppbar';
import { makeStyles } from '@material-ui/core/styles';
import AccountForm from './AccountForm';
import AccountTabs from './AccountTabs';
import AccountTabsAppbar from './AccountTabsAppbar';
import AccountAddresses from './addresses/AccountAddresses';
import Loading from '../loading/Loading';
import DialogDelete from '../dialog/delete/DialogDelete';
import PageHeader from 'src/components/pageHeader/PageHeader';
import AccountActions from 'src/components/account/AccountActions';
import userReducer, {
  INITIAL_STATE as userCustomerInitialState,
} from 'src/store/context-api/modules/user-customer/reducer';
import {
  userChange as userCustomerChange,
  setUser as setUserCustomer,
} from 'src/store/context-api/modules/user-customer/actions';
import * as yup from 'yup';
import { cpfValidation } from 'src/helpers/cpfValidation';
import { useMessaging } from 'src/hooks/messaging';
import { useApp } from 'src/hooks/app';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      paddingTop: 20,
    },
  },
}));

const AccountContext = React.createContext({
  userCustomer: null,
  dispatch: func => {},
});

export function useAccount() {
  const context = useContext(AccountContext);
  return context;
}

export default function Account() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const messaging = useMessaging();
  const { isMobile, windowWidth } = useApp();
  const [userCustomer, contextDispatch] = useReducer(userReducer, userCustomerInitialState);
  const [saving, setSaving] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [dialogDeleteAddress, setDialogDeleteAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [validation, setValidation] = useState({});
  const classes = useStyles();

  useEffect(() => {
    if (!user.id) return;
    contextDispatch(
      setUserCustomer({
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: user.customer.cpf,
        image: user.image,
        isImageSelected: false,
      })
    );
  }, [contextDispatch, user]);

  function handleTabChange(event, value) {
    setTabIndex(value);
  }

  function handleDeleteAddress(address) {
    setDialogDeleteAddress(true);
    setSelectedAddress(address);
  }

  function handleConfirmDelete(addressId) {
    setSaving(true);
    api
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

  function handleSubmit(data) {
    setSaving(true);
    api
      .put(`users/${user.id}`, data)
      .then(response => {
        dispatch(setUser(response.data));
        messaging.handleOpen('Salvo');
      })
      .catch(err => {
        if (err.response) messaging.handleOpen(err.response.data.error);
      })
      .finally(() => {
        setSaving(false);
      });
  }

  function handleValidation() {
    setValidation({});

    const schema = yup.object().shape({
      cpf: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .test('cpfValidation', 'CPF inválido', value => {
          return cpfValidation(value);
        })
        .required('CPF é obrigatório'),
      phone: yup
        .string()
        .transform((value, originalValue) => {
          return originalValue ? originalValue.replace(/\D/g, '') : '';
        })
        .min(10, 'Telefone inválido')
        .required('O telefone é obrigatório'),
      name: yup
        .string()
        .min(3, 'Nome inválido')
        .required('O nome é obrigatório'),
    });

    const form = {
      name: userCustomer.name,
      phone: userCustomer.phone,
      cpf: userCustomer.cpf,
      image: userCustomer.image,
      customer: {
        cpf: userCustomer.cpf,
      },
    };

    schema
      .validate(form)
      .then(() => {
        handleSubmit(form);
      })
      .catch(err => {
        setValidation({
          [err.path]: err.message,
        });
      });
  }

  function handleUserCustomerChange(index, value) {
    contextDispatch(userCustomerChange(index, value));
  }

  return (
    <>
      <CustomAppbar
        title="Minha conta"
        actionComponent={<AccountActions tabIndex={tabIndex} handleValidation={handleValidation} saving={saving} />}
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

      <Grid container>
        <PageHeader title="Minha conta" description="Gerencie os dados e endereços da sua conta" />
        {!isMobile && windowWidth >= 960 && (
          <Grid item xs={12} container>
            <AccountTabs tabIndex={tabIndex} handleTabChange={handleTabChange} />
          </Grid>
        )}
        <div className={classes.container}>
          {tabIndex === 0 ? (
            <AccountContext.Provider value={{ userCustomer, dispatch: contextDispatch }}>
              <AccountForm
                userCustomer={userCustomer}
                handleUserCustomerChange={handleUserCustomerChange}
                handleValidation={handleValidation}
                saving={saving}
                validation={validation}
              />
            </AccountContext.Provider>
          ) : (
            tabIndex === 1 && (
              <AccountAddresses handleDeleteAddress={handleDeleteAddress} addresses={user.customer.addresses} />
            )
          )}
        </div>
      </Grid>
    </>
  );
}
