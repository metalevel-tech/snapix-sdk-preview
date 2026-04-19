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

export async function fetchGalleries(): Promise<GalleryType[]> {
  const { galleries } = await client.listGalleries();
  return galleries;
}

// The REST API wraps gallery images as { galleryId, imageId, image: ImageType }[]
// The SDK types incorrectly say ImageType[] - we cast to extract the nested object.
type GalleryImageWrapper = { image: ImageType; };

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

export async function uploadImage(
  formData: FormData
): Promise<UploadImageResponse> {
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const galleryId = formData.get("galleryId") as string | null;

  const arrayBuffer = await file.arrayBuffer();
  const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
  const imageContentType = detectImageContentType(file.type, arrayBuffer);

  try {
    return await client.uploadImage({
      imageBase64,
      imageContentType,
      name: name || file.name,
      description: description || undefined,
      galleries: galleryId ? [galleryId] : undefined,
      formatOptions: [{ format: "webp" }, { format: "avif" }],
    });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'images-create' permission. Upload requires a key with images-create access."
      );
    }
    throw err;
  }
}

export async function deleteImage(
  imageId: string
): Promise<{ success: boolean; }> {
  try {
    return await client.deleteImage({ imageId });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'images-delete' permission. Delete requires a key with images-delete access."
      );
    }
    throw err;
  }
}

export async function updateImageMetadata(
  imageId: string,
  {
    name,
    description,
    gallery,
  }: { name: string; description: string; gallery?: string | null; }
): Promise<UpdateImageResponse> {
  try {
    return await client.updateImage({
      imageId,
      name,
      description: description || undefined,
      galleries: gallery ? [gallery] : [],
    });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'images-update' permission. Update requires a key with images-update access."
      );
    }
    throw err;
  }
}

export async function createGallery(
  name: string,
  isPublic: boolean
): Promise<GalleryType> {
  try {
    // The SDK types for createGallery return GalleryType at this version,
    // but the REST API actually returns { gallery: GalleryWithImagesType }.
    const result = (await client.createGallery({
      name,
      isPublic,
    })) as unknown as { gallery: GalleryType; };
    return result.gallery;
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'galleries-create' permission. Creating galleries requires a key with galleries-create access."
      );
    }
    throw err;
  }
}

export async function updateGallery(
  galleryId: string,
  { name, isPublic }: { name: string; isPublic: boolean; }
): Promise<GalleryType> {
  try {
    return await client.updateGallery({ galleryId, name, isPublic });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'galleries-update' permission. Updating galleries requires a key with galleries-update access."
      );
    }
    throw err;
  }
}

export async function deleteGallery(
  galleryId: string,
  deleteImages: boolean
): Promise<{ success: boolean; }> {
  try {
    return await client.deleteGallery({ galleryId, deleteImages });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'galleries-delete' or 'galleries-delete-with-images' permission. Deleting galleries requires a key with the appropriate delete access."
      );
    }
    throw err;
  }
}
