import type { IncomingMessage } from 'node:http';
import { SESSION_COOKIE_NAME } from './cookie.config';

export interface AuthUser {
  userId: string;
  roles: string[];
}

export function parseCookies(
  cookieHeader: string | undefined,
): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      return [key, rest.join('=')];
    }),
  );
}

export function getSessionId(
  req: IncomingMessage & { cookies?: Record<string, string> },
): string | undefined {
  if (req.cookies?.[SESSION_COOKIE_NAME]) {
    return req.cookies[SESSION_COOKIE_NAME];
  }
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME];
}

export function hasRole(user: AuthUser, role: string): boolean {
  return user.roles.includes(role);
}
