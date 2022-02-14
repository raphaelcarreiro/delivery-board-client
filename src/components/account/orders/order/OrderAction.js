import React from 'react';
import { Button, Tooltip, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useFirebase } from 'src/providers/FirebaseProvider';
import { useSelector } from 'react-redux';
import { firebaseMessagingIsSupported } from 'src/config/FirebaseConfig';

OrderAction.propTypes = {
  loading: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

export default function OrderAction({ handleRefresh, loading }) {
  const firebase = useFirebase();
  const user = useSelector(state => state.user);

  return (
    <>
      <Tooltip title="Atualizar">
        <span>
          <IconButton onClick={handleRefresh} color="inherit" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </span>
      </Tooltip>
      {user.id && !firebase.fmHasToken && firebaseMessagingIsSupported() && (
        <Tooltip title="Salvar">
          <Button
            onClick={firebase.requestPermissionMessaging}
            type="submit"
            size="small"
            color="inherit"
            startIcon={<NotificationsActiveIcon />}
          >
            Ativar
          </Button>
        </Tooltip>
      )}
    </>
  );
}
