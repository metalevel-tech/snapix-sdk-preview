"use client";

import { Button } from "@/components/ui/button";
import type { ImageType } from "@metalevel/snapix-sdk-core";
import { ExternalLinkIcon } from "lucide-react";

interface OpenButtonProps {
	currentImage: ImageType | null;
	templateImageUrl: string | null;
	disabled?: boolean;
}

export function OpenButton({
	currentImage,
	templateImageUrl,
	disabled = false,
}: OpenButtonProps) {
	const handleOpen = () => {
		if (!templateImageUrl) return;
		window.open(templateImageUrl, "_blank", "noopener,noreferrer");
	};

	return (
		<Button
			variant="outline"
			className="border-gray-500/40 bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 hover:text-gray-700 dark:border-gray-400/30 dark:bg-gray-500/15 dark:text-gray-400 dark:hover:bg-gray-500/25 dark:hover:text-gray-400"
			disabled={disabled || !currentImage || !templateImageUrl}
			onClick={handleOpen}
		>
			<ExternalLinkIcon data-icon="inline-start" />
			Open
		</Button>
	);
}
