import { type NextRequest } from "next/server";
import { getPaginatedPosts, createPost } from "@/lib/posts";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

    const result = await getPaginatedPosts(page, pageSize);
    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, tags, content } = body;

    if (!title || !content) {
      return Response.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const post = await createPost({
      title,
      slug: slug || undefined,
      excerpt: excerpt || "",
      tags: Array.isArray(tags) ? tags : [],
      content,
    });

    return Response.json(post, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
