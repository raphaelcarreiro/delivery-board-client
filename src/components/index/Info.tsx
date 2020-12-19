import { makeStyles, Typography } from '@material-ui/core';
import { Schedule } from '@material-ui/icons';
import React from 'react';
import { Restaurant } from 'src/types/restaurant';

const useStyles = makeStyles(theme => ({
  info: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    '&>h5': {
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
        fontSize: 20,
      },
    },
  },
  deliveryTime: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& svg': {
      marginRight: 7,
    },
  },
  infoItem: {
    fontWeight: 300,
  },
}));

type InfoProps = {
  restaurant: Restaurant;
};

const Info: React.FC<InfoProps> = ({ restaurant }) => {
  const classes = useStyles();

  return (
    <div className={classes.info}>
      {restaurant.configs.delivery_time > 0 && (
        <div className={classes.deliveryTime}>
          <Schedule />
          <Typography variant="h6" className={classes.infoItem}>
            {restaurant.configs.delivery_time} minutos
          </Typography>
        </div>
      )}
      {restaurant.configs.order_minimum_value > 0 && restaurant.configs.tax_mode !== 'order_value' && (
        <Typography variant="h6" className={classes.infoItem}>
          {restaurant.configs.formattedOrderMinimumValue} mínimo
        </Typography>
      )}
    </div>
  );
};

export default Info;
