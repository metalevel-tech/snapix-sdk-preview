"use client";

import * as React from "react";
import { UploadIcon } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Upload Image</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to upload this image?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="upload-name" className="text-sm font-medium">
								Image Name
							</label>
							<Input
								id="upload-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Image name"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label htmlFor="upload-description" className="text-sm font-medium">
								Description{" "}
								<span className="font-normal text-muted-foreground">
									(optional)
								</span>
							</label>
							<Input
								id="upload-description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Add a description..."
							/>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={!name.trim()}
						>
							Upload
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
