import type { PublicProduct } from "@/lib/catalogue-types";

const descriptions: Record<string, string> = {
  "/TEXTURE SPRAYER.png": "Texture spray gun for wall-finish and plaster application work. Enquire about specifications, compatible materials and bulk supply.",
  "/Block Brush.png": "Block brush for decorative wall textures and surface-finish application. Contact Paniar for product details and quantities.",
  "/Stucco Trowel.png": "Stucco trowel for plaster and decorative wall-finish work. Discuss blade specifications, availability and quotations.",
  "/C-Brush.png": "C-shaped texture brush for decorative surface application. Ask about brush specifications and project quantities.",
  "/Comb Brush.png": "Comb texture brush for creating patterned wall finishes. Enquire about dimensions, materials and bulk availability.",
  "/Spatula Brush.png": "Hand-held texture brush for decorative wall-finish work. Contact us for specifications, availability and quotations.",
  "/Mandala stencil.png": "Mandala wall stencil designs for decorative painting and textured surfaces. Enquire about patterns, sizes and quantities.",
  "/Paniar Garden Sprayer bottel with Adjustable Nozzle.png": "Garden sprayer bottle with an adjustable nozzle for plant-care spraying. Ask about capacity, availability and quantity requirements.",
};

export function productDescription(product: PublicProduct): string {
  if (product.description.trim()) return product.description.trim();
  if (descriptions[product.mainImage]) return descriptions[product.mainImage];
  if (/thankyou/i.test(product.mainImage)) return "Printed thank-you cards for business packaging and customer orders. Discuss this design, pack quantities and bulk quotations with Paniar.";
  return `Enquire about ${product.name.trim()}, product specifications, quantities and availability.`;
}
