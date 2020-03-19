import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

CustomTimerPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default function CustomTimerPicker({ handleChange, value, label, helperText }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbr}>
      <TimePicker
        required
        clearable
        clearLabel="Limpar"
        cancelLabel="Cancelar"
        margin="normal"
        label={label}
        value={value}
        ampm={false}
        fullWidth
        autoComplete="off"
        invalidDateMessage={'Hora inválida'}
        onChange={handleChange}
        helperText={helperText}
      />
    </MuiPickersUtilsProvider>
  );
}
