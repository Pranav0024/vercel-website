import type { PublicProduct } from "./catalogue-types";

type ProductGuide = { title: string; introduction: string; ordering: string };

const guides: Record<string, ProductGuide> = {
  "/Block Brush.png": {
    "title": "Block Brush for Decorative Wall Textures",
    "introduction": "Use a block texture brush to explore decorative surface patterns. The finish depends on the coating and application technique.",
    "ordering": "Confirm the brush dimensions, bristle type and suitability for your chosen texture material."
  },
  "/Stucco Trowel.png": {
    "title": "Stucco Trowel for Plaster and Decorative Wall Finishes",
    "introduction": "A stucco trowel is used to work plaster and decorative wall coatings. Choose a blade suited to your material and the finish you want.",
    "ordering": "Confirm blade dimensions, blade material, handle details and coating compatibility before ordering."
  },
  "/C-Brush.png": {
    "title": "C-Brush for Decorative Wall Texture Application",
    "introduction": "Explore decorative wall texture effects with this C-shaped application brush. Ask about the pattern it produces with your chosen coating.",
    "ordering": "Confirm the brush size, bristle details and recommended application method for your material."
  },
  "/Comb Brush.png": {
    "title": "Comb Brush for Patterned Wall Textures",
    "introduction": "A texture comb brush helps create repeated lines and patterns in compatible wall finishes. Pattern depth depends on the coating and technique.",
    "ordering": "Confirm comb dimensions, spacing and coating compatibility. Share a reference image of the finish you want."
  },
  "/Spatula Brush.png": {
    "title": "Spatula Brush for Decorative Wall Finishes",
    "introduction": "This hand-held texture application brush is intended for decorative surface work. Ask which effects suit your chosen wall coating.",
    "ordering": "Confirm the tool dimensions, working edge and recommended coating before ordering."
  },
  "/Paniar Garden Sprayer bottel with Adjustable Nozzle.png": {
    "title": "Garden Sprayer Bottle with Adjustable Nozzle",
    "introduction": "An adjustable-nozzle garden spray bottle for plant-care spraying. Ask about spray adjustment and the bottle capacity for your routine.",
    "ordering": "Confirm capacity, spray settings and compatible liquids. Check suitability before using any plant treatment."
  },
  "/Thankyou Card white green.jpg": {
    "title": "Green & White Thank You Cards for Business Packaging",
    "introduction": "Add a green & white thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/thankyou cards flower heart.jpg": {
    "title": "Floral Heart Thank You Cards for Business Packaging",
    "introduction": "Add a floral heart thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/thankyou cards foldable blue white.jpg": {
    "title": "Blue & White Foldable Thank You Cards for Business Packaging",
    "introduction": "Add a blue & white foldable thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/thankyou cards rating white pink.jpg": {
    "title": "Pink & White Review Thank You Cards for Business Packaging",
    "introduction": "Add a pink & white review thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/thankyou cards flowers pink.jpg": {
    "title": "Pink Floral Thank You Cards for Business Packaging",
    "introduction": "Add a pink floral thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/thankyou cards beige flowers.jpg": {
    "title": "Beige Floral Thank You Cards for Business Packaging",
    "introduction": "Add a beige floral thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  },
  "/Thankyou cards Foldable white gold.jpg": {
    "title": "White & Gold Foldable Thank You Cards for Business Packaging",
    "introduction": "Add a white & gold foldable thank-you card to customer parcels or packaging. Check the pictured design and the pack quantity shown for this listing.",
    "ordering": "Confirm card dimensions, paper finish, printed sides and quantity. Ask about custom printing availability if you need your own business details."
  }
};

export function productGuide(product: PublicProduct): ProductGuide | undefined {
  if (product.mainImage === "/Mandala stencil.png") {
    const shape = /square/i.test(product.name) ? "Square" : /round/i.test(product.name) ? "Round" : "Mandala";
    return {
      title: shape === "Mandala" ? "Mandala Wall Stencils for Decorative Painting" : shape + " Mandala Wall Stencils for Decorative Painting",
      introduction: "Explore mandala stencil designs for decorative wall painting and compatible textured finishes. Choose the design and size for your project.",
      ordering: "Confirm the design reference, overall dimensions, stencil material and compatible coating. For prices per square inch, request the total price for your selected dimensions before ordering.",
    };
  }
  return guides[product.mainImage];
}
