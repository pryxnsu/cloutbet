import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

type AuthResult = 
  | { success: true; user: { id: string; name: string; username: string; avatar: string } }
  | { success: false; response: NextResponse };

/**
 * Authenticate request using JWT token
 */
export async function authenticateRequest(req: NextRequest): Promise<AuthResult> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return {
      success: false,
      response: NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(req.url)}`, req.url)
      ),
    };
  }

  return {
    success: true,
    user: {
      id: token.id as string,
      name: token.name as string,
      username: token.username as string,
      avatar: token.avatar as string,
    },
  };
}

/**
 * Parse and validate pagination params
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);

  const errors: string[] = [];
  
  if (isNaN(page) || page < 1) {
    errors.push('Invalid page parameter');
  }
  
  if (isNaN(limit) || limit < 1 || limit > 100) {
    errors.push('Invalid limit parameter (must be 1-100)');
  }

  return {
    page,
    limit,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate expiry date from duration string
 */
const DURATION_MAP: Record<string, number> = {
  '1h': 1 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '12h': 12 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
};

export function getExpiry(duration: string): Date {
  const ms = DURATION_MAP[duration] ?? DURATION_MAP['24h'];
  return new Date(Date.now() + ms);
}
