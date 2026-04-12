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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
}: ImageMetadataDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="flex flex-col gap-3">
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
