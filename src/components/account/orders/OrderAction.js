import React, { useContext } from 'react';
import { Button, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import { AppContext } from 'src/App';

function OrderAction({ user, hasToken, isSupported }) {
  const app = useContext(AppContext);

  return (
    <>
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

OrderAction.propTypes = {
  user: PropTypes.bool.isRequired,
  hasToken: PropTypes.bool.isRequired,
  isSupported: PropTypes.bool.isRequired,
};

export default OrderAction;
