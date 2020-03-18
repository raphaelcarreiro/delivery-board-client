import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

const MyDatePicker = props => {
  const { handleDateChange, value, label, name, required, autoOk, fullWidth, error, helperText } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbr}>
      <KeyboardDatePicker
        required={required || false}
        clearable
        clearLabel="Limpar"
        cancelLabel="Cancelar"
        label={label}
        value={value}
        name={name}
        placeholder="Ex.: 01/01/2020"
        onChange={date => handleDateChange(date)}
        format="dd/MM/yyyy"
        fullWidth={fullWidth}
        margin="normal"
        invalidDateMessage="Data inválida"
        autoOk={autoOk}
        error={error}
        helperText={helperText}
      />
    </MuiPickersUtilsProvider>
  );
};

MyDatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  autoOk: PropTypes.bool,
  fullWidth: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

MyDatePicker.defaultProps = {
  required: false,
  autoOk: false,
  fullWidth: true,
  error: false,
  helperText: '',
};

export default MyDatePicker;
