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
	onUpload: (formData: FormData, targetGalleryIds: string[]) => Promise<void>;
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
	const [dialogGalleryIds, setDialogGalleryIds] = React.useState<string[]>([]);

	const handlePickFile = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;
		setFile(selected);
		setName(selected.name.replace(/\.[^.]+$/, ""));
		setDescription("");
		setDialogGalleryIds(selectedGalleryId ? [selectedGalleryId] : []);
		setOpen(true);
		e.target.value = "";
	};

	const handleConfirm = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("description", description);
		dialogGalleryIds.forEach((id) => formData.append("galleryId", id));
		setOpen(false);
		await onUpload(formData, dialogGalleryIds);
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
				className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25 dark:hover:text-emerald-400"
				disabled={disabled || isUploading}
				onClick={handlePickFile}
			>
				<UploadIcon data-icon="inline-start" />
				Upload Image
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
				galleryIds={dialogGalleryIds}
				onGalleryIdsChange={setDialogGalleryIds}
			/>
		</>
	);
}
