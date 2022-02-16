import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useModal } from 'src/components/modal/hooks/useModal';

interface AccountAddressActionProps {
  handleValidation(handleModalClose: () => void): void;
  saving: boolean;
}

const AccountAddressesAction: React.FC<AccountAddressActionProps> = ({ handleValidation, saving }) => {
  const { handleModalClose } = useModal();
  return (
    <Tooltip title="Salvar">
      <IconButton type="button" onClick={() => handleValidation(handleModalClose)} disabled={saving} color="inherit">
        <DoneIcon />
      </IconButton>
    </Tooltip>
  );
};

export default AccountAddressesAction;
