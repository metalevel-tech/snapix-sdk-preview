"use client";

import { Button } from "@/components/ui/button";
import type { ImageType } from "@metalevel/snapix-sdk-core";
import { DownloadIcon } from "lucide-react";

interface DownloadButtonProps {
	currentImage: ImageType | null;
	templateImageUrl: string | null;
	disabled?: boolean;
}

export function DownloadButton({
	currentImage,
	templateImageUrl,
	disabled = false,
}: DownloadButtonProps) {
	const handleDownload = () => {
		if (!templateImageUrl || !currentImage) return;

		// Derive extension from the variant URL objectKey (e.g. "…/abc.webp")
		// in case originalName was stored without one (extension-less upload).
		const IMAGE_EXTS = ["webp", "avif", "jpg", "jpeg", "png", "gif"];
		const urlExt = templateImageUrl.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
		const baseName = currentImage.originalName;
		const hasExt = IMAGE_EXTS.some((e) => baseName.toLowerCase().endsWith(`.${e}`));
		const filename =
			hasExt || !IMAGE_EXTS.includes(urlExt) ? baseName : `${baseName}.${urlExt}`;

		const proxyUrl =
			`/api/download?` +
			`url=${encodeURIComponent(templateImageUrl)}&` +
			`filename=${encodeURIComponent(filename)}`;
		const a = document.createElement("a");
		a.href = proxyUrl;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	return (
		<Button
			variant="outline"
			className="border-gray-500/40 bg-gray-500/10 text-gray-700 hover:bg-gray-500/20 hover:text-gray-700 dark:border-gray-400/30 dark:bg-gray-500/15 dark:text-gray-400 dark:hover:bg-gray-500/25 dark:hover:text-gray-400"
			disabled={disabled || !currentImage || !templateImageUrl}
			onClick={handleDownload}
		>
			<DownloadIcon data-icon="inline-start" />
			Download
		</Button>
	);
}
