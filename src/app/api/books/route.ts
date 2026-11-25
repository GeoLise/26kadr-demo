import { sql } from "@/db";
import { auth } from "@/lib/auth";
import type { Book, CreateUpdateBook } from "@/lib/types/book";

export async function GET() {
  const books: Book[] = await sql`
    SELECT id, name, category_id FROM books ORDER BY id
  `;
  return Response.json({ books });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (session?.user.role !== "ADMIN") {
    return Response.json({ error: "Нет доступа" }, { status: 403 });
  }

  try {
    const { name, category_id }: CreateUpdateBook = await request.json();
    if (!name.trim() || !Number.isInteger(category_id)) {
      return Response.json(
        { error: "Укажите название и категорию" },
        { status: 400 },
      );
    }
    const result = await sql`
      INSERT INTO books (name, category_id)
      SELECT ${name.trim()}, id FROM categories WHERE id = ${category_id}
    `;
    if (result.count === 0) {
      return Response.json({ error: "Категория не найдена" }, { status: 400 });
    }
    return new Response(null, { status: 201 });
  } catch {
    return Response.json(
      { error: "Не удалось добавить книгу" },
      { status: 400 },
    );
  }
}
