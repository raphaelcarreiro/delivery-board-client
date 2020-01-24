import React from 'react';
import MaskedInput from 'react-text-mask';
import PropTypes from 'prop-types';

export default function CardExpirationDate({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[/\d/, /\d/, '/', /\d/, /\d/]}
      placeholderChar={'\u2000'}
      showMask={false}
    />
  );
}

CardExpirationDate.propTypes = {
  inputRef: PropTypes.func.isRequired,
};
