export function initialize() {
  if (process.env.NODE_ENV === 'development' && process.browser) {
    return require('./ReactotronConfig');
  }
}
