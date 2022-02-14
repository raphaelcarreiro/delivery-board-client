import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { useModal } from 'src/components/modal/hooks/useModal';
import { useCustomerAddress } from '../hooks/useCustomerAddress';

interface NewAddressActionsProps {
  handleValidation(handleModalClose: () => void): void;
  saving: boolean;
}

const NewAddressActions: React.FC<NewAddressActionsProps> = ({ handleValidation, saving }) => {
  const { handleModalClose } = useModal();
  const { step } = useCustomerAddress();
  return (
    <>
      {step === 2 && (
        <Tooltip title="Salvar">
          <IconButton onClick={() => handleValidation(handleModalClose)} disabled={saving} color="inherit">
            <DoneIcon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
};

export default NewAddressActions;
