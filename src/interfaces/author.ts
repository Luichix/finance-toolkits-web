export interface Author {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: DataAuthor;
}

export interface DataAuthor {
  title: string;
  image: string;
  description: string;
  social: Record<string, string>;
}
