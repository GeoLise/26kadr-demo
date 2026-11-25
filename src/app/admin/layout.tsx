import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <Suspense fallback={null}>
      <AdminContent>{children}</AdminContent>
    </Suspense>
  );
}

async function AdminContent({
  children,
}: Pick<LayoutProps<"/admin">, "children">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen md:flex">
      <div className="bg-zinc-400 p-6 text-black md:shrink-0">
        <p className="mb-10 text-black text-3xl">Это админка</p>
        <Link href={"/admin/categories"}>Категории</Link>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
