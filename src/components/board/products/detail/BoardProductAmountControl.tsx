import React from 'react';
import { IconButton, Typography, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles(theme => ({
  amountControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    border: '1px solid #eee',
    borderRadius: theme.shape.borderRadius,
    marginRight: 10,
    height: 40,
  },
  amount: {
    textAlign: 'center',
  },
  buttonAmount: {
    minWidth: 50,
  },
}));

interface BoardProductAmountControlProps {
  amount: number;
}

const BoardProductAmountControl: React.FC<BoardProductAmountControlProps> = ({ amount }) => {
  const classes = useStyles();

  return (
    <div className={classes.amountControl}>
      <IconButton disabled className={classes.buttonAmount}>
        <RemoveIcon color="primary" />
      </IconButton>
      <div className={classes.amount}>
        <Typography variant="h6">{amount}</Typography>
      </div>
      <IconButton disabled className={classes.buttonAmount}>
        <AddIcon color="primary" />
      </IconButton>
    </div>
  );
};

export default BoardProductAmountControl;
