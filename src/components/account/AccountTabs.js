import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function AccountTabs({ tabIndex, handleTabChange }) {
  return (
    <Tabs textColor="primary" indicatorColor="primary" value={tabIndex} onChange={handleTabChange}>
      <Tab label="Dados" />
      <Tab label="Endereços" />
    </Tabs>
  );
}

AccountTabs.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  handleTabChange: PropTypes.func.isRequired,
};
