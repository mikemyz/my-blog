import {
  getPostBySlug,
  updatePost,
  deletePost,
} from "@/lib/posts";
import { deleteComments } from "@/lib/comments";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, excerpt, tags, content } = body;

    const post = await updatePost(slug, {
      title,
      excerpt,
      tags: Array.isArray(tags) ? tags : undefined,
      content,
    });

    return Response.json(post);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      return Response.json({ error: error.message }, { status: 404 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Delete post and its comments
    await Promise.all([deletePost(slug), deleteComments(slug)]);

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
