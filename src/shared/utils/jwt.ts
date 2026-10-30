import jwt, { type JwtPayload } from 'jsonwebtoken';
import { env } from '../../config/env.js';

const JWT_ALGORITHM = 'HS256';

const ACCESS_TOKEN_TTL = 15 * 60; // 15 minutes
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days

interface AccessTokenPayload extends JwtPayload {
  userId: number;
  tokenType: 'access';
}

interface RefreshTokenPayload extends JwtPayload {
  userId: number;
  sessionId: string;
  tokenType: 'refresh';
}

/**
 * Generate a short-lived access token.
 */
export function generateAccessToken(userId: number): string {
  return jwt.sign(
    {
      userId,
      tokenType: 'access',
    },
    env.ACCESS_TOKEN_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: ACCESS_TOKEN_TTL,
    },
  );
}

/**
 * Generate a refresh token associated with a session.
 */
export function generateRefreshToken(userId: number, sessionId: string): string {
  return jwt.sign(
    {
      userId,
      sessionId,
      tokenType: 'refresh',
    },
    env.REFRESH_TOKEN_SECRET,
    {
      algorithm: JWT_ALGORITHM,
      expiresIn: REFRESH_TOKEN_TTL,
    },
  );
}

/**
 * Verify JWT signature, algorithm and expiration.
 */
function verifyToken(token: string, secret: string): JwtPayload {
  const payload = jwt.verify(token, secret, {
    algorithms: [JWT_ALGORITHM],
  });

  if (typeof payload !== 'object' || payload === null) {
    throw new jwt.JsonWebTokenError('Invalid token payload');
  }

  return payload;
}

/**
 * Verify an access token and validate its payload.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = verifyToken(token, env.ACCESS_TOKEN_SECRET);

  if (
    payload.tokenType !== 'access' ||
    !Number.isSafeInteger(payload.userId) ||
    (payload.userId as number) <= 0 ||
    typeof payload.exp !== 'number'
  ) {
    throw new jwt.JsonWebTokenError('Invalid access token payload');
  }

  return payload as AccessTokenPayload;
}

/**
 * Verify a refresh token and validate its payload.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = verifyToken(token, env.REFRESH_TOKEN_SECRET);

  if (
    payload.tokenType !== 'refresh' ||
    !Number.isSafeInteger(payload.userId) ||
    (payload.userId as number) <= 0 ||
    typeof payload.sessionId !== 'string' ||
    payload.sessionId.length === 0 ||
    typeof payload.exp !== 'number'
  ) {
    throw new jwt.JsonWebTokenError('Invalid refresh token payload');
  }

  return payload as RefreshTokenPayload;
}
