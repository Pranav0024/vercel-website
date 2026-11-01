import CatalogueBrowser from "@/components/CatalogueBrowser";
import { readPublicCatalogue } from "@/lib/catalogue-store";
export const dynamic = "force-dynamic";
export default async function ShopPage() {
  return <CatalogueBrowser products={await readPublicCatalogue()} />;
}
