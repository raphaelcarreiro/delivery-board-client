import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import DialogInput, { DialogInputConsumer } from 'src/components/dialog/DialogInput';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { setSchedule } from 'src/store/redux/modules/order/actions';
import { isBefore, addMinutes, format } from 'date-fns';
import CustomTimerPicker from 'src/components/pickers/TimerPicker';
import { ptBR } from 'date-fns/locale';

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
  const [hasSchedule, setHasSchedule] = useState(false);
  const dispatch = useDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [scheduledAt, setScheduledAt] = useState(addMinutes(currentTime, restaurant.configs.delivery_time));
  const classes = useStyles();

  useEffect(() => {
    setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
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
              <div className={classes.container}>
                <Typography variant="h6">Agendar a retirada?</Typography>
                <div className={classes.actions}>
                  <Button onClick={handleScheduleYes} variant="contained" color="primary">
                    Sim
                  </Button>
                  <Button
                    onClick={() => {
                      handleScheduleNo();
                      handleCloseDialog();
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Não
                  </Button>
                </div>
              </div>
            ) : (
              <div className={classes.container}>
                <form onSubmit={event => handleSubmit(event, handleCloseDialog)} className={classes.form}>
                  <Typography>Escolha a hora em que deseja retirar seu pedido</Typography>
                  <CustomTimerPicker
                    value={scheduledAt}
                    handleChange={date => setScheduledAt(date)}
                    label="Horário da retirada"
                    helperText={`Agende um horário para depois das ${format(
                      addMinutes(currentTime, restaurant.configs.delivery_time),
                      'HH:mm:ss',
                      {
                        locale: ptBR,
                      }
                    )}`}
                  />
                  <Button
                    type="submit"
                    disabled={!dateTest(scheduledAt)}
                    className={classes.btnConfirm}
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Confirmar
                  </Button>
                </form>
              </div>
            )}
          </>
        )}
      </DialogInputConsumer>
    </DialogInput>
  );
}
