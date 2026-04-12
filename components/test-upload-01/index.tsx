"use client";

import * as React from "react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { GallerySelector } from "./gallery-selector";
import { ImageCarousel } from "./image-carousel";
import { UploadManager } from "./upload-manager";
import { DeleteButton } from "./delete-button";
import {
	fetchGalleryImages,
	fetchUngroupedImages,
	uploadImage,
	deleteImage,
} from "./actions";
import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core";
import { UNGROUPED_KEY } from "./constants";

interface Props {
	galleries: GalleryType[];
}

export function SnapixGalleryV1({ galleries }: Props) {
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

	const cacheKey = selectedGalleryId ?? UNGROUPED_KEY;
	const currentImages = imageCache[cacheKey] ?? [];
	const isBusy = isLoading || isUploading;

	const loadImages = async (galleryId: string | null, force = false) => {
		const key = galleryId ?? UNGROUPED_KEY;
		if (!force && imageCache[key] !== undefined) return;
		setIsLoading(true);
		try {
			const images = galleryId
				? await fetchGalleryImages(galleryId)
				: await fetchUngroupedImages();
			setImageCache((prev) => ({ ...prev, [key]: images }));
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
		setSelectedGalleryId(galleryId);
		void loadImages(galleryId);
	};

	const handleUpload = async (formData: FormData) => {
		setIsUploading(true);
		setUploadProgress(5);

		const progressInterval = setInterval(() => {
			setUploadProgress((prev) => Math.min(prev + 10, 85));
		}, 350);

		try {
			await uploadImage(formData);
			clearInterval(progressInterval);
			setUploadProgress(90);

			// Refetch current gallery/ungrouped to show the newly uploaded image
			const key = selectedGalleryId ?? UNGROUPED_KEY;
			const images = selectedGalleryId
				? await fetchGalleryImages(selectedGalleryId)
				: await fetchUngroupedImages();
			setImageCache((prev) => ({ ...prev, [key]: images }));
			setUploadProgress(100);
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

	const handleDelete = async (imageId: string) => {
		setIsLoading(true);
		try {
			await deleteImage(imageId);
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
		<div className="flex min-h-svh flex-col gap-6 p-6 pb-16">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-heading text-2xl font-medium">Test Upload 01</h1>
				<p className="text-sm text-muted-foreground">
					Gallery &amp; image management powered by SnapiX SDK
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-3 max-w-prose">
				<GallerySelector
					galleries={galleries}
					value={selectedGalleryId}
					onValueChange={handleGalleryChange}
					disabled={isBusy}
				/>
				<UploadManager
					selectedGalleryId={selectedGalleryId}
					isUploading={isUploading}
					disabled={isBusy}
					onUpload={handleUpload}
				/>
				<DeleteButton
					currentImage={currentImage}
					disabled={isBusy}
					onDelete={handleDelete}
				/>
			</div>

			<div className="flex-1">
				<ImageCarousel
					key={cacheKey}
					images={currentImages}
					isLoading={isLoading}
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
