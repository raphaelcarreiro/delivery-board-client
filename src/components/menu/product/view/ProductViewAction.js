import React, { useContext } from 'react';
import { Grid, IconButton, Button, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { makeStyles } from '@material-ui/core/styles';
import { DialogFullscreenContext } from '../../../dialog/DialogFullscreen';
import PropTypes from 'prop-types';
import { moneyFormat } from '../../../../helpers/numberFormat';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: 150,
  },
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  amountControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: 4,
    marginRight: 10,
    height: 40,
  },
  action: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    justifyContent: 'center',
  },
  amount: {
    textAlign: 'center',
  },
  buttonAmount: {
    minWidth: 50,
  },
  finalPrice: {
    color: theme.palette.primary.contrastText,
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

ProductViewAction.propTypes = {
  handleAmountDown: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  handleAmountUp: PropTypes.func.isRequired,
  handleAddProductToCart: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  additionalPrice: PropTypes.object.isRequired,
};

export default function ProductViewAction({
  handleAmountDown,
  amount,
  handleAmountUp,
  handleAddProductToCart,
  product,
  additionalPrice,
}) {
  const classes = useStyles();
  const { handleCloseDialog } = useContext(DialogFullscreenContext);
  return (
    <div className={classes.action}>
      <Grid item xs={12} xl={5} lg={6} md={10}>
        <div className={classes.actionContent}>
          <div className={classes.amountControl}>
            <IconButton variant="text" onClick={handleAmountDown} className={classes.buttonAmount}>
              <RemoveIcon color="primary" variant="text" />
            </IconButton>
            <div className={classes.amount}>
              <Typography variant="h6">{amount}</Typography>
            </div>
            <IconButton variant="text" onClick={handleAmountUp} className={classes.buttonAmount}>
              <AddIcon color="primary" variant="text" />
            </IconButton>
          </div>

          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => {
              handleAddProductToCart();
              handleCloseDialog();
            }}
          >
            <span>Adicionar</span>
            <Typography className={classes.finalPrice} color="textPrimary">
              {moneyFormat((product.price + additionalPrice) * amount)}
            </Typography>
          </Button>
        </div>
      </Grid>
    </div>
  );
}
