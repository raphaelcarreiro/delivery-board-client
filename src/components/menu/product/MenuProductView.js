import React from 'react';
import DialogFullScreen from '../../dialog/DialogFullscreen';
import { Grid } from '@material-ui/core';

export default function MenuProductView({ onExited, product }) {
  return (
    <DialogFullScreen backgroundColor="#fafafa" handleModalState={onExited} title="Adicionar produto à sacola">
      <Grid container>
        <Grid item xs={12}>
          {product.name}
        </Grid>
      </Grid>
    </DialogFullScreen>
  );
}
