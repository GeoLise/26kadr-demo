"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { Book, CreateUpdateBook } from "@/lib/types/book";
import type { Category } from "@/lib/types/category";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadBooks() {
    try {
      const response = await fetch("/api/books");
      if (!response.ok) throw new Error();
      const data: { books: Book[] } = await response.json();
      setBooks(data.books);
    } catch {
      setError("Не удалось загрузить книги.");
    }
  }

  useEffect(() => {
    loadBooks();

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error();
        const data: { categories: Category[] } = await response.json();
        setCategories(data.categories);
      } catch {
        setError("Не удалось загрузить категории.");
      }
    }

    loadCategories();
  }, []);

  async function addBook(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || categoryId === "" || saving) return;

    setSaving(true);
    setError("");
    try {
      const body: CreateUpdateBook = {
        name: name.trim(),
        category_id: categoryId,
      };
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error();

      setName("");
      setCategoryId("");
      await loadBooks();
    } catch {
      setError("Не удалось добавить книгу.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBook(id: number) {
    if (saving) return;

    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      await loadBooks();
    } catch {
      setError("Не удалось удалить книгу.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Книги</h1>
      <form className="flex flex-wrap items-end gap-2" onSubmit={addBook}>
        <label className="flex flex-col gap-1">
          Название новой книги
          <input
            className="min-w-0 rounded border border-current/30 px-2 py-1.5"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={saving}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          Категория
          <select
            className="max-w-full rounded border border-current/30 bg-background px-2 py-1.5"
            value={categoryId}
            onChange={(event) => setCategoryId(Number(event.target.value))}
            disabled={saving || !categories?.length}
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
          type="submit"
          disabled={saving || !books || !name.trim() || categoryId === ""}
        >
          Добавить
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {(!books || !categories) && !error && <output>Загрузка…</output>}
      {categories?.length === 0 && (
        <p>Чтобы добавить книгу, сначала создайте категорию.</p>
      )}
      {books?.length === 0 && <p>Книг пока нет.</p>}

      {books && books.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-current/30">
                <th className="p-2" scope="col">
                  ID
                </th>
                <th className="p-2" scope="col">
                  Название
                </th>
                <th className="p-2" scope="col">
                  Категория
                </th>
                <th className="p-2" scope="col">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr className="border-b border-current/20" key={book.id}>
                  <td className="p-2">{book.id}</td>
                  <td className="p-2 wrap-anywhere">{book.name}</td>
                  <td className="p-2 wrap-anywhere">
                    {categories?.find(
                      (category) => category.id === book.category_id,
                    )?.name ?? `ID ${book.category_id}`}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Link
                        className="rounded border border-current/30 px-3 py-1.5 hover:bg-zinc-500/10"
                        href={`/admin/books/${book.id}`}
                      >
                        Изменить
                      </Link>
                      <button
                        className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
                        type="button"
                        disabled={saving}
                        onClick={() => deleteBook(book.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
