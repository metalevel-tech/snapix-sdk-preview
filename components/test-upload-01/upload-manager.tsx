"use client";

import * as React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageMetadataDialog } from "./image-metadata-dialog";

interface UploadManagerProps {
	selectedGalleryId: string | null;
	isUploading: boolean;
	disabled?: boolean;
	onUpload: (formData: FormData) => Promise<void>;
}

export function UploadManager({
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

	const handlePickFile = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		if (!selected) return;
		setFile(selected);
		setName(selected.name.replace(/\.[^.]+$/, ""));
		setDescription("");
		setOpen(true);
		e.target.value = "";
	};

	const handleConfirm = async () => {
		if (!file) return;
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", name);
		formData.append("description", description);
		if (selectedGalleryId) {
			formData.append("galleryId", selectedGalleryId);
		}
		setOpen(false);
		await onUpload(formData);
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
			/>
		</>
	);
}
