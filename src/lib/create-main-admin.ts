import { sql } from "@/db";
import { auth } from "./auth";

export async function createMainAdmin() {
  const email = process.env.MAIN_ADMIN_EMAIL;
  const password = process.env.MAIN_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Не переданы данные");
    return;
  }

  const [existedAdmin] = await sql`
    SELECT * FROM "user"
    WHERE email = ${email};
  `;

  if (existedAdmin && existedAdmin.role === "USER") {
    await sql`
        UPDATE "user" SET role = 'ADMIN'
        WHERE email = ${email}
    `;
    return;
  }

  await auth.api.signUpEmail({
    body: {
      email: email,
      password: password,
      name: "Admin",
    },
  });

  await sql`
        UPDATE "user" SET role = 'ADMIN'
        WHERE email = ${email}
    `;

  console.log("Админ успешно добавлен");
}

await createMainAdmin();
