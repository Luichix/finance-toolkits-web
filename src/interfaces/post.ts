export interface Post {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: DataPost;
}

export interface DataPost {
  title: string;
  meta_title: string;
  description: string;
  date: Date;
  image: string;
  authors: string[];
  categories: string[];
  tags: string[];
  similar_posts: string[];
  draft: boolean;
}
