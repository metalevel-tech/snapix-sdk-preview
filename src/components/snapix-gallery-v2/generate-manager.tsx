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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GalleryType } from "@metalevel/snapix-sdk-core";
import { SparklesIcon } from "lucide-react";
import * as React from "react";
import { GalleryMultiSelector } from "./gallery-multi-selector";

interface GenerateManagerProps {
	galleries: GalleryType[];
	selectedGalleryId: string | null;
	templateImageUrl: string | null;
	disabled?: boolean;
	onGenerate: (params: {
		name: string;
		prompt: string;
		galleryIds: string[];
		imageUrl?: string;
	}) => Promise<void>;
}

export function GenerateManager({
	galleries,
	selectedGalleryId,
	templateImageUrl,
	disabled = false,
	onGenerate,
}: GenerateManagerProps) {
	const [open, setOpen] = React.useState(false);
	const [name, setName] = React.useState("");
	const [prompt, setPrompt] = React.useState("");
	const [dialogGalleryIds, setDialogGalleryIds] = React.useState<string[]>([]);
	const [useAsTemplate, setUseAsTemplate] = React.useState(false);

	const handleOpen = () => {
		setName("");
		setPrompt("");
		setDialogGalleryIds(selectedGalleryId ? [selectedGalleryId] : []);
		setUseAsTemplate(templateImageUrl !== null);
		setOpen(true);
	};

	const handleConfirm = async () => {
		setOpen(false);
		await onGenerate({
			name,
			prompt,
			galleryIds: dialogGalleryIds,
			imageUrl: useAsTemplate && templateImageUrl ? templateImageUrl : undefined,
		});
	};

	return (
		<>
			<Button
				variant="outline"
				className="border-blue-500/40 bg-blue-500/10 text-blue-700 hover:bg-blue-500/20 hover:text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25 dark:hover:text-blue-400"
				disabled={disabled}
				onClick={handleOpen}
			>
				<SparklesIcon data-icon="inline-start" />
				Generate Image
			</Button>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Generate Image</AlertDialogTitle>
						<AlertDialogDescription>
							Describe the image to generate. The description is used as the AI
							prompt.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="generate-prompt"
								className="text-sm font-medium"
							>
								Prompt
							</label>
							<Textarea
								id="generate-prompt"
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder="Describe the image to generate..."
								rows={3}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="generate-name"
								className="text-sm font-medium"
							>
								Image Name{" "}
								<span className="font-normal text-muted-foreground">
									(optional)
								</span>
							</label>
							<Input
								id="generate-name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Image name"
							/>
						</div>
						{galleries.length > 0 && (
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-medium">Galleries</label>
								<GalleryMultiSelector
									galleries={galleries}
									values={dialogGalleryIds}
									onValuesChange={setDialogGalleryIds}
								/>
							</div>
						)}
						<div className="flex items-center gap-2">
							<Checkbox
								id="generate-use-template"
								checked={useAsTemplate}
								onCheckedChange={(checked) =>
									setUseAsTemplate(Boolean(checked))
								}
								disabled={!templateImageUrl}
							/>
							<label
								htmlFor="generate-use-template"
								className="text-sm font-medium select-none"
								style={{ opacity: templateImageUrl ? undefined : 0.5 }}
							>
								Use current image as template
							</label>
						</div>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirm}
							disabled={!prompt.trim()}
						>
							Generate
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
