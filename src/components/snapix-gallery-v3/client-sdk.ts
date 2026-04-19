import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core/browser";
import { SnapixClientBrowser } from "@metalevel/snapix-sdk-core/browser";

// Browser-safe client - reads NEXT_PUBLIC_SNAPIX_API_KEY and NEXT_PUBLIC_SNAPIX_BASE_URL.
// Zero Node.js dependencies; safe to import in client components.
const client = new SnapixClientBrowser();

// The REST API wraps gallery images as { galleryId, imageId, image: ImageType }[].
// The SDK types report ImageType[] - we cast to extract the nested object.
type GalleryImageWrapper = { image: ImageType; };

export async function fetchGalleries(): Promise<GalleryType[]> {
  const { galleries } = await client.listGalleries();
  return galleries;
}

export async function fetchGalleryImages(
  galleryId: string
): Promise<ImageType[]> {
  const { gallery } = await client.getGallery({ galleryId });
  const wrappers = gallery.images as unknown as GalleryImageWrapper[];
  return wrappers
    .map((w) => w.image)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export async function fetchUngroupedImages(): Promise<ImageType[]> {
  const { gallery } = await client.getImagesWithoutGallery();
  return gallery.images
    .map((entry) => entry.image)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
