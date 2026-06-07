export interface PostFrontmatter {
  title: string;
  date: string;
  excerpt?: string;
  tags?: string[];
  slug?: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

export interface PostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export interface Comment {
  id: string;
  postSlug: string;
  author: string;
  content: string;
  date: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
