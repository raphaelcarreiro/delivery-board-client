import React from 'react';
import { IconButton } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';

AccountActions.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default function AccountActions({ tabIndex, handleSubmit }) {
  return (
    <>
      {tabIndex === 0 && (
        <IconButton onClick={handleSubmit} color="inherit">
          <DoneIcon />
        </IconButton>
      )}
    </>
  );
}
