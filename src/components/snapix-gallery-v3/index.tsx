"use client";

import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";

import { fetchGalleries, fetchGalleryImages, fetchUngroupedImages } from "./client-sdk";
import { UNGROUPED_KEY } from "./constants";
import { GalleryOpenButton } from "./gallery-open-button";
import { GallerySelector } from "./gallery-selector";
import { ImageCarousel } from "./image-carousel";

export function SnapixGalleryV3() {
	const [galleries, setGalleries] = React.useState<GalleryType[]>([]);
	const [selectedGalleryId, setSelectedGalleryId] = React.useState<string | null>(null);
	const [imageCache, setImageCache] = React.useState<Record<string, ImageType[]>>({});
	const [isLoading, setIsLoading] = React.useState(false);

	const cacheKey = selectedGalleryId ?? UNGROUPED_KEY;
	const selectedGallery = galleries.find((g) => g.id === selectedGalleryId) ?? null;
	const currentImages = imageCache[cacheKey] ?? [];

	// On mount: fetch gallery list, then prefetch all gallery images + ungrouped in parallel.
	React.useEffect(() => {
		const init = async () => {
			setIsLoading(true);
			try {
				const fetchedGalleries = await fetchGalleries();
				setGalleries(fetchedGalleries);

				const allIds = [null, ...fetchedGalleries.map((g) => g.id)];
				const results = await Promise.allSettled(
					allIds.map((id) =>
						id === null ? fetchUngroupedImages() : fetchGalleryImages(id)
					)
				);

				const cacheUpdate: Record<string, ImageType[]> = {};
				allIds.forEach((id, i) => {
					const result = results[i];
					if (result.status === "fulfilled") {
						cacheUpdate[id ?? UNGROUPED_KEY] = result.value;
					}
				});
				setImageCache(cacheUpdate);
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Failed to load galleries");
			} finally {
				setIsLoading(false);
			}
		};
		void init();
	}, []);

	const handleGalleryChange = (galleryId: string | null) => {
		setSelectedGalleryId(galleryId);
	};

	return (
		<div className="flex min-h-svh flex-col gap-6 p-6 pt-2 pb-16 w-full">
			<div className="flex flex-col gap-1.5">
				<h1 className="font-heading text-2xl font-medium flex gap-1 mb-4">
					<Link href="/" className="flex items-center gap-1 text-muted-foreground mr-1 -ml-1.5">
						<ChevronLeft className="size-8 transform" strokeWidth={2} /> Home |
					</Link>
					<span>SnapiX Gallery SDK Browser Client</span>
				</h1>
				<p className="text-sm text-muted-foreground">
					Gallery &amp; image viewer powered by SnapiX SDK
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<GallerySelector
					galleries={galleries}
					value={selectedGalleryId}
					onValueChange={handleGalleryChange}
					disabled={isLoading}
				/>
				<GalleryOpenButton
					selectedGallery={selectedGallery}
					disabled={isLoading}
				/>
			</div>

			<ImageCarousel
				key={cacheKey}
				images={currentImages}
				isLoading={isLoading}
			/>
		</div>
	);
}
