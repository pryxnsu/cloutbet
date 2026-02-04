export function extractTweetId(url: string): string {
  const match = url.match(/status\/(\d+)/);
  return match?.[1] ?? '';
}

export function betsToMap(bets: { predictionId: string; side: 'in' | 'out' }[]): Map<string, 'in' | 'out'> {
  const map = new Map<string, 'in' | 'out'>();
  for (const bet of bets) {
    map.set(bet.predictionId, bet.side);
  }
  return map;
}