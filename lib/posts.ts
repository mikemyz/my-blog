import fs from "fs/promises";
import path from "path";
import matter from "@11ty/gray-matter";
import type { Post, PostSummary, PaginatedResult } from "./types";
import { generateSlug } from "./slug";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

/** Normalize a frontmatter value that might be a Date object to an ISO date string */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

/** Normalize tags to always be a string array */
function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((t) => String(t));
  }
  if (typeof value === "string") {
    return value.split(",").map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

export async function getAllPosts(): Promise<PostSummary[]> {
  await ensureDir(POSTS_DIR);
  const files = await fs.readdir(POSTS_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));

  const posts: PostSummary[] = [];

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(filePath, "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.md$/, "");

    posts.push({
      slug,
      title: String(data.title || slug),
      date: normalizeDate(data.date),
      excerpt: String(data.excerpt || ""),
      tags: normalizeTags(data.tags),
    });
  }

  // Sort by date descending
  posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return posts;
}

export async function getPaginatedPosts(
  page: number,
  pageSize: number
): Promise<PaginatedResult<PostSummary>> {
  const all = await getAllPosts();
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = all.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureDir(POSTS_DIR);
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = matter(raw);

    return {
      slug,
      title: String(data.title || slug),
      date: normalizeDate(data.date),
      excerpt: String(data.excerpt || ""),
      tags: normalizeTags(data.tags),
      content,
    };
  } catch {
    return null;
  }
}

export interface CreatePostData {
  title: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  content: string;
}

export async function createPost(data: CreatePostData): Promise<Post> {
  await ensureDir(POSTS_DIR);
  const slug = data.slug || generateSlug(data.title);

  if (!slug) {
    throw new Error("Slug cannot be empty");
  }

  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  // Check if already exists
  try {
    await fs.access(filePath);
    throw new Error(`Post with slug "${slug}" already exists`);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
  }

  const frontmatter: Record<string, unknown> = {
    title: data.title,
    date: new Date().toISOString().split("T")[0],
    excerpt: data.excerpt || "",
    tags: data.tags || [],
  };

  const fileContent = matter.stringify(data.content, frontmatter);
  await fs.writeFile(filePath, fileContent, "utf-8");

  return {
    slug,
    title: data.title,
    date: frontmatter.date as string,
    excerpt: frontmatter.excerpt as string,
    tags: frontmatter.tags as string[],
    content: data.content,
  };
}

export interface UpdatePostData {
  title?: string;
  excerpt?: string;
  tags?: string[];
  content?: string;
}

export async function updatePost(
  slug: string,
  data: UpdatePostData
): Promise<Post> {
  await ensureDir(POSTS_DIR);
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  const existing = await getPostBySlug(slug);
  if (!existing) {
    throw new Error(`Post with slug "${slug}" not found`);
  }

  const frontmatter: Record<string, unknown> = {
    title: data.title ?? existing.title,
    date: existing.date,
    excerpt: data.excerpt ?? existing.excerpt,
    tags: data.tags ?? existing.tags,
  };

  const content = data.content ?? existing.content;
  const fileContent = matter.stringify(content, frontmatter);
  await fs.writeFile(filePath, fileContent, "utf-8");

  return {
    slug,
    title: frontmatter.title as string,
    date: frontmatter.date as string,
    excerpt: frontmatter.excerpt as string,
    tags: frontmatter.tags as string[],
    content,
  };
}

export async function deletePost(slug: string): Promise<boolean> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);

  try {
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}
