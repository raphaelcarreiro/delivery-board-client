export function isFacebookNavigator(): boolean {
  const ua = navigator.userAgent || navigator.vendor;
  return ua.includes('Instagram');
}
