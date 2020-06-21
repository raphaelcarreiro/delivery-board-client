import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  img: {
    width: 25,
  },
});

const PicPayIcon: React.FC = () => {
  const classes = useStyles();
  return <img src="/images/picpay_icon.png" alt="PicPay Logo" className={classes.img} />;
};

export default PicPayIcon;
