import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRY = '7d';

export async function signToken(payload: object) {
  const alg = 'HS256';
  const secret = new TextEncoder().encode(JWT_SECRET);

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

export default { signToken, verifyToken };
