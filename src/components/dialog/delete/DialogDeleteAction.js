import React from 'react';
import { Button } from '@material-ui/core';

function DialogDeleteAction({ handleClose }) {
  return (
    <div>
      <Button onClick={handleClose} variant={'text'} color={'primary'} size={'small'}>
        Fechar
      </Button>
    </div>
  );
}

export default DialogDeleteAction;
