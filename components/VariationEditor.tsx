"use client";
import type { ProductVariation } from "@/lib/catalogue-types";
export default function VariationEditor({ variations, onChange, upload }: { variations: ProductVariation[]; onChange: (items: ProductVariation[]) => void; upload: (file: File | undefined, id: string) => void }) {
  function update(id: string, change: Partial<ProductVariation>) { onChange(variations.map(v => v.id === id ? { ...v, ...change } : v)); }
  return <section className="admin-full admin-variations" aria-label="Product variations">
    <h3>Variations ({variations.length}/200)</h3><p>Each design or size can have its own price and photo. Blank prices and photos use the main product. Save your draft, then publish.</p>
    <button type="button" className="admin-button admin-secondary" disabled={variations.length >= 200} onClick={() => onChange([...variations, { id: crypto.randomUUID(), name: "", size: "", price: "", mainImage: "" }])}>Add variation</button>
    {variations.map((v, index) => <fieldset key={v.id} className="admin-variation-row"><legend>Variation {index + 1}</legend>
      <label>Design name<input required maxLength={160} value={v.name} onChange={e => update(v.id, { name: e.target.value })} /></label>
      <label>Size<input maxLength={120} value={v.size} placeholder="e.g. 12 × 12 inches" onChange={e => update(v.id, { size: e.target.value })} /></label>
      <label>Public price<input maxLength={80} value={v.price} placeholder="Use main product price" onChange={e => update(v.id, { price: e.target.value })} /></label>
      <label>Image path<input maxLength={500} value={v.mainImage} placeholder="Use main product photo" onChange={e => update(v.id, { mainImage: e.target.value })} /></label>
      <label>Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; upload(file, v.id); }} /></label>
      <button type="button" className="admin-button admin-secondary" onClick={() => onChange(variations.filter(item => item.id !== v.id))}>Remove variation</button>
    </fieldset>)}
  </section>;
}
