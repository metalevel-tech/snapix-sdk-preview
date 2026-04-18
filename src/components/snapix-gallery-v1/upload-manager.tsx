"use client";

import { Button } from "@/components/ui/button";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { UploadIcon } from "lucide-react";
import * as React from "react";
import { ImageMetadataDialog } from "./image-metadata-dialog";

interface UploadManagerProps {
	galleries: GalleryType[];
	selectedGalleryId: string | null;
	isUploading: boolean;
	disabled?: boolean;
	onUpload: (formData: FormData, targetGalleryId: string | null) => Promise<void>;
}

export function UploadManager({
	galleries,
	selectedGalleryId,
	isUploading,
	disabled = false,
	onUpload,
}: UploadManagerProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [file, setFile] = React.useState<File | null>(null);
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [dialogGalleryId, setDialogGalleryId] = React.useState<string | null>(null);

	const handlePickFile = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;
		setFile(selected);
		setName(selected.name.replace(/\.[^.]+$/, ""));
		setDescription("");
		setDialogGalleryId(selectedGalleryId);
		setOpen(true);
		e.target.value = "";
	};

	const handleConfirm = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("description", description);
		if (dialogGalleryId) formData.append("galleryId", dialogGalleryId);
		setOpen(false);
		await onUpload(formData, dialogGalleryId);
	};

	return (
		<>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>
			<Button
				variant="outline"
				disabled={disabled || isUploading}
				onClick={handlePickFile}
			>
				<UploadIcon data-icon="inline-start" />
				Pick & Upload Image
			</Button>
			<ImageMetadataDialog
				open={open}
				onOpenChange={setOpen}
				title="Upload Image"
				dialogDescription="Are you sure you want to upload this image?"
				confirmLabel="Upload"
				name={name}
				onNameChange={setName}
				imageDescription={description}
				onImageDescriptionChange={setDescription}
				onConfirm={handleConfirm}
				galleries={galleries}
				galleryId={dialogGalleryId}
				onGalleryIdChange={setDialogGalleryId}
			/>
		</>
	);
}
