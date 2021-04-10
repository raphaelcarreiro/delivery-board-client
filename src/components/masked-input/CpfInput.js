import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

export default function CpfInput({ inputRef, ...other }) {
  return (
    <MaskedInput
      inputMode="numeric"
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask={false}
    />
  );
}

CpfInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
};
