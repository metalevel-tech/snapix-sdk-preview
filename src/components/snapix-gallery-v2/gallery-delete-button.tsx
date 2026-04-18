"use client";

import * as React from "react";
import { Trash2Icon } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { GalleryType } from "@metalevel/snapix-sdk-core";

interface GalleryDeleteButtonProps {
	selectedGallery: GalleryType | null;
	disabled?: boolean;
	onDelete: (galleryId: string, deleteImages: boolean) => Promise<void>;
}

export function GalleryDeleteButton({
	selectedGallery,
	disabled = false,
	onDelete,
}: GalleryDeleteButtonProps) {
	const [open, setOpen] = React.useState(false);
	const [deleteImages, setDeleteImages] = React.useState(false);

	const handleOpen = () => {
		setDeleteImages(false);
		setOpen(true);
	};

	const handleConfirm = async () => {
		if (!selectedGallery) return;
		setOpen(false);
		await onDelete(selectedGallery.id, deleteImages);
	};

	return (
		<>
			<Button
				variant="destructive"
				className="border border-destructive/40"
				disabled={disabled || !selectedGallery}
				onClick={handleOpen}
			>
				<Trash2Icon data-icon="inline-start" />
				Delete Gallery
			</Button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Gallery</AlertDialogTitle>
						<AlertDialogDescription className="w-full overflow-hidden wrap-break-word">
							Are you sure you want to delete{" "}
							<strong>{selectedGallery?.name}</strong>? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex items-center gap-2">
						<Checkbox
							id="delete-gallery-images"
							checked={deleteImages}
							onCheckedChange={(checked) =>
								setDeleteImages(checked === true)
							}
						/>
						<label
							htmlFor="delete-gallery-images"
							className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Also permanently delete all images in this gallery
						</label>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
