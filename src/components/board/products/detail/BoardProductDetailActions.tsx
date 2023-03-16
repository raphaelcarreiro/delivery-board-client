import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ProductAmountControl from './BoardProductAmountControl';
import BoardProductDetailTotal from './BoardProductDetailTotal';

const useStyles = makeStyles(theme => ({
  actionContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
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
    justifyContent: 'center',
    [theme.breakpoints.down('md')]: {
      position: 'fixed',
    },
  },
}));

type BoardProductDetailActionsProps = {
  amount: number;
  total: string;
};

const BoardProductDetailActions: React.FC<BoardProductDetailActionsProps> = ({ amount, total }) => {
  const classes = useStyles();

  return (
    <div className={classes.action}>
      <Grid item xs={12}>
        <div className={classes.actionContent}>
          <ProductAmountControl amount={amount} />
          <BoardProductDetailTotal total={total} />
        </div>
      </Grid>
    </div>
  );
};

export default BoardProductDetailActions;
