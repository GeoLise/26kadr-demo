import { sql } from "@/db";
import { auth } from "@/lib/auth";
import type { Category, CreateUpdateCategory } from "@/lib/types/category";

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/categories/[id]">,
) {
  const params = await ctx.params;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || session.user.role !== "ADMIN") {
    return Response.json(
      {
        error: "Нет доступа",
      },
      {
        status: 403,
      },
    );
  }

  try {
    const body: CreateUpdateCategory = await request.json();

    const result = await sql`
        UPDATE categories SET name = ${body.name}
        WHERE id = ${params.id};
    `;
    if (result.count === 0) {
      return Response.json({ error: "Категория не найдена" }, { status: 404 });
    }
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
  _request: Request,
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

export async function DELETE(
  request: Request,
  ctx: RouteContext<"/api/categories/[id]">,
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "ADMIN") {
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await ctx.params;
  try {
    await sql`DELETE FROM categories WHERE id = ${id}`;
  } catch {
    return Response.json(
      { error: "Не удалось удалить категорию" },
      { status: 400 },
    );
  }

  return new Response(null, { status: 204 });
}
