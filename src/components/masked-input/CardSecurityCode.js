import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

export default function CardSecurityCode({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask={false}
    />
  );
}

CardSecurityCode.propTypes = {
  inputRef: PropTypes.func.isRequired,
};
