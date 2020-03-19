import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import ptbr from 'date-fns/locale/pt-BR';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';

export default function MobileDatePicker({ handleDateChange, value, label, name, required, autoOk, fullWidth }) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptbr}>
      <DatePicker
        required={required || false}
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
      />
    </MuiPickersUtilsProvider>
  );
}

MobileDatePicker.propTypes = {
  handleDateChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  autoOk: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

MobileDatePicker.defaultProps = {
  required: false,
  autoOk: false,
  fullWidth: true,
  isOpen: false,
  onClose: null,
};
