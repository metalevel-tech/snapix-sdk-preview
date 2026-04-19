"use server";

import type {
  GalleryType,
  GenerateImageResponse,
  ImageType,
  UpdateImageResponse,
  UploadImageResponse,
} from "@metalevel/snapix-sdk-core";
import { SnapixApiError, SnapixClientServer } from "@metalevel/snapix-sdk-core";
import { detectImageContentType } from "@/lib/utils";

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
  const galleryIds = formData.getAll("galleryId").filter(Boolean) as string[];

  const arrayBuffer = await file.arrayBuffer();
  const imageBase64 = Buffer.from(arrayBuffer).toString("base64");
  const imageContentType = detectImageContentType(file.type, arrayBuffer);

  try {
    return await client.uploadImage({
      imageBase64,
      imageContentType,
      name: name || file.name,
      description: description || undefined,
      galleries: galleryIds.length > 0 ? galleryIds : undefined,
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

export async function fetchImageById(imageId: string): Promise<ImageType> {
  const { data } = await client.getImage({ imageId });
  return data;
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

export async function updateImage(
  formData: FormData
): Promise<UpdateImageResponse> {
  const imageId = formData.get("imageId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const galleries = formData.getAll("galleryId").filter(Boolean) as string[];
  const file = formData.get("file") as File | null;

  let imageBase64: string | undefined;
  let imageContentType: string | undefined;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    imageContentType = detectImageContentType(file.type, arrayBuffer);
  }

  try {
    return await client.updateImage({
      imageId,
      name,
      description: description || undefined,
      galleries: galleries.length > 0 ? galleries : undefined,
      imageBase64,
      imageContentType,
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

export async function generateImage(params: {
  promptText: string;
  name?: string;
  description?: string;
  galleries?: string[];
  imageUrl?: string;
}): Promise<GenerateImageResponse> {
  try {
    return await client.generateImage({
      promptText: params.promptText,
      name: params.name || undefined,
      description: params.description || undefined,
      galleries: params.galleries,
      imageUrl: params.imageUrl,
      formatOptions: [{ format: "webp" }, { format: "avif" }],
    });
  } catch (err) {
    if (err instanceof SnapixApiError && err.isReadOnly) {
      throw new Error(
        "This API key lacks the 'images-create' permission. Generation requires a key with images-create access."
      );
    }
    throw err;
  }
}
