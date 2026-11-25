import EditCategoryForm from "./edit-category-form";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditCategoryForm key={id} id={id} />;
}
