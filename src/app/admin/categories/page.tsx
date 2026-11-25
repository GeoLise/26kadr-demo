"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import type { Category } from "@/lib/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>();
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loading = categories === undefined;
  const loadError = categories === null;
  const busy = loading || saving;

  async function loadCategories() {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error();

      const { categories }: { categories: Category[] } = await response.json();
      setCategories(categories);
    } catch {
      setCategories(null);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name || busy || loadError) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error();

      setNewName("");
      await loadCategories();
    } catch {
      setError("Не удалось добавить категорию.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id: number) {
    if (busy || loadError) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error();

      await loadCategories();
    } catch {
      setError("Не удалось удалить категорию.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Категории</h1>

      <form className="flex flex-wrap items-end gap-2" onSubmit={addCategory}>
        <label className="flex flex-col gap-1">
          Название новой категории
          <input
            className="min-w-0 rounded border border-current/30 px-2 py-1.5"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            disabled={busy || loadError}
            required
          />
        </label>
        <button
          className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
          type="submit"
          disabled={busy || loadError || !newName.trim()}
        >
          Добавить
        </button>
      </form>

      {error && <p role="alert">{error}</p>}
      {loading && <output className="block">Загрузка категорий…</output>}
      {loadError && <p role="alert">Не удалось загрузить категории.</p>}

      {categories?.length === 0 && <p>Категорий пока нет.</p>}

      {categories && categories.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-current/30">
                <th className="p-2" scope="col">
                  ID
                </th>
                <th className="w-full p-2" scope="col">
                  Название
                </th>
                <th className="p-2" scope="col">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr className="border-b border-current/20" key={category.id}>
                  <td className="p-2 tabular-nums">{category.id}</td>
                  <td className="p-2 wrap-anywhere">{category.name}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Link
                        className="rounded border border-current/30 px-3 py-1.5 hover:bg-zinc-500/10"
                        href={`/admin/categories/${category.id}`}
                      >
                        Изменить
                      </Link>
                      <button
                        className="rounded border border-current/30 px-3 py-1.5 enabled:cursor-pointer enabled:hover:bg-zinc-500/10 disabled:opacity-50"
                        type="button"
                        disabled={busy}
                        onClick={() => deleteCategory(category.id)}
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
