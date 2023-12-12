export interface Template {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: DataPost;
}

export interface DataTemplate {
  title: string;
  meta_title: string;
  description: string;
  date: Date;
  image: string;
  authors: string[];
  categories: string[];
  similar_templates: string[];
  draft: boolean;
}
