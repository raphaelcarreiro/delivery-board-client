import React from 'react';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';

AccountActions.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  handleValidation: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};

export default function AccountActions({ tabIndex, handleValidation, saving }) {
  return (
    <>
      {tabIndex === 0 && (
        <IconButton onClick={handleValidation} color="inherit" disabled={saving}>
          <DoneIcon />
        </IconButton>
      )}
    </>
  );
}
