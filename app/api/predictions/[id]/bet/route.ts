import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/api-service';
import ApiResponse from '@/lib/ApiResponse';
import { createBet, getPredictionById } from '@/lib/db/queries';
import { Bet } from '@/lib/db/schema';

// POST /api/predictions/[id]/bet - Create a new bet
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id: predictionId } = await params;
    const { side } = await req.json();

    if (!predictionId || !side) {
      return NextResponse.json({ error: 'Prediction ID and side are required' }, { status: 400 });
    }

    const prediction = await getPredictionById(predictionId);
    if (!prediction) {
      return NextResponse.json({ error: 'Prediction not found' }, { status: 404 });
    }

    let bet: Bet;
    try {
      bet = await createBet(predictionId, side, auth.user.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bet';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(new ApiResponse(201, true, bet, 'Bet created successfully'));
  } catch (error) {
    console.error('Failed to submit bet:', error);
    const message = error instanceof Error ? error.message : 'Failed to submit bet';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
