import React, { FunctionComponent, ChangeEvent } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { useApp } from 'src/App';

interface PaymentTabsProps {
  tab: number;
  handleTabChange(event: ChangeEvent<{}>, value: number): void;
}

const PaymentTabs: FunctionComponent<PaymentTabsProps> = ({ tab, handleTabChange }) => {
  const app = useApp();

  return (
    <Tabs value={tab} onChange={handleTabChange} variant={app.isMobile ? 'scrollable' : 'standard'}>
      <Tab label="Pague na entrega" />
      <Tab label="Pague on-line" />
    </Tabs>
  );
};

export default PaymentTabs;
