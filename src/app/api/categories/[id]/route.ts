import { sql } from "@/db";
import { Category, CreateUpdateCategory } from "@/lib/types/category";

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/categories/[id]">,
) {
  const params = await ctx.params;

  try {
    const body: CreateUpdateCategory = await request.json();

    await sql`
        UPDATE categories SET name = ${body.name}
        WHERE id = ${params.id};
    `;
  } catch {
    return Response.json("", {
      status: 400,
    });
  }

  return Response.json("", {
    status: 200,
  });
}

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/categories/[id]">,
) {
  const params = await ctx.params;

  const categories: Category[] = await sql`
        SELECT * FROM categories
        WHERE id = ${params.id};
    `;

  if (!categories.length) {
    return Response.json("Not found", {
      status: 404,
    });
  }

  return Response.json({
    category: categories[0],
  });
}
