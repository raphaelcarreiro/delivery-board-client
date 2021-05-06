import { Button, makeStyles, Typography } from '@material-ui/core';
import { addMinutes, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { Dispatch, FormEvent, SetStateAction } from 'react';
import { useDialogInput } from 'src/components/dialog/DialogInput';
import CustomDatePicker from 'src/components/pickers/DatePicker';
import CustomTimerPicker from 'src/components/pickers/TimerPicker';
import { useSelector } from 'src/store/redux/selector';

const useStyles = makeStyles(theme => ({
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  btnConfirm: {
    marginTop: 30,
  },
}));

interface ShipmentCollectSchedulingProps {
  handleSubmit(event: FormEvent<HTMLFormElement>, handleCloseDialog: () => void): void;
  scheduledAt: Date | null;
  setScheduledAt: Dispatch<SetStateAction<Date | null>>;
  dateTest(date: Date | null): boolean;
  currentTime: Date;
}

const ShipmentCollectScheduling: React.FC<ShipmentCollectSchedulingProps> = ({
  handleSubmit,
  scheduledAt,
  setScheduledAt,
  dateTest,
  currentTime,
}) => {
  const classes = useStyles();
  const { handleCloseDialog } = useDialogInput();
  const restaurant = useSelector(state => state.restaurant);

  return (
    <div className={classes.container}>
      <form onSubmit={event => handleSubmit(event, handleCloseDialog)} className={classes.form}>
        <Typography>Escolha a hora em que deseja retirar seu pedido</Typography>
        {restaurant?.configs.shipment_date_schedule ? (
          <CustomDatePicker
            value={scheduledAt}
            onChange={date => setScheduledAt(date)}
            label="Data e hora da retirada"
            hideBackdrop
            autoOk
            autoFocus
          />
        ) : (
          <CustomTimerPicker
            value={scheduledAt}
            onChange={date => setScheduledAt(date)}
            label="Horário da retirada"
            hideBackdrop
            autoOk
            helperText={`Agende um horário para depois das ${format(
              addMinutes(currentTime, restaurant?.configs.delivery_time || 0),
              'HH:mm:ss',
              {
                locale: ptBR,
              }
            )}`}
          />
        )}
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
  );
};

export default ShipmentCollectScheduling;
