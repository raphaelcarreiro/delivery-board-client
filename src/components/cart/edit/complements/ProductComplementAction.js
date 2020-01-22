import React, { useContext } from 'react';
import { Typography, Grid, Button, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import PropTypes from 'prop-types';
import { moneyFormat } from 'src/helpers/numberFormat';
import { CustomDialogContext } from 'src/components/dialog/CustomDialog';

const useStyles = makeStyles(theme => ({
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
    position: 'absolute',
    zIndex: 10,
    bottom: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    backgroundColor: '#fff',
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
  amount: {
    textAlign: 'center',
  },
  buttonAmount: {
    minWidth: 50,
  },
  finalPrice: {
    color: ({ isReady }) => (isReady ? theme.palette.primary.contrastText : '#888'),
    textAlign: 'right',
    minWidth: 80,
    fontWeight: 500,
  },
}));

ProductComplementAction.propTypes = {
  handleAmountDown: PropTypes.func.isRequired,
  handleAmountUp: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
  complementsPrice: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  handleUpdateCartProduct: PropTypes.func.isRequired,
};

export default function ProductComplementAction({
  handleAmountDown,
  handleAmountUp,
  amount,
  complementsPrice,
  product,
  handleUpdateCartProduct,
}) {
  const classes = useStyles({ isReady: product.ready || false });
  const { handleCloseDialog } = useContext(CustomDialogContext);

  return (
    <div className={classes.action}>
      <Grid item xs={12}>
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
            disabled={!product.ready}
            variant="contained"
            size="large"
            color="primary"
            onClick={() => {
              handleUpdateCartProduct(product, amount);
              handleCloseDialog();
            }}
          >
            <span>Atualizar</span>
            <Typography className={classes.finalPrice} color="textPrimary">
              {moneyFormat((complementsPrice + product.product_price) * amount)}
            </Typography>
          </Button>
        </div>
      </Grid>
    </div>
  );
}
