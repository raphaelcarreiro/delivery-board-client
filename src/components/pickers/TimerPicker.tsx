import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, TimePicker, TimePickerProps } from '@material-ui/pickers';

interface CustomTimerPickerProps extends TimePickerProps {
  hideBackdrop: boolean;
}

const CustomTimerPicker: React.FC<CustomTimerPickerProps> = ({ hideBackdrop = false, ...rest }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbr}>
      <TimePicker
        {...rest}
        required
        clearable
        clearLabel="Limpar"
        cancelLabel="Cancelar"
        margin="normal"
        ampm={false}
        fullWidth
        autoComplete="off"
        invalidDateMessage={'Hora inválida'}
        DialogProps={{
          hideBackdrop,
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default CustomTimerPicker;
