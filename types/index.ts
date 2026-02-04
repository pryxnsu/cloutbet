export interface PredictionProp {
  id: string;
  title: string;
  url: string;
  name: string;
  username: string;
  avatar: string;
  postId: string;
  expiry: string;
  participants: number;
  createdAt: string;
  userBetSide: 'in' | 'out' | null;
}

export interface PredictionCardProps extends PredictionProp {
  onBet: (id: string, side: 'in' | 'out') => void;
}
