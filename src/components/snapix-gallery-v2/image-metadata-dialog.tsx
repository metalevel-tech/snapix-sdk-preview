"use client";

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
import { Textarea } from "@/components/ui/textarea";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { ImageIcon, XIcon } from "lucide-react";
import { GalleryMultiSelector } from "./gallery-multi-selector";

interface ImageMetadataDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	dialogDescription: string;
	confirmLabel: string;
	name: string;
	onNameChange: (value: string) => void;
	imageDescription: string;
	onImageDescriptionChange: (value: string) => void;
	onConfirm: () => void;
	confirmDisabled?: boolean;
	galleries?: GalleryType[];
	galleryIds?: string[];
	onGalleryIdsChange?: (ids: string[]) => void;
	replacementFile?: File | null;
	onReplaceFileClick?: () => void;
	onReplaceFileClear?: () => void;
}

export function ImageMetadataDialog({
	open,
	onOpenChange,
	title,
	dialogDescription,
	confirmLabel,
	name,
	onNameChange,
	imageDescription,
	onImageDescriptionChange,
	onConfirm,
	confirmDisabled,
	galleries,
	galleryIds,
	onGalleryIdsChange,
	replacementFile,
	onReplaceFileClick,
	onReplaceFileClear,
}: ImageMetadataDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="overflow-hidden">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col gap-3 max-w-full overflow-hidden">
					<div className="flex flex-col gap-1.5">
						<label htmlFor="metadata-name" className="text-sm font-medium">
							Image Name
						</label>
						<Input
							id="metadata-name"
							value={name}
							onChange={(e) => onNameChange(e.target.value)}
							placeholder="Image name"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="metadata-description"
							className="text-sm font-medium"
						>
							Description{" "}
							<span className="font-normal text-muted-foreground">
								(optional)
							</span>
						</label>
						<Textarea
							id="metadata-description"
							value={imageDescription}
							onChange={(e) => onImageDescriptionChange(e.target.value)}
							placeholder="Add a description..."
							rows={3}
						/>
					</div>
					{galleries && onGalleryIdsChange && (
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium">Galleries</label>
							<GalleryMultiSelector
								galleries={galleries}
								values={galleryIds ?? []}
								onValuesChange={onGalleryIdsChange}
							/>
						</div>
					)}
					{onReplaceFileClick && (
						<div className="flex flex-col gap-1.5 max-w-full">
							<label className="text-sm font-medium">
								Replace Image File{" "}
								<span className="font-normal text-muted-foreground">
									(optional)
								</span>
							</label>
							{replacementFile ? (
								<div className="flex items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
									<ImageIcon className="size-4 shrink-0 text-muted-foreground" />
									<span className="flex-1 truncate text-foreground">
										{replacementFile.name}
									</span>
									<button
										type="button"
										onClick={onReplaceFileClear}
										className="shrink-0 text-muted-foreground hover:text-foreground"
										aria-label="Clear selected file"
									>
										<XIcon className="size-4" />
									</button>
								</div>
							) : (
								<Button
									type="button"
									variant="outline"
									className="w-full justify-start gap-2 text-muted-foreground"
									onClick={onReplaceFileClick}
								>
									<ImageIcon className="size-4" />
									Choose a new image file…
								</Button>
							)}
						</div>
					)}
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={confirmDisabled ?? !name.trim()}
					>
						{confirmLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
