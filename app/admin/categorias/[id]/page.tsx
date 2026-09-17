import { use } from "react";
import { CategoryDetailView } from "@/features/categories/components/category-detail-view";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  return <CategoryDetailView categoryId={resolvedParams.id} />;
}