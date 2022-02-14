import React, { FunctionComponent, ChangeEvent } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import { useApp } from 'src/providers/AppProvider';

interface PaymentTabsProps {
  tab: number;
  handleTabChange(event: ChangeEvent<{}>, value: number): void;
  online: boolean;
  offline: boolean;
}

const PaymentTabs: FunctionComponent<PaymentTabsProps> = ({ tab, handleTabChange, online, offline }) => {
  const app = useApp();

  return (
    <Tabs value={tab} onChange={handleTabChange} variant={app.isMobile ? 'scrollable' : 'standard'}>
      {offline && <Tab label="Pague na entrega" value="offline" />}
      {online && <Tab label="Pague online" value="online" />}
    </Tabs>
  );
};

export default PaymentTabs;
