export interface Article {
  id: string;
  url: string;
  title: string;
  tags: string[];
  date: string;
  summary?: string;
  content: string;
  dev_to?: string;
  twitter?: string;
  draft?: boolean;
  updatedAt?: string;
}
