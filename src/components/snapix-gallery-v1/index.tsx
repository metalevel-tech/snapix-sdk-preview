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
	updateGallery,
	updateImageMetadata,
	uploadImage,
} from "./actions";
import { UNGROUPED_KEY } from "./constants";
import { DeleteButton } from "./delete-button";
import { EditManager } from "./edit-manager";
import { GalleryCreateManager } from "./gallery-create-manager";
import { GalleryDeleteButton } from "./gallery-delete-button";
import { GalleryEditManager } from "./gallery-edit-manager";
import { GalleryOpenButton } from "./gallery-open-button";
import { GallerySelector } from "./gallery-selector";
import { ImageCarousel } from "./image-carousel";
import { UploadManager } from "./upload-manager";

interface Props {
	galleries: GalleryType[];
}

export function SnapixGalleryV1({ galleries: initialGalleries }: Props) {
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
	const [startImageId, setStartImageId] = React.useState<string | null>(null);

	const cacheKey = selectedGalleryId ?? UNGROUPED_KEY;
	const currentImages = imageCache[cacheKey] ?? [];
	const isBusy = isLoading || isUploading;
	const selectedGallery = galleries.find((g) => g.id === selectedGalleryId) ?? null;
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

	// Load ungrouped images on mount
	React.useEffect(() => {
		void loadImages(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleGalleryChange = (galleryId: string | null) => {
		setStartImageId(null);
		setSelectedGalleryId(galleryId);
		void loadImages(galleryId);
	};

	const handleUpload = async (formData: FormData, targetGalleryId: string | null) => {
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

			// Evict target gallery cache + ungrouped; let them refetch fresh
			setImageCache((prev) => {
				const next = { ...prev };
				if (targetGalleryId) delete next[targetGalleryId];
				delete next[UNGROUPED_KEY];
				return next;
			});

			// Navigate to the appropriate gallery
			const stayOnCurrent = selectedGalleryId === targetGalleryId;
			const navigateTo = stayOnCurrent ? selectedGalleryId : targetGalleryId;
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

	const handleGalleryCreate = async (name: string, isPublic: boolean) => {
		try {
			const result = await createGallery(name, isPublic);
			if (!result.ok) throw new Error(result.error);
			const newGallery = result.data;
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
			const result = await updateGallery(galleryId, { name, isPublic });
			if (!result.ok) throw new Error(result.error);
			setGalleries((prev) =>
				prev.map((g) => (g.id === galleryId ? result.data : g))
			);
			toast.success("Gallery updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update gallery");
		}
	};

	const handleGalleryDelete = async (galleryId: string, withImages: boolean) => {
		try {
			const result = await deleteGallery(galleryId, withImages);
			if (!result.ok) throw new Error(result.error);
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
		params: { name: string; description: string; galleryId: string | null; }
	) => {
		try {
			const originalGalleryId = currentImage?.galleries?.[0]?.galleryId ?? selectedGalleryId ?? null;
			const result = await updateImageMetadata(imageId, {
				name: params.name,
				description: params.description,
				gallery: params.galleryId,
			});
			if (!result.ok) throw new Error(result.error);

			// Evict old gallery, new gallery, and ungrouped caches
			setImageCache((prev) => {
				const next = { ...prev };
				if (originalGalleryId) delete next[originalGalleryId];
				if (params.galleryId) delete next[params.galleryId];
				delete next[UNGROUPED_KEY];
				return next;
			});
			setCurrentImage(null);

			// Stay on current gallery if it's still the new assignment
			const currentInNew =
				selectedGalleryId === params.galleryId ||
				(selectedGalleryId === null && !params.galleryId);

			setStartImageId(imageId);
			if (currentInNew) {
				void loadImages(selectedGalleryId, true);
			} else {
				setSelectedGalleryId(params.galleryId);
				void loadImages(params.galleryId, true);
			}
			toast.success("Image updated");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
		}
	};

	const handleDelete = async (imageId: string) => {
		setIsLoading(true);
		try {
			const result = await deleteImage(imageId);
			if (!result.ok) throw new Error(result.error);
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
						SnapiX Gallery SDK Server Client Simple
					</span>
				</h1>
				<p className="text-sm text-muted-foreground">
					Gallery &amp; image management powered by SnapiX SDK
				</p>
			</div>

			<div className="flex flex-col gap-2">
				{/* Row 1: Gallery actions */}
				<div className="flex flex-wrap items-center gap-3">
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
				<div className="flex flex-wrap items-center gap-3">
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

			{isUploading && (
				<div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm">
					<Progress value={uploadProgress} className="rounded-none" />
				</div>
			)}
		</div>
	);
}
