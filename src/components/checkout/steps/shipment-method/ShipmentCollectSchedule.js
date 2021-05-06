import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { setSchedule } from 'src/store/redux/modules/order/actions';
import { isBefore, addMinutes } from 'date-fns';
import ShipmentCollectQuestion from './ShipmentCollectQuestion';
import ShipmentCollectScheduling from './ShipmentCollectScheduling';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 250,
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      height: 200,
    },
  },
  total: {
    fontWeight: 500,
  },
  btnConfirm: {
    marginTop: 30,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
}));

ShipmentCollectSchedule.propTypes = {
  onExited: PropTypes.func.isRequired,
};

export default function ShipmentCollectSchedule({ onExited }) {
  const restaurant = useSelector(state => state.restaurant);
  const order = useSelector(state => state.order);
  const [hasSchedule, setHasSchedule] = useState(false);
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduledAt, setScheduledAt] = useState(
    order.shipment.scheduled_at
      ? order.shipment.scheduled_at
      : addMinutes(currentTime, restaurant.configs.delivery_time + 1)
  );
  const classes = useStyles();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleScheduleYes() {
    setHasSchedule(true);
  }

  function handleScheduleNo() {
    setHasSchedule(false);
    dispatch(setSchedule(null));
  }

  function handleSubmit(event, handleCloseDialog) {
    event.preventDefault();
    dispatch(setSchedule(scheduledAt));
    handleCloseDialog();
  }

  function dateTest(date) {
    return isBefore(addMinutes(new Date(), restaurant.configs.delivery_time), date);
  }

  return (
    <DialogInput onExited={onExited} maxWidth="xs">
      <DialogInputConsumer>
        {({ handleCloseDialog }) => (
          <>
            {!hasSchedule ? (
              <ShipmentCollectQuestion handleScheduleNo={handleScheduleNo} handleScheduleYes={handleScheduleYes} />
            ) : (
              <div className={classes.container}>
                <ShipmentCollectScheduling
                  handleSubmit={handleSubmit}
                  dateTest={dateTest}
                  currentTime={currentTime}
                  scheduledAt={scheduledAt}
                  setScheduledAt={setScheduledAt}
                />
              </div>
            )}
          </>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
