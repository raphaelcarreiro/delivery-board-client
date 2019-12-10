export function userChange(index, value) {
  return {
    type: 'CHANGE',
    index,
    value,
  };
}
