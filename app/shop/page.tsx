import CatalogueBrowser from "@/components/CatalogueBrowser";
import { readPublicCatalogue } from "@/lib/catalogue-store";
export const dynamic = "force-dynamic";
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string | string[] }>;
}) {
  const [products, params] = await Promise.all([
    readPublicCatalogue(),
    searchParams,
  ]);
  const initialSearch = Array.isArray(params.search)
    ? params.search[0] || ""
    : params.search || "";
  return <CatalogueBrowser products={products} initialSearch={initialSearch} />;
}
