import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function AccountTabsAppbar({ tabIndex, handleTabChange }) {
  return (
    <Tabs value={tabIndex} onChange={handleTabChange}>
      <Tab label="Dados" />
      <Tab label="Endereços" />
    </Tabs>
  );
}

AccountTabsAppbar.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
};
