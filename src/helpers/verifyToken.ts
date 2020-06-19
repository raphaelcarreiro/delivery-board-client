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
  let payload: Payload | null;
  const token = localStorage.getItem(process.env.TOKEN_NAME);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET, {
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
