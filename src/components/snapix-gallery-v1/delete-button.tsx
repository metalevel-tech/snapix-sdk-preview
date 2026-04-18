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
import type { ImageType } from "@metalevel/snapix-sdk-core";

interface DeleteButtonProps {
	currentImage: ImageType | null;
	disabled?: boolean;
	onDelete: (imageId: string) => Promise<void>;
}

export function DeleteButton({
	currentImage,
	disabled = false,
	onDelete,
}: DeleteButtonProps) {
	const [open, setOpen] = React.useState(false);

	const handleConfirm = async () => {
		if (!currentImage) return;
		setOpen(false);
		await onDelete(currentImage.id);
	};

	return (
		<>
			<Button
				variant="destructive"
				disabled={disabled || !currentImage}
				onClick={() => setOpen(true)}
			>
				<Trash2Icon data-icon="inline-start" />
				Delete Image
			</Button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Image</AlertDialogTitle>
						<AlertDialogDescription className='w-full overflow-hidden wrap-break-word'>
							Are you sure you want to delete{" "}
							<strong>{currentImage?.originalName}</strong>? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={handleConfirm}>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog >
		</>
	);
}
