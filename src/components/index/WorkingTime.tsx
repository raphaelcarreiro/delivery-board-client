import React from 'react';
import StatusIcon from '@material-ui/icons/FiberManualRecord';
import { makeStyles, Typography } from '@material-ui/core';
import { Restaurant } from 'src/types/restaurant';

const useStyles = makeStyles({
  working: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0',
  },
  restaurantStatus: ({ restaurantIsOpen }: { restaurantIsOpen: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0 5px',
    borderRadius: 4,
    '& svg': {
      color: restaurantIsOpen ? '#28a745' : '#dc3545',
      marginRight: 5,
    },
    '& p': {
      fontWeight: 600,
    },
  }),
});

type WorkingTimeProps = {
  restaurant: Restaurant;
};

const WorkingTime: React.FC<WorkingTimeProps> = ({ restaurant }) => {
  const classes = useStyles({ restaurantIsOpen: restaurant ? restaurant.is_open : false });

  return (
    <>
      {restaurant && (
        <div className={classes.working}>
          <div className={classes.restaurantStatus}>
            <StatusIcon />
            <Typography>{restaurant.is_open ? 'aberto' : 'fechado'}</Typography>
          </div>
          <Typography color="textSecondary" align="center" variant="body1">
            {restaurant.working_hours}
          </Typography>
        </div>
      )}
    </>
  );
};

export default WorkingTime;
