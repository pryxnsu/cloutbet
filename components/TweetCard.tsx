import { Tweet } from 'react-tweet';

export default function TweetCard({ tweetId }: { tweetId: string }) {
  return (
    <div className="overflow-hidden rounded-xl" data-theme="light">
      <Tweet id={tweetId} />
    </div>
  );
}
