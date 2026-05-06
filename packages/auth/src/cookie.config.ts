export interface CookieOptions {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  domain: string;
  path: string;
  maxAge: number;
}

export const SESSION_COOKIE_NAME = 'sid';

export function getSessionCookieOptions(
  domain?: string,
): CookieOptions {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    domain: domain ?? '.yourdomain.com',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}
