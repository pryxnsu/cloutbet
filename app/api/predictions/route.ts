import { NextRequest, NextResponse } from 'next/server';
import { createPrediction, getAllPredictionsPost, getUserBetsForPredictions } from '@/lib/db/queries';
import { extractTweetId, betsToMap } from '@/lib/helper';
import { authenticateRequest, parsePagination, getExpiry } from '@/lib/api-service';
import ApiResponse from '@/lib/ApiResponse';

// POST /api/predictions - Create a new prediction
export async function POST(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id: userId, name, username, avatar } = auth.user;

    const { title, link, duration } = await req.json();

    if (!title?.trim() || !link?.trim() || !duration?.trim()) {
      return NextResponse.json({ error: 'Title, url and expiry are required' }, { status: 400 });
    }

    const prediction = await createPrediction(title, link, userId, getExpiry(duration));

    const result = {
      id: prediction.id,
      title: prediction.title,
      url: prediction.url,
      postId: extractTweetId(prediction.url),
      name,
      username,
      avatar,
      expiry: prediction.expiry,
      participants: 0,
      createdAt: prediction.createdAt,
      userBetSide: null,
    };
    return NextResponse.json(new ApiResponse(201, true, result, 'Prediction created successfully'));
  } catch (error) {
    console.error('Failed to submit prediction:', error);
    return NextResponse.json({ error: 'Failed to submit prediction' }, { status: 500 });
  }
}

// GET /api/predictions - List predictions with pagination
export async function GET(req: NextRequest) {
  try {
    const auth = await authenticateRequest(req);
    if (!auth.success) return auth.response;

    const { id: userId } = auth.user;

    const { searchParams } = new URL(req.url);
    const pagination = parsePagination(searchParams);

    if (!pagination.isValid) {
      return NextResponse.json({ error: pagination.errors.join(', ') }, { status: 400 });
    }

    const offset = (pagination.page - 1) * pagination.limit;
    const predictions = await getAllPredictionsPost(offset, pagination.limit);

    const predictionIds = predictions.map(p => p.id);
    const userBetsRaw = await getUserBetsForPredictions(userId, predictionIds);
    const userBets = betsToMap(userBetsRaw);

    const result = predictions.map(p => ({
      id: p.id,
      title: p.title,
      url: p.url,
      postId: extractTweetId(p.url),
      avatar: p.avatar,
      name: p.name,
      username: p.username,
      expiry: p.expiry,
      participants: p.participants,
      createdAt: p.createdAt,
      userBetSide: userBets.get(p.id) ?? null,
    }));

    return NextResponse.json(new ApiResponse(200, true, result, 'Predictions fetched successfully'));
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}
