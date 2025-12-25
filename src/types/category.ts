export interface Category {
  id: string;
  name: string;
  slug: string;
  imageSrc: string | { url: string; publicId: string | null };
}
