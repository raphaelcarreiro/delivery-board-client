import { verifyToken } from '../helpers/verifyToken';

export function isAuthenticated() {
  const payload = verifyToken();
  return !!payload;
}
