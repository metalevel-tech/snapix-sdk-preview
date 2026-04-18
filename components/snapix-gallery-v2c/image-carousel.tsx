"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import type { ImageType } from "@metalevel/snapix-sdk-core";
import { ChevronLeft, ChevronRight, Loader2Icon } from "lucide-react";
import * as React from "react";
import { Skeleton } from "../ui/skeleton";

// The actual REST API metadata shape differs from the SDK types:
// real: { objectKey: string | null, fileExtension: string, imageInfo: { type, width, height } }
// SDK types say: { key, format, width, height } — which are wrong
type RawMeta = {
	objectKey: string | null;
	fileExtension: string;
	imageInfo: { type: string; width: number; height: number; };
	size: number;
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

interface ImageCarouselProps {
	images: ImageType[];
	isLoading: boolean;
	startIndex?: number;
}

export function ImageCarousel({
	images,
	isLoading,
	startIndex = 0,
}: ImageCarouselProps) {
	const [current, setCurrent] = React.useState(0);
	const [failedImages, setFailedImages] = React.useState<Set<string>>(new Set());

	const handleImageError = React.useCallback((imageId: string | undefined) => {
		if (imageId) {
			setFailedImages((prev) => new Set(prev).add(imageId));
		}
	}, []);

	// When images array changes, jump to startIndex (default 0)
	React.useEffect(() => {
		const idx = Math.min(startIndex, Math.max(images.length - 1, 0));
		setCurrent(idx);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [images]);

	const goToPrevious = React.useCallback(() => {
		setCurrent((prev) => {
			const next = prev === 0 ? images.length - 1 : prev - 1;
			return next;
		});
	}, [images.length]);

	const goToNext = React.useCallback(() => {
		setCurrent((prev) => {
			const next = prev === images.length - 1 ? 0 : prev + 1;
			return next;
		});
	}, [images.length]);

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3 max-w-prose">
				<Skeleton >
					<AspectRatio
						ratio={16 / 9}
						className="overflow-hidden rounded bg-muted flex items-center justify-center"
					>
						<Loader2Icon className="size-20 animate-spin text-muted-foreground" />
					</AspectRatio>
				</Skeleton>
				<div className="flex gap-3">
					<Skeleton className="h-10 w-10" />
					<div className="flex gap-2 flex-col grow">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-1/4" />
					</div>
					<Skeleton className="h-10 w-10" />
				</div>
			</div>
		);
	}

	if (images.length === 0) {
		return (
			<div className="flex flex-col gap-3 max-w-prose">
				<p className="text-sm text-muted-foreground">
					No images found in this gallery.
				</p>
			</div>
		);
	}

	const currentImage = images[current];
	const src = getBestVariantUrl(currentImage);
	const isFailed = failedImages.has(currentImage.id ?? String(current));

	return (
		<div className="flex flex-col gap-3 max-w-prose">
			<div className="max-w-full">
				<AspectRatio
					ratio={16 / 9}
					className="overflow-hidden rounded-md bg-muted"
				>
					{src && !isFailed ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={src}
							alt={currentImage.originalName}
							className="w-full h-full object-cover"
							onError={() => handleImageError(currentImage.id)}
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full bg-muted">
							<p className="text-sm text-muted-foreground">
								{isFailed ? "Failed to load image" : "No image variant found"}
							</p>
						</div>
					)}
				</AspectRatio>
			</div>

			{/* Controls: Previous Button, Info, Next Button */}
			<div className="max-w-full flex items-center gap-3">
				<Button
					variant="default"
					size="icon"
					className="shrink-0 cursor-pointer w-10 h-10"
					onClick={goToPrevious}
					disabled={images.length <= 1}
				>
					<ChevronLeft className="size-8 transform -translate-x-0.5" strokeWidth={3} />
				</Button>

				{currentImage && (
					<div className="flex-1 min-w-0">
						<p className="truncate text-sm font-medium">{currentImage.originalName}</p>
						<p className="text-sm text-muted-foreground">
							{current + 1} / {images.length}
						</p>
					</div>
				)}

				<Button
					variant="default"
					size="icon"
					className="shrink-0 cursor-pointer w-10 h-10"
					onClick={goToNext}
					disabled={images.length <= 1}
				>
					<ChevronRight className="size-8 transform translate-x-0.5" strokeWidth={3} />
				</Button>
			</div>

			{/* Description section */}
			{currentImage && currentImage.description && (
				<div className="max-w-full">
					<p className="text-sm">
						Description: {currentImage.description}
					</p>
				</div>
			)}
		</div>
	);
}
