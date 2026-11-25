"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { Category, CreateUpdateCategory } from "@/lib/types/category";

export default function EditCategoryForm({ id }: { id: string }) {
  const categoryUrl = `/api/categories/${encodeURIComponent(id)}`;
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCategory() {
      try {
        const response = await fetch(categoryUrl);
        if (response.status === 404) {
          setError("Категория не найдена.");
          return;
        }
        if (!response.ok) throw new Error();

        const { category }: { category: Category } = await response.json();
        setName(category.name);
      } catch {
        setError("Не удалось загрузить категорию.");
      }
    }

    loadCategory();
  }, [categoryUrl]);

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name?.trim();
    if (!trimmedName || saving) return;

    setSaving(true);
    setError("");

    try {
      const body: CreateUpdateCategory = { name: trimmedName };
      const response = await fetch(categoryUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        window.location.replace("/admin/categories");
        return;
      }

      if (response.status === 403) {
        setError("Нет доступа. Войдите как администратор.");
      } else if (response.status === 404) {
        setError("Категория не найдена.");
      } else {
        setError("Не удалось сохранить категорию.");
      }
    } catch {
      setError("Не удалось сохранить категорию.");
    }

    setSaving(false);
  }

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Изменить категорию</h1>
      <p>ID категории: {id}</p>

      {error && <p role="alert">{error}</p>}
      {name === null && !error && <output>Загрузка категории…</output>}
      {name !== null && (
        <form className="max-w-sm space-y-4" onSubmit={saveCategory}>
          <label className="flex flex-col gap-1">
            Название
            <input
              className="rounded border border-current/30 px-2 py-1.5"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={saving}
              required
            />
          </label>
          <button
            className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
            type="submit"
            disabled={saving || !name.trim()}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </form>
      )}
      <Link className="inline-block underline" href="/admin/categories">
        Вернуться к списку
      </Link>
    </section>
  );
}
