/**
 * Format number pattern pt-BR
 * @param value
 * @param maximumFractionDigits
 * @returns {string}
 */
function numberFormat(value, maximumFractionDigits = 2) {
  if (typeof value === 'string' && value !== '') value = parseFloat(value);

  value = value === '' ? 0 : value;

  return value.toLocaleString('pt-BR', {
    maximumFractionDigits: maximumFractionDigits,
  });
}

/**
 * Format currency pattern pt-BR
 * @param value
 * @param maximumFractionDigits
 * @returns {string}
 */
function moneyFormat(value, maximumFractionDigits = 2) {
  if (typeof value === 'string' && value !== '') value = parseFloat(value);

  value = !value ? 0 : value;

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: maximumFractionDigits,
  });
}

/**
 * Format percent number pattern pt-BR
 * @param value
 * @param maximumFractionDigits
 * @returns {string}
 */
function percentFormat(value, maximumFractionDigits = 2) {
  if (typeof value === 'string') value = parseFloat(value);

  value = value === '' ? 0 : value;

  return (
    value.toLocaleString('pt-BR', {
      maximumFractionDigits: maximumFractionDigits,
    }) + '%'
  );
}

export { moneyFormat, numberFormat, percentFormat };
