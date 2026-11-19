import { sql } from "@/db";
import { Category, CreateUpdateCategory } from "@/lib/types/category";

export async function GET() {
  const categories: Category[] = await sql`
        SELECT * FROM categories
        ORDER BY id;
    `;

  return Response.json({ categories });
}

export async function POST(request: Request) {
  try {
    const body: CreateUpdateCategory = await request.json();

    await sql`
        INSERT INTO categories (name)
        VALUES (${body.name})
    `;
  } catch {
    return Response.json("", {
      status: 400,
    });
  }

  return Response.json("", {
    status: 201,
  });
}
