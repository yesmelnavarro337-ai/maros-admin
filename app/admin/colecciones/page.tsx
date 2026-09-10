import { getCollections } from "@/features/collections/services/collections.server.service";
import { CollectionGrid } from "@/features/collections/components/collection-grid";

export default async function ColeccionesPage() {
  const collections = await getCollections();
  return <CollectionGrid initialCollections={collections} />;
}