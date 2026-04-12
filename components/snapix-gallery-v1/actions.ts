"use server"

import type {
  GalleryType,
  ImageType,
  UpdateImageResponse,
  UploadImageResponse,
} from "@metalevel/snapix-sdk-core"
import { SnapixClient } from "@metalevel/snapix-sdk-core"

const client = new SnapixClient()

export async function fetchGalleries(): Promise<GalleryType[]> {
  const { galleries } = await client.listGalleries()
  return galleries
}

// The REST API wraps gallery images as { galleryId, imageId, image: ImageType }[]
// The SDK types incorrectly say ImageType[] — we cast to extract the nested object.
type GalleryImageWrapper = { image: ImageType }

export async function fetchGalleryImages(
  galleryId: string
): Promise<ImageType[]> {
  const { gallery } = await client.getGallery(galleryId)
  const wrappers = gallery.images as unknown as GalleryImageWrapper[]
  return wrappers
    .map((w) => w.image)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export async function fetchUngroupedImages(): Promise<ImageType[]> {
  const { gallery } = await client.getImagesWithoutGallery()
  return gallery.images
    .map((entry) => entry.image)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export async function uploadImage(
  formData: FormData
): Promise<UploadImageResponse> {
  const file = formData.get("file") as File
  const name = formData.get("name") as string
  const description = formData.get("description") as string | null
  const galleryId = formData.get("galleryId") as string | null

  const arrayBuffer = await file.arrayBuffer()
  const imageBase64 = Buffer.from(arrayBuffer).toString("base64")

  return client.uploadImage({
    imageBase64,
    imageContentType: file.type,
    name: name || file.name,
    description: description || undefined,
    galleries: galleryId ? [galleryId] : undefined,
    formatOptions: [{ format: "webp" }, { format: "avif" }],
  })
}

export async function deleteImage(
  imageId: string
): Promise<{ success: boolean }> {
  return client.deleteImage(imageId)
}

export async function updateImageMetadata(
  imageId: string,
  { name, description }: { name: string; description: string }
): Promise<UpdateImageResponse> {
  return client.updateImage(imageId, {
    name,
    description: description || undefined,
  })
}

export async function createGallery(
  name: string,
  isPublic: boolean
): Promise<GalleryType> {
  // The SDK types for createGallery return GalleryType at this version,
  // but the REST API actually returns { gallery: GalleryWithImagesType }.
  const result = (await client.createGallery({
    name,
    isPublic,
  })) as unknown as { gallery: GalleryType }
  return result.gallery
}

export async function updateGallery(
  galleryId: string,
  { name, isPublic }: { name: string; isPublic: boolean }
): Promise<GalleryType> {
  return client.updateGallery(galleryId, { name, isPublic })
}

export async function deleteGallery(
  galleryId: string,
  deleteImages: boolean
): Promise<{ success: boolean }> {
  return client.deleteGallery(galleryId, deleteImages)
}
