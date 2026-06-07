import { type NextRequest } from "next/server";
import { getComments, addComment } from "@/lib/comments";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return Response.json(
        { error: "slug query parameter is required" },
        { status: 400 }
      );
    }

    const comments = await getComments(slug);
    return Response.json(comments);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, author, content } = body;

    if (!slug || !author || !content) {
      return Response.json(
        { error: "slug, author, and content are required" },
        { status: 400 }
      );
    }

    const comment = await addComment(slug, { author, content });
    return Response.json(comment, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
