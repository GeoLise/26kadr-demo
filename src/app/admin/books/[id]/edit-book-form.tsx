"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { Book, CreateUpdateBook } from "@/lib/types/book";
import type { Category } from "@/lib/types/category";

export default function EditBookForm({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        const bookResponse = await fetch(
          `/api/books/${encodeURIComponent(id)}`,
        );
        if (bookResponse.status === 404) {
          setError("Книга не найдена.");
          return;
        }
        if (!bookResponse.ok) throw new Error();
        const { book }: { book: Book } = await bookResponse.json();

        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) throw new Error();
        const data: { categories: Category[] } =
          await categoriesResponse.json();

        setName(book.name);
        if (
          data.categories.some((category) => category.id === book.category_id)
        ) {
          setCategoryId(book.category_id);
        }
        setCategories(data.categories);
      } catch {
        setError("Не удалось загрузить книгу или категории.");
      }
    }

    loadBook();
  }, [id]);

  async function saveBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || categoryId === "" || saving) return;

    setSaving(true);
    setError("");
    try {
      const body: CreateUpdateBook = {
        name: name.trim(),
        category_id: categoryId,
      };
      const response = await fetch(`/api/books/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error();

      window.location.replace("/admin/books");
    } catch {
      setError("Не удалось сохранить книгу.");
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Изменить книгу</h1>
      <p>ID книги: {id}</p>
      {error && <p role="alert">{error}</p>}
      {!categories && !error && <output>Загрузка книги…</output>}
      {categories?.length === 0 && (
        <p>Чтобы сохранить книгу, сначала создайте категорию.</p>
      )}
      {categories && (
        <form className="max-w-sm space-y-4" onSubmit={saveBook}>
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
          <label className="flex flex-col gap-1">
            Категория
            <select
              className="rounded border border-current/30 bg-background px-2 py-1.5"
              value={categoryId}
              onChange={(event) => setCategoryId(Number(event.target.value))}
              disabled={saving || !categories.length}
              required
            >
              <option value="" disabled>
                Выберите категорию
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
            type="submit"
            disabled={saving || !name.trim() || categoryId === ""}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </form>
      )}
      <Link className="inline-block underline" href="/admin/books">
        Вернуться к списку
      </Link>
    </section>
  );
}
