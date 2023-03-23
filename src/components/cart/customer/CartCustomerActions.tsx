import { IconButton } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import React, { FC } from 'react';
import { useModal } from 'src/components/modal/hooks/useModal';

interface CartCustomerActionsProps {
  handleSubmit(): Promise<void>;
}

const CartCustomerActions: FC<CartCustomerActionsProps> = ({ handleSubmit }) => {
  const { handleModalClose } = useModal();

  function handleClick() {
    handleSubmit()
      .then(handleModalClose)
      .catch(err => console.error(err));
  }

  return (
    <div>
      <IconButton type="submit" color="inherit" onClick={handleClick}>
        <Done />
      </IconButton>
    </div>
  );
};

export default CartCustomerActions;
