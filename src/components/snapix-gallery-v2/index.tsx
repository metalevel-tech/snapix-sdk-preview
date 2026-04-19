"use client";

import { Progress } from "@/components/ui/progress";
import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import {
	createGallery,
	deleteGallery,
	deleteImage,
	fetchGalleryImages,
	fetchUngroupedImages,
	generateImage,
	updateGallery,
	updateImage,
	uploadImage,
} from "./actions";
import { UNGROUPED_KEY } from "./constants";
import { DeleteButton } from "./delete-button";
import { EditManager } from "./edit-manager";
import { GenerateManager } from "./generate-manager";
import { GalleryCreateManager } from "./gallery-create-manager";
import { GalleryDeleteButton } from "./gallery-delete-button";
import { GalleryEditManager } from "./gallery-edit-manager";
import { GalleryOpenButton } from "./gallery-open-button";
import { GallerySelector } from "./gallery-selector";
import { ImageCarousel } from "./image-carousel";
import { UploadManager } from "./upload-manager";
import { DownloadButton } from "./download-button";
import { OpenButton } from "./open-button";

// The actual REST API metadata shape differs from the SDK types (same as image-carousel.tsx)
type RawMeta = {
	objectKey: string | null;
	fileExtension: string;
	imageInfo: { type: string; width: number; height: number; };
};

function getBestVariantUrl(image: ImageType): string {
	if (!image?.urlBase) return "";
	const rawMeta = (image?.metadata ?? []) as unknown as RawMeta[];
	const candidates = rawMeta.filter((m) => !!m.objectKey);
	if (!candidates.length) return "";
	const formats = ["webp", "avif", "jpg", "jpeg", "png"];
	for (const format of formats) {
		const byFormat = candidates.filter(
			(m) => m.fileExtension === format || m.imageInfo?.type === format
		);
		if (!byFormat.length) continue;
		const sorted = [...byFormat].sort(
			(a, b) =>
				(b.imageInfo?.width ?? 0) * (b.imageInfo?.height ?? 0) -
				(a.imageInfo?.width ?? 0) * (a.imageInfo?.height ?? 0)
		);
		return `${image.urlBase}/${sorted[0].objectKey}`;
	}
	return `${image.urlBase}/${candidates[0].objectKey}`;
}

interface Props {
	galleries: GalleryType[];
}

export function SnapixGalleryV2({ galleries: initialGalleries }: Props) {
	const [galleries, setGalleries] = React.useState<GalleryType[]>(initialGalleries);
	const [selectedGalleryId, setSelectedGalleryId] = React.useState<
		string | null
	>(null);
	const [imageCache, setImageCache] = React.useState<
		Record<string, ImageType[]>
	>({});
	const [currentImage, setCurrentImage] = React.useState<ImageType | null>(
		null
	);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isUploading, setIsUploading] = React.useState(false);
	const [uploadProgress, setUploadProgress] = React.useState(0);
	const [isGenerating, setIsGenerating] = React.useState(false);
	const [generateProgress, setGenerateProgress] = React.useState(0);
	const [isEditing, setIsEditing] = React.useState(false);
	const [editProgress, setEditProgress] = React.useState(0);
	const [startImageId, setStartImageId] = React.useState<string | null>(null);

	const cacheKey = selectedGalleryId ?? UNGROUPED_KEY;
	const currentImages = imageCache[cacheKey] ?? [];
	const isBusy = isLoading || isUploading || isGenerating || isEditing;
	const selectedGallery = galleries.find((g) => g.id === selectedGalleryId) ?? null;
	const templateImageUrl = currentImage ? getBestVariantUrl(currentImage) || null : null;
	const startIndex = startImageId
		? Math.max(0, currentImages.findIndex((img) => img.id === startImageId))
		: 0;

	const loadImages = async (galleryId: string | null, force = false) => {
		const key = galleryId ?? UNGROUPED_KEY;
		if (!force && imageCache[key] !== undefined) return;
		setIsLoading(true);
		try {
			const result = galleryId
				? await fetchGalleryImages(galleryId)
				: await fetchUngroupedImages();
			if (!result.ok) throw new Error(result.error);
			setImageCache((prev) => ({ ...prev, [key]: result.data }));
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to load images"
			);
		} finally {
			setIsLoading(false);
		}
	};

	// Prefetch all galleries + ungrouped in parallel on mount
	React.useEffect(() => {
		const prefetch = async () => {
			setIsLoading(true);
			try {
				const allIds = [null, ...initialGalleries.map((g) => g.id)];
				const results = await Promise.allSettled(
					allIds.map((id) =>
						id === null ? fetchUngroupedImages() : fetchGalleryImages(id)
					)
				);
				const cacheUpdate: Record<string, ImageType[]> = {};
				allIds.forEach((id, i) => {
					const result = results[i];
					if (result.status === "fulfilled" && result.value.ok) {
						cacheUpdate[id ?? UNGROUPED_KEY] = result.value.data;
					}
				});
				setImageCache(cacheUpdate);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load images");
			} finally {
				setIsLoading(false);
			}
		};
		void prefetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleGalleryChange = (galleryId: string | null) => {
		setStartImageId(null);
		setSelectedGalleryId(galleryId);
		void loadImages(galleryId);
	};

	const handleUpload = async (formData: FormData, targetGalleryIds: string[]) => {
		setIsUploading(true);
		setUploadProgress(5);

		const progressInterval = setInterval(() => {
			setUploadProgress((prev) => Math.min(prev + 10, 85));
		}, 350);

		try {
			const result = await uploadImage(formData);
			if (!result.ok) throw new Error(result.error);
			clearInterval(progressInterval);
			setUploadProgress(100);

			// Evict all target gallery caches + ungrouped; let them refetch fresh
			setImageCache((prev) => {
				const next = { ...prev };
				targetGalleryIds.forEach((id) => delete next[id]);
				delete next[UNGROUPED_KEY];
				return next;
			});

			// Navigate to the appropriate gallery
			const stayOnCurrent =
				selectedGalleryId === null
					? targetGalleryIds.length === 0
					: targetGalleryIds.includes(selectedGalleryId);
			const navigateTo = stayOnCurrent ? selectedGalleryId : (targetGalleryIds[0] ?? null);
			setSelectedGalleryId(navigateTo);
			void loadImages(navigateTo, true);
			toast.success("Image uploaded successfully");
		} catch (err) {
			clearInterval(progressInterval);
			toast.error(err instanceof Error ? err.message : "Upload failed");
		} finally {
			setTimeout(() => {
				setIsUploading(false);
				setUploadProgress(0);
			}, 800);
		}
	};

	const handleGenerate = async (params: {
		name: string;
		prompt: string;
		galleryIds: string[];
		imageUrl?: string;
	}) => {
		setIsGenerating(true);
		setGenerateProgress(5);

		const progressInterval = setInterval(() => {
			setGenerateProgress((prev) => Math.min(prev + 5, 85));
		}, 500);

		try {
			const result = await generateImage({
				promptText: params.prompt,
				name: params.name || undefined,
				description: params.prompt,
				galleries: params.galleryIds.length > 0 ? params.galleryIds : undefined,
				imageUrl: params.imageUrl,
			});
			if (!result.ok) throw new Error(result.error);
			clearInterval(progressInterval);
			setGenerateProgress(100);

			const generatedImage = result.data.data[0];

			// Evict target gallery caches + ungrouped
			setImageCache((prev) => {
				const next = { ...prev };
				params.galleryIds.forEach((id) => delete next[id]);
				delete next[UNGROUPED_KEY];
				return next;
			});

			// Navigate to the appropriate gallery
			const stayOnCurrent =
				selectedGalleryId === null
					? params.galleryIds.length === 0
					: params.galleryIds.includes(selectedGalleryId);
			const navigateTo = stayOnCurrent
				? selectedGalleryId
				: (params.galleryIds[0] ?? null);
			if (generatedImage) setStartImageId(generatedImage.id);
			setSelectedGalleryId(navigateTo);
			void loadImages(navigateTo, true);
			toast.success("Image generated successfully");
		} catch (err) {
			clearInterval(progressInterval);
			toast.error(err instanceof Error ? err.message : "Generation failed");
		} finally {
			setTimeout(() => {
				setIsGenerating(false);
				setGenerateProgress(0);
			}, 800);
		}
	};

	const handleGalleryCreate = async (name: string, isPublic: boolean) => {
		try {
			const galleryResult = await createGallery(name, isPublic);
			if (!galleryResult.ok) throw new Error(galleryResult.error);
			const newGallery = galleryResult.data;
			setGalleries((prev) => [...prev, newGallery]);
			setSelectedGalleryId(newGallery.id);
			// Pre-seed an empty cache entry - no fetch needed for a brand-new gallery
			setImageCache((prev) => ({ ...prev, [newGallery.id]: [] }));
			toast.success("Gallery created");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to create gallery");
		}
	};

	const handleGalleryEdit = async (galleryId: string, name: string, isPublic: boolean) => {
		try {
			const galleryResult = await updateGallery(galleryId, { name, isPublic });
			if (!galleryResult.ok) throw new Error(galleryResult.error);
			setGalleries((prev) =>
				prev.map((g) => (g.id === galleryId ? galleryResult.data : g))
			);
			toast.success("Gallery updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update gallery");
		}
	};

	const handleGalleryDelete = async (galleryId: string, withImages: boolean) => {
		try {
			const galleryResult = await deleteGallery(galleryId, withImages);
			if (!galleryResult.ok) throw new Error(galleryResult.error);
			setGalleries((prev) => prev.filter((g) => g.id !== galleryId));
			setSelectedGalleryId(null);
			// Clear the deleted gallery's cache entry; also clear ungrouped
			// so orphaned images (if any) are re-fetched on next view
			setImageCache((prev) => {
				const next = { ...prev };
				delete next[galleryId];
				delete next[UNGROUPED_KEY];
				return next;
			});
			void loadImages(null, true);
			toast.success("Gallery deleted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to delete gallery");
		}
	};

	const handleEdit = async (
		imageId: string,
		params: { formData: FormData; originalGalleryIds: string[]; }
	) => {
		setIsEditing(true);
		setEditProgress(5);

		const progressInterval = setInterval(() => {
			setEditProgress((prev) => Math.min(prev + 10, 85));
		}, 350);

		try {
			const oldGalleryIds = params.originalGalleryIds;
			const newGalleryIds = params.formData.getAll("galleryId") as string[];
			const editResult = await updateImage(params.formData);
			if (!editResult.ok) throw new Error(editResult.error);
			clearInterval(progressInterval);
			setEditProgress(100);

			// Evict all affected gallery caches (old + new + current + ungrouped if relevant)
			const affectedIds = new Set([...oldGalleryIds, ...newGalleryIds, cacheKey]);
			if (oldGalleryIds.length === 0 || newGalleryIds.length === 0) {
				affectedIds.add(UNGROUPED_KEY);
			}
			setImageCache((prev) => {
				const next = { ...prev };
				affectedIds.forEach((id) => delete next[id]);
				return next;
			});
			setCurrentImage(null);

			// Stay on current gallery if it's still in the new assignment
			const currentInNew =
				selectedGalleryId === null
					? newGalleryIds.length === 0
					: newGalleryIds.includes(selectedGalleryId);

			setStartImageId(imageId);
			if (currentInNew) {
				void loadImages(selectedGalleryId, true);
			} else {
				const navigateTo = newGalleryIds[0] ?? null;
				setSelectedGalleryId(navigateTo);
				void loadImages(navigateTo, true);
			}
			toast.success("Image updated");
		} catch (err) {
			clearInterval(progressInterval);
			toast.error(err instanceof Error ? err.message : "Update failed");
		} finally {
			setTimeout(() => {
				setIsEditing(false);
				setEditProgress(0);
			}, 800);
		}
	};

	const handleDelete = async (imageId: string) => {
		setIsLoading(true);
		try {
			const deleteResult = await deleteImage(imageId);
			if (!deleteResult.ok) throw new Error(deleteResult.error);
			// Remove from local cache without a full refetch
			setImageCache((prev) => {
				const updated = { ...prev };
				if (updated[cacheKey]) {
					updated[cacheKey] = updated[cacheKey].filter(
						(img) => img.id !== imageId
					);
				}
				return updated;
			});
			toast.success("Image deleted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-svh flex-col gap-6 p-6 pt-2 pb-16 w-full">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-heading text-2xl font-medium flex gap-1 mb-4">
					<Link href="/" className="flex items-center gap-1 text-muted-foreground mr-1 -ml-1.5">
						<ChevronLeft className="size-8 transform" strokeWidth={2} /> Home |
					</Link>
					<span>
						SnapiX Gallery SDK Server Client Full
					</span>
				</h1>
				<p className="text-sm text-muted-foreground">
					Gallery &amp; image management powered by SnapiX SDK
				</p>
			</div>

			<div className="flex flex-col gap-2 max-w-full">
				{/* Row 1: Gallery actions */}
				<div className="flex flex-wrap items-center gap-3 *:flex-2 w-full">
					<GallerySelector
						galleries={galleries}
						value={selectedGalleryId}
						onValueChange={handleGalleryChange}
						disabled={isBusy}
					/>
					<GalleryOpenButton
						selectedGallery={selectedGallery}
						disabled={isBusy}
					/>
					<GalleryCreateManager
						disabled={isBusy}
						onCreate={handleGalleryCreate}
					/>
					<GalleryEditManager
						selectedGallery={selectedGallery}
						disabled={isBusy}
						onEdit={handleGalleryEdit}
					/>
					<GalleryDeleteButton
						selectedGallery={selectedGallery}
						disabled={isBusy}
						onDelete={handleGalleryDelete}
					/>
				</div>
				{/* Row 2: Image actions */}
				<div className="flex flex-wrap items-center gap-3 *:flex-1 w-full">
					<UploadManager
						galleries={galleries}
						selectedGalleryId={selectedGalleryId}
						isUploading={isUploading}
						disabled={isBusy}
						onUpload={handleUpload}
					/>
					<EditManager
						galleries={galleries}
						selectedGalleryId={selectedGalleryId}
						currentImage={currentImage}
						disabled={isBusy}
						onEdit={handleEdit}
					/>
					<GenerateManager
						galleries={galleries}
						selectedGalleryId={selectedGalleryId}
						templateImageUrl={templateImageUrl}
						disabled={isBusy}
						onGenerate={handleGenerate}
					/>
					<OpenButton
						currentImage={currentImage}
						templateImageUrl={templateImageUrl}
						disabled={isBusy}
					/>
					<DownloadButton
						currentImage={currentImage}
						templateImageUrl={templateImageUrl}
						disabled={isBusy}
					/>
					<DeleteButton
						currentImage={currentImage}
						disabled={isBusy}
						onDelete={handleDelete}
					/>
				</div>
			</div>

			<div className="flex-1">
				<ImageCarousel
					key={cacheKey}
					images={currentImages}
					isLoading={isLoading}
					startIndex={startIndex}
					onImageChange={setCurrentImage}
				/>
			</div>

			{(isUploading || isGenerating || isEditing) && (
				<div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
					<Progress
						value={isUploading ? uploadProgress : isGenerating ? generateProgress : editProgress}
						className="rounded-none"
					/>
				</div>
			)}
		</div>
	);
}
