"use client";

import * as React from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageMetadataDialog } from "./image-metadata-dialog";
import type { ImageType } from "@metalevel/snapix-sdk-core";

interface EditManagerProps {
	currentImage: ImageType | null;
	disabled?: boolean;
	onEdit: (imageId: string, params: { name: string; description: string; }) => Promise<void>;
}

export function EditManager({
	currentImage,
	disabled = false,
	onEdit,
}: EditManagerProps) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");

	const handleOpen = () => {
		if (!currentImage) return;
		setName(currentImage.originalName);
		setDescription(currentImage.description ?? "");
		setOpen(true);
	};

	const handleConfirm = async () => {
		if (!currentImage) return;
		setOpen(false);
		await onEdit(currentImage.id, { name, description });
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
				dialogDescription="Update the name or description of this image."
				confirmLabel="Save Changes"
				name={name}
				onNameChange={setName}
				imageDescription={description}
				onImageDescriptionChange={setDescription}
				onConfirm={handleConfirm}
			/>
		</>
	);
}
