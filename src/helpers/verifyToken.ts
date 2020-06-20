import jwt from 'jsonwebtoken';

interface Payload {
  name: string;
  id: number;
  email: string;
  image: {
    imageUrl: string;
  } | null;
}

export function verifyToken(): Payload | null {
  let payload: Payload | null = null;
  const tokenName = process.env.TOKEN_NAME || '';
  const secret = process.env.SECRET || '';
  const token = localStorage.getItem(tokenName);

  if (token) {
    try {
      const decoded: any = jwt.verify(token, secret, {
        ignoreNotBefore: true,
      });

      if (decoded)
        payload = {
          name: decoded.name,
          id: decoded.sub,
          email: decoded.email,
          image: decoded.imageUrl
            ? {
                imageUrl: decoded.imageUrl,
              }
            : null,
        };
    } catch (e) {
      console.log(e);
    }
  }

  return payload;
}
