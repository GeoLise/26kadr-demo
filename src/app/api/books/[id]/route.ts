import { sql } from "@/db";
import { auth } from "@/lib/auth";
import type { Book, CreateUpdateBook } from "@/lib/types/book";

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/books/[id]">,
) {
  const { id } = await params;
  const [book]: Book[] = await sql`
    SELECT id, name, category_id FROM books WHERE id = ${id}
  `;
  if (!book) {
    return Response.json({ error: "Книга не найдена" }, { status: 404 });
  }
  return Response.json({ book });
}

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/books/[id]">,
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user.role !== "ADMIN") {
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const { name, category_id }: CreateUpdateBook = await request.json();
    if (!name.trim() || !Number.isInteger(category_id)) {
      return Response.json(
        { error: "Укажите название и категорию" },
        { status: 400 },
      );
    }
    const [category] =
      await sql`SELECT id FROM categories WHERE id = ${category_id}`;
    if (!category) {
      return Response.json({ error: "Категория не найдена" }, { status: 400 });
    }
    const result = await sql`
      UPDATE books SET name = ${name.trim()}, category_id = ${category_id} WHERE id = ${id}
    `;
    if (result.count === 0) {
      return Response.json({ error: "Книга не найдена" }, { status: 404 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: "Не удалось сохранить книгу" },
      { status: 400 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/books/[id]">,
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user.role !== "ADMIN") {
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  }

  const { id } = await params;
  try {
    await sql`DELETE FROM books WHERE id = ${id}`;
    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: "Не удалось удалить книгу" },
      { status: 400 },
    );
  }
}
