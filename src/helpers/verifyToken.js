import jwt from 'jsonwebtoken';

export function verifyToken(withData = false) {
  let payload;
  const token = localStorage.getItem(process.env.localStorageTokenName);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET, {
        ignoreNotBefore: true,
      });

      payload = {
        name: decoded.name,
        id: decoded.sub,
        email: decoded.email,
      };
    } catch (e) {
      console.log(e);
    }
  }

  return payload;
}
