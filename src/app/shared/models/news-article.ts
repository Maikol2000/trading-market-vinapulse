export interface NewsArticle {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  author: string;
  body: string;
  keywords: string;
  likes: number;
  score: number;
  status: string;
  createdBy: number;
  updatedBy: number;
  tags: string[];
}
