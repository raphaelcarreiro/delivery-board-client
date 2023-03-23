import { IconButton } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React, { FC } from 'react';
import { useModal } from 'src/components/modal/hooks/useModal';

interface CartCustomerActionsProps {
  handleSubmit(closeDialog: () => void): void;
}

const CartCustomerActions: FC<CartCustomerActionsProps> = ({ handleSubmit }) => {
  const { handleModalClose } = useModal();

  function handleClick() {
    handleSubmit(handleModalClose);
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
