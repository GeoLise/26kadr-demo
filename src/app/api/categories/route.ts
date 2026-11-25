import { sql } from "@/db";
import { auth } from "@/lib/auth";
import { Category, CreateUpdateCategory } from "@/lib/types/category";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  console.log(session?.user);

  const categories: Category[] = await sql`
        SELECT * FROM categories
        ORDER BY id;
    `;

  return Response.json({ categories });
}

export async function POST(request: Request) {
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
