import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

interface PaymentCardActionsProps {
  handleSubmit(): void;
}

const PaymentCardActions: React.FC<PaymentCardActionsProps> = ({ handleSubmit }) => {
  return (
    <Tooltip title="Salvar">
      <IconButton color="inherit" onClick={handleSubmit}>
        <DoneIcon />
      </IconButton>
    </Tooltip>
  );
};

export default PaymentCardActions;
