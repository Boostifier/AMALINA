import Link from "next/link";
import { createCategory } from "@/app/actions/admin";
import CategoryForm from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/categories" className="text-sm text-rosegold hover:underline">
        ← Retour aux catégories
      </Link>
      <h1 className="font-serif text-3xl text-charcoal">Nouvelle catégorie</h1>
      <CategoryForm action={createCategory} submitLabel="Créer la catégorie" />
    </div>
  );
}
