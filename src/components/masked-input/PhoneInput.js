import React from 'react';
import MaskedInput from 'react-text-mask';

const mask = function(rawValue) {
  const value = rawValue.replace(/\D/g, '');

  if (value.length <= 10) return [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  else return [/\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
};

export default function PhoneInput({ inputRef, ...other }) {
  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={mask}
      placeholderChar={'\u2000'}
      showMask={false}
    />
  );
}
