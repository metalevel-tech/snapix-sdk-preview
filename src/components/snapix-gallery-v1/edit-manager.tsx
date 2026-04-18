"use client";

import { Button } from "@/components/ui/button";
import type { GalleryType, ImageType } from "@metalevel/snapix-sdk-core";
import { PencilIcon } from "lucide-react";
import * as React from "react";
import { ImageMetadataDialog } from "./image-metadata-dialog";

interface EditManagerProps {
	galleries: GalleryType[];
	selectedGalleryId: string | null;
	currentImage: ImageType | null;
	disabled?: boolean;
	onEdit: (imageId: string, params: { name: string; description: string; galleryId: string | null }) => Promise<void>;
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
	const [dialogGalleryId, setDialogGalleryId] = React.useState<string | null>(null);

	const handleOpen = () => {
		if (!currentImage) return;
		setName(currentImage.originalName);
		setDescription(currentImage.description ?? "");
		setDialogGalleryId(
			currentImage.galleries?.[0]?.galleryId ?? selectedGalleryId ?? null
		);
		setOpen(true);
	};

	const handleConfirm = async () => {
		if (!currentImage) return;
		setOpen(false);
		await onEdit(currentImage.id, { name, description, galleryId: dialogGalleryId });
	};

	return (
		<>
			<Button
				variant="outline"
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
				confirmDisabled={!name.trim()}
				onConfirm={handleConfirm}
				galleries={galleries}
				galleryId={dialogGalleryId}
				onGalleryIdChange={setDialogGalleryId}
			/>
		</>
	);
}
