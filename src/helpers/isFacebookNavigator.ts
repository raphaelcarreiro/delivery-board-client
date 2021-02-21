export function isFacebookNavigator(): boolean {
  const ua = navigator.userAgent || navigator.vendor;
  console.log(ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1 || ua.indexOf('Instagram') > -1);
  return ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1 || ua.indexOf('Instagram') > -1;
}
