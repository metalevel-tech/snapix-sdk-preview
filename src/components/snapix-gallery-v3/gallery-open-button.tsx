"use client";

import { Button } from "@/components/ui/button";
import { nextPublicSnapixBaseUrl, snapixGalleryUri } from "@metalevel/snapix-sdk-core/browser";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { ExternalLinkIcon } from "lucide-react";

interface GalleryOpenButtonProps {
	selectedGallery: GalleryType | null;
	disabled?: boolean;
}

export function GalleryOpenButton({
	selectedGallery,
	disabled = false,
}: GalleryOpenButtonProps) {
	const isPublic = selectedGallery?.isPublic ?? false;

	const handleOpen = () => {
		if (!selectedGallery) return;
		window.open(
			`${nextPublicSnapixBaseUrl}${snapixGalleryUri}/${selectedGallery.id}`,
			"_blank",
			"noopener,noreferrer"
		);
	};

	return (
		<Button
			variant="outline"
			className="border-gray-500/40 bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 hover:text-gray-700 dark:border-gray-400/30 dark:bg-gray-500/15 dark:text-gray-400 dark:hover:bg-gray-500/25 dark:hover:text-gray-400"
			disabled={disabled || !selectedGallery || !isPublic}
			title={selectedGallery && !isPublic ? "Gallery is not public" : undefined}
			onClick={handleOpen}
		>
			<ExternalLinkIcon data-icon="inline-start" />
			Open
		</Button>
	);
}
