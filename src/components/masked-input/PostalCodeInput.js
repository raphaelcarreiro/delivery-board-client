import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

export default function PostalCodeInput({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask={false}
    />
  );
}

PostalCodeInput.propTypes = {
  inputRef: PropTypes.func.isRequired,
};
