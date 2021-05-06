import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, DateTimePickerProps, DateTimePicker } from '@material-ui/pickers';

interface CustomDatePickerProps extends DateTimePickerProps {
  hideBackdrop: boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ hideBackdrop, ...rest }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbr}>
      <DateTimePicker
        {...rest}
        clearable
        clearLabel="Limpar"
        cancelLabel="Cancelar"
        placeholder="Ex.: 01/01/2020"
        format="dd/MM/yyyy HH:mm"
        margin="normal"
        invalidDateMessage="Data inválida"
        autoOk
        DialogProps={{ hideBackdrop }}
        ampm={false}
      />
    </MuiPickersUtilsProvider>
  );
};

export default CustomDatePicker;
