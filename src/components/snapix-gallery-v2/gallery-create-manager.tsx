"use client";

import * as React from "react";
import { FolderPlusIcon } from "lucide-react";
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

interface GalleryCreateManagerProps {
	disabled?: boolean;
	onCreate: (name: string, isPublic: boolean) => Promise<void>;
}

export function GalleryCreateManager({
	disabled = false,
	onCreate,
}: GalleryCreateManagerProps) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [isPublic, setIsPublic] = React.useState(false);

	const handleConfirm = async () => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setOpen(false);
		setName("");
		setIsPublic(false);
		await onCreate(trimmed, isPublic);
	};

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setName("");
			setIsPublic(false);
		}
		setOpen(next);
	};

	return (
		<>
			<Button
				variant="outline"
				className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 hover:text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25 dark:hover:text-emerald-400"
				disabled={disabled}
				onClick={() => setOpen(true)}
			>
				<FolderPlusIcon data-icon="inline-start" />
				New Gallery
			</Button>
			<AlertDialog open={open} onOpenChange={handleOpenChange}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>New Gallery</AlertDialogTitle>
						<AlertDialogDescription>
							Enter a name for the new gallery.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="gallery-create-name" className="text-sm font-medium">
								Gallery Name
							</label>
							<Input
								id="gallery-create-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && name.trim()) void handleConfirm();
								}}
								placeholder="Gallery name"
								autoFocus
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="gallery-create-public"
								checked={isPublic}
								onCheckedChange={(checked) => setIsPublic(checked === true)}
							/>
							<label
								htmlFor="gallery-create-public"
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
							Create
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
