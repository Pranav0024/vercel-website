import { CATEGORIES, type CatalogueProduct } from "./catalogue-types";

export class CatalogueError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code?: string,
  ) {
    super(message);
  }
}
function text(
  value: unknown,
  label: string,
  max: number,
  required = false,
): string {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  ) {
    throw new CatalogueError(
      `${label} is required or exceeds ${max} characters.`,
    );
  }
  return value.trim();
}
export function validateProducts(value: unknown): CatalogueProduct[] {
  if (!Array.isArray(value) || value.length > 1000)
    throw new CatalogueError("Use a catalogue of up to 1,000 products.");
  const ids = new Set<string>();
  return value.map((raw) => {
    if (!raw || typeof raw !== "object")
      throw new CatalogueError("Invalid product.");
    const p = raw as Record<string, unknown>;
    const id = text(p.id, "Product reference", 80, true);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id))
      throw new CatalogueError("Product references must be unique.");
    ids.add(id);
    const mainImage = text(p.mainImage, "Image path", 500);
    if (mainImage) {
      let decoded: string;
      try {
        decoded = decodeURIComponent(mainImage);
      } catch {
        throw new CatalogueError("Invalid image path.");
      }
      if (
        !decoded.startsWith("/") ||
        decoded.startsWith("//") ||
        /[\\\x00?#]/.test(decoded) ||
        decoded.split("/").some((part) => part === ".." || part === ".") ||
        !/\.(png|jpe?g|webp)$/i.test(decoded)
      ) {
        throw new CatalogueError(
          "Use an uploaded image or a local PNG, JPG or WebP path.",
        );
      }
      if (
        decoded.startsWith("/api/") &&
        !/^\/api\/catalogue\/images\/[a-f0-9-]{36}\.(png|jpg|webp)$/.test(
          decoded,
        )
      )
        throw new CatalogueError("Invalid uploaded image path.");
    }
    const category = text(p.category, "Category", 80, true);
    if (!(CATEGORIES as readonly string[]).includes(category))
      throw new CatalogueError("Choose a supported category.");
    if (typeof p.published !== "boolean" || typeof p.featured !== "boolean")
      throw new CatalogueError("Invalid visibility settings.");
    if (p.published && !mainImage)
      throw new CatalogueError(
        "Visible products need an image. Upload one or provide a local image path.",
      );
    return {
      id,
      name: text(p.name, "Product name", 160, true),
      price: text(p.price, "Price", 80),
      mainImage,
      category,
      description: text(p.description, "Description", 1600),
      published: p.published,
      featured: p.featured,
    };
  });
}
export function imageExtension(bytes: Buffer): "jpg" | "png" | "webp" {
  if (bytes.length < 12 || bytes.length > 4 * 1024 * 1024)
    throw new CatalogueError("Upload a JPG, PNG or WebP image up to 4 MB.");
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return "jpg";
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "png";
  if (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  throw new CatalogueError(
    "Unsupported image format. SVG and executable files are not accepted.",
  );
}
