"use client";

import * as React from "react";
import { PencilIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import type { GalleryType } from "@metalevel/snapix-sdk-core";

interface GalleryEditManagerProps {
	selectedGallery: GalleryType | null;
	disabled?: boolean;
	onEdit: (galleryId: string, name: string, isPublic: boolean) => Promise<void>;
}

export function GalleryEditManager({
	selectedGallery,
	disabled = false,
	onEdit,
}: GalleryEditManagerProps) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [isPublic, setIsPublic] = React.useState(false);

	const handleOpen = () => {
		if (!selectedGallery) return;
		setName(selectedGallery.name);
		setIsPublic(selectedGallery.isPublic);
		setOpen(true);
	};

	const handleConfirm = async () => {
		if (!selectedGallery) return;
		setOpen(false);
		await onEdit(selectedGallery.id, name.trim(), isPublic);
	};

	return (
		<>
			<Button
				variant="outline"
				className="border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 hover:text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25 dark:hover:text-amber-400"
				disabled={disabled || !selectedGallery}
				onClick={handleOpen}
			>
				<PencilIcon data-icon="inline-start" />
				Edit
			</Button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Edit Gallery</AlertDialogTitle>
						<AlertDialogDescription>
							Update the name and visibility of this gallery.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="gallery-edit-name" className="text-sm font-medium">
								Gallery Name
							</label>
							<Input
								id="gallery-edit-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && name.trim()) void handleConfirm();
								}}
								placeholder="Gallery name"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="gallery-edit-public"
								checked={isPublic}
								onCheckedChange={(checked) => setIsPublic(checked === true)}
							/>
							<label
								htmlFor="gallery-edit-public"
								className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Make gallery public
							</label>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={!name.trim()}
						>
							Save Changes
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
