import React, { useContext } from 'react';
import { Button, Tooltip, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { AppContext } from 'src/App';
import RefreshIcon from '@material-ui/icons/Refresh';

OrderAction.propTypes = {
  user: PropTypes.bool.isRequired,
  hasToken: PropTypes.bool.isRequired,
  isSupported: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

export default function OrderAction({ user, hasToken, isSupported, handleRefresh, loading }) {
  const app = useContext(AppContext);

  return (
    <>
      <Tooltip title="Atualizar">
        <span>
          <IconButton onClick={handleRefresh} color="inherit" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </span>
      </Tooltip>
      {user && !hasToken && isSupported && (
        <Tooltip title="Salvar">
          <Button
            onClick={app.handleRequestPermissionMessaging}
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
