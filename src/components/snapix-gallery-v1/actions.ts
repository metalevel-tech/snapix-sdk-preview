"use server";

import { detectImageContentType } from "@/lib/utils";
import type {
  GalleryType,
  ImageType,
  UpdateImageResponse,
  UploadImageResponse,
} from "@metalevel/snapix-sdk-core";
import { SnapixApiError, SnapixClientServer } from "@metalevel/snapix-sdk-core";

const client = new SnapixClientServer();

type ActionResult<T> = { ok: true; data: T; } | { ok: false; error: string; };

export async function fetchGalleries(): Promise<ActionResult<GalleryType[]>> {
  try {
    const { galleries } = await client.listGalleries();
    return { ok: true, data: galleries };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch galleries" };
  }
}

// The REST API wraps gallery images as { galleryId, imageId, image: ImageType }[]
// The SDK types incorrectly say ImageType[] - we cast to extract the nested object.
type GalleryImageWrapper = { image: ImageType; };

export async function fetchGalleryImages(
  galleryId: string
): Promise<ActionResult<ImageType[]>> {
  try {
    const { gallery } = await client.getGallery({ galleryId });
    const wrappers = gallery.images as unknown as GalleryImageWrapper[];
    const data = wrappers
      .map((w) => w.image)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch gallery images" };
  }
}

export async function fetchUngroupedImages(): Promise<ActionResult<ImageType[]>> {
  try {
    const { gallery } = await client.getImagesWithoutGallery();
    const data = gallery.images
      .map((entry) => entry.image)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Failed to fetch images" };
  }
}

export async function uploadImage(
  formData: FormData
): Promise<ActionResult<UploadImageResponse>> {
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const galleryId = formData.get("galleryId") as string | null;

  const arrayBuffer = await file.arrayBuffer();
  const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
  const imageContentType = detectImageContentType(file.type, arrayBuffer);

  try {
    const data = await client.uploadImage({
      imageBase64,
      imageContentType,
      name: name || file.name,
      description: description || undefined,
      galleries: galleryId ? [galleryId] : undefined,
      formatOptions: [{ format: "webp" }, { format: "avif" }],
    });
    return { ok: true, data };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'images-create' permission. Upload requires a key with images-create access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed" };
  }
}

export async function deleteImage(
  imageId: string
): Promise<ActionResult<{ success: boolean; }>> {
  try {
    const data = await client.deleteImage({ imageId });
    return { ok: true, data };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'images-delete' permission. Delete requires a key with images-delete access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Delete failed" };
  }
}

export async function updateImageMetadata(
  imageId: string,
  {
    name,
    description,
    gallery,
  }: { name: string; description: string; gallery?: string | null; }
): Promise<ActionResult<UpdateImageResponse>> {
  try {
    const data = await client.updateImage({
      imageId,
      name,
      description: description || undefined,
      galleries: gallery ? [gallery] : [],
    });
    return { ok: true, data };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'images-update' permission. Update requires a key with images-update access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function createGallery(
  name: string,
  isPublic: boolean
): Promise<ActionResult<GalleryType>> {
  try {
    // The SDK types for createGallery return GalleryType at this version,
    // but the REST API actually returns { gallery: GalleryWithImagesType }.
    const result = (await client.createGallery({
      name,
      isPublic,
    })) as unknown as { gallery: GalleryType; };
    return { ok: true, data: result.gallery };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'galleries-create' permission. Creating galleries requires a key with galleries-create access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Failed to create gallery" };
  }
}

export async function updateGallery(
  galleryId: string,
  { name, isPublic }: { name: string; isPublic: boolean; }
): Promise<ActionResult<GalleryType>> {
  try {
    const data = await client.updateGallery({ galleryId, name, isPublic });
    return { ok: true, data };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'galleries-update' permission. Updating galleries requires a key with galleries-update access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Failed to update gallery" };
  }
}

export async function deleteGallery(
  galleryId: string,
  deleteImages: boolean
): Promise<ActionResult<{ success: boolean; }>> {
  try {
    const data = await client.deleteGallery({ galleryId, deleteImages });
    return { ok: true, data };
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      return { ok: false, error: "This API key lacks the 'galleries-delete' or 'galleries-delete-with-images' permission. Deleting galleries requires a key with the appropriate delete access." };
    }
    return { ok: false, error: err instanceof Error ? err.message : "Failed to delete gallery" };
  }
}
