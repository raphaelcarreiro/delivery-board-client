import { IconButton } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React, { FC } from 'react';
import { useModal } from 'src/components/modal/hooks/useModal';
import { useCart } from '../hooks/useCart';

interface CartCustomerActionsProps {
  handleConfirm(closeDialog: () => void): void;
}

const CartCustomerActions: FC<CartCustomerActionsProps> = ({ handleConfirm }) => {
  const { handleModalClose } = useModal();
  const { saving } = useCart();

  function handleClick() {
    handleConfirm(handleModalClose);
  }

  return (
    <div>
      <IconButton disabled={saving} color="inherit" onClick={handleClick}>
        <Done />
      </IconButton>
    </div>
  );
};

export default CartCustomerActions;
