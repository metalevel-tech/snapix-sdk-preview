"use client";

import { Button } from "@/components/ui/button";
import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core";
import { PencilIcon } from "lucide-react";
import * as React from "react";
import { fetchImageById } from "./actions";
import { ImageMetadataDialog } from "./image-metadata-dialog";

interface EditManagerProps {
	galleries: GalleryType[];
	selectedGalleryId: string | null;
	currentImage: ImageType | null;
	disabled?: boolean;
	onEdit: (imageId: string, params: { name: string; description: string; galleryIds: string[]; originalGalleryIds: string[]; }) => Promise<void>;
}

export function EditManager({
	galleries,
	selectedGalleryId,
	currentImage,
	disabled = false,
	onEdit,
}: EditManagerProps) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [dialogGalleryIds, setDialogGalleryIds] = React.useState<string[]>([]);
	const [originalGalleryIds, setOriginalGalleryIds] = React.useState<string[]>([]);
	const [isLoadingGalleries, setIsLoadingGalleries] = React.useState(false);

	const handleOpen = () => {
		if (!currentImage) return;
		setName(currentImage.originalName);
		setDescription(currentImage.description ?? "");
		// Seed with what we have immediately (may be partial — API only returns the
		// gallery the image was fetched from, not all galleries it belongs to)
		const provisional =
			currentImage.galleries?.map((g) => g.galleryId) ??
			(selectedGalleryId ? [selectedGalleryId] : []);
		setDialogGalleryIds(provisional);
		setOriginalGalleryIds(provisional);
		setOpen(true);
		// Fetch complete gallery membership in the background
		setIsLoadingGalleries(true);
		fetchImageById(currentImage.id)
			.then((img) => {
				const fullIds = img.galleries?.map((g) => g.galleryId) ?? [];
				setDialogGalleryIds(fullIds);
				setOriginalGalleryIds(fullIds);
			})
			.catch(() => { /* keep provisional data on error */ })
			.finally(() => setIsLoadingGalleries(false));
	};

	const handleConfirm = async () => {
		if (!currentImage) return;
		setOpen(false);
		await onEdit(currentImage.id, { name, description, galleryIds: dialogGalleryIds, originalGalleryIds });
	};

	return (
		<>
			<Button
				variant="outline"
				className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25 dark:hover:text-amber-400"
				disabled={disabled || !currentImage}
				onClick={handleOpen}
			>
				<PencilIcon data-icon="inline-start" />
				Edit Image
			</Button>
			<ImageMetadataDialog
				open={open}
				onOpenChange={setOpen}
				title="Edit Image"
				dialogDescription="Update the name, description, or gallery of this image."
				confirmLabel="Save Changes"
				name={name}
				onNameChange={setName}
				imageDescription={description}
				onImageDescriptionChange={setDescription}
				confirmDisabled={isLoadingGalleries || !name.trim()}
				onConfirm={handleConfirm}
				galleries={galleries}
				galleryIds={dialogGalleryIds}
				onGalleryIdsChange={setDialogGalleryIds}
			/>
		</>
	);
}
