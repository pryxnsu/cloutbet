import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createFeedback, getAllFeedback } from '@/lib/db/queries';
import authOptions from '../auth/[...nextauth]/options';

export async function GET() {
  try {
    const data = await getAllFeedback();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error] GET /api/feedback', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
    }

    const data = await createFeedback(session.user.id, content);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API Error] POST /api/feedback', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
