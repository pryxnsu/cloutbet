import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api-service';
import ApiResponse from '@/lib/ApiResponse';
import { getUserBids } from '@/lib/db/queries';

// GET /api/activities : Get recent activities of current user
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id: userId } = auth.user;

    const activities = await getUserBids(userId);

    return NextResponse.json(new ApiResponse(200, true, activities));
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
