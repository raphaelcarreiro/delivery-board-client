import React, { Fragment } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';

function AccountAddressesAction({ saving }) {
  return (
    <Fragment>
      <Tooltip title="Salvar">
        <IconButton type="submit" disabled={saving} color="inherit">
          <DoneIcon />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
}

AccountAddressesAction.propTypes = {
  saving: PropTypes.bool.isRequired,
};

export default AccountAddressesAction;
