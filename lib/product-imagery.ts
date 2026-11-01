export type ProductSlide = { src: string; label: string; generated: boolean };

// Match the source photo, so replacing a product in admin never inherits an
// unrelated generated scene merely because its product ID was reused.
const scenes: Record<string, string> = {
  "/TEXTURE SPRAYER.png": "texture-sprayer",
  "/Block Brush.png": "block-brush",
  "/Stucco Trowel.png": "stucco-trowel",
  "/C-Brush.png": "c-brush",
  "/Comb Brush.png": "comb-brush",
  "/Spatula Brush.png": "spatula-brush",
  "/Paniar Garden Sprayer bottel with Adjustable Nozzle.png": "garden-sprayer",
  "/Mandala stencil.png": "mandala-stencil",
  "/Thankyou Card white green.jpg": "cards-green",
  "/thankyou cards flower heart.jpg": "cards-floral-heart",
  "/thankyou cards foldable blue white.jpg": "cards-blue-fold",
  "/thankyou cards rating white pink.jpg": "cards-review-pink",
  "/thankyou cards flowers pink.jpg": "cards-pink-floral",
  "/thankyou cards beige flowers.jpg": "cards-beige-floral",
  "/Thankyou cards Foldable white gold.jpg": "cards-gold-fold",
};

export function productSlides(mainImage: string): ProductSlide[] {
  const scene = scenes[mainImage];
  return [
    ...(scene ? [{ src: `/images/products/${scene}.webp`, label: "Styled view", generated: true }] : []),
    ...(mainImage ? [{ src: mainImage, label: "Original photo", generated: false }] : []),
  ];
}
