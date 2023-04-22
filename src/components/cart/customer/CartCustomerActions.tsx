import { IconButton } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React, { FC } from 'react';
import { useModal } from 'src/components/modal/hooks/useModal';

interface CartCustomerActionsProps {
  handleConfirm(closeDialog: () => void): void;
}

const CartCustomerActions: FC<CartCustomerActionsProps> = ({ handleConfirm }) => {
  const { handleModalClose } = useModal();

  function handleClick() {
    handleConfirm(handleModalClose);
  }

  return (
    <div>
      <IconButton color="inherit" onClick={handleClick}>
        <Done />
      </IconButton>
    </div>
  );
};

export default CartCustomerActions;
