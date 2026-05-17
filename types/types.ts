export type Post = {
  title: string;
  upvotes: number;
}

export type RoundData = {
  round: number;
  subreddit: string;
  postA: Post;
  postB: Post;
}
