import fs from "fs/promises";
import path from "path";
import type { Comment } from "./types";
import crypto from "crypto";

const COMMENTS_DIR = path.join(process.cwd(), "data", "comments");

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

function getCommentFilePath(slug: string): string {
  return path.join(COMMENTS_DIR, `${slug}.json`);
}

export async function getComments(slug: string): Promise<Comment[]> {
  await ensureDir(COMMENTS_DIR);
  const filePath = getCommentFilePath(slug);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Comment[];
  } catch {
    return [];
  }
}

export interface AddCommentData {
  author: string;
  content: string;
}

export async function addComment(
  slug: string,
  data: AddCommentData
): Promise<Comment> {
  await ensureDir(COMMENTS_DIR);
  const filePath = getCommentFilePath(slug);

  const comments = await getComments(slug);

  const comment: Comment = {
    id: crypto.randomUUID(),
    postSlug: slug,
    author: sanitize(data.author),
    content: sanitize(data.content),
    date: new Date().toISOString(),
  };

  comments.push(comment);
  await fs.writeFile(filePath, JSON.stringify(comments, null, 2), "utf-8");

  return comment;
}

export async function deleteComments(slug: string): Promise<void> {
  const filePath = getCommentFilePath(slug);

  try {
    await fs.unlink(filePath);
  } catch {
    // ignore if file doesn't exist
  }
}

/** Remove HTML tags to prevent XSS */
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
