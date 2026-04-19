"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import {
	UPLOAD_LIMIT_BROWSER,
	COVER_IMAGE_URL,
	aspectRatioOptions,
	formatOptions,
} from "./constants";
import { convertImage } from "./actions";

const DEFAULT_FORMAT = "webp";
const DEFAULT_ASPECT_RATIO = "original";

function formatLabel(v: string) {
	return formatOptions.find((o) => o.value === v)?.text ?? v;
}

function aspectLabel(v: string) {
	return aspectRatioOptions.find((o) => o.value === v)?.text ?? v;
}

export function SnapixConvertOnTheFly() {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
	const [width, setWidth] = React.useState("");
	const [height, setHeight] = React.useState("");
	const [format, setFormat] = React.useState(DEFAULT_FORMAT);
	const [aspectRatio, setAspectRatio] = React.useState(DEFAULT_ASPECT_RATIO);
	const [isConverting, setIsConverting] = React.useState(false);

	// Separate typed-input state to allow free-text filtering in comboboxes
	const [formatTyped, setFormatTyped] = React.useState("");
	const [aspectTyped, setAspectTyped] = React.useState("");

	// Revoke previous object URL on unmount
	React.useEffect(() => {
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > UPLOAD_LIMIT_BROWSER) {
			toast.error("File exceeds the 10 MB limit.");
			e.target.value = "";
			return;
		}

		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleReset = () => {
		if (previewUrl) URL.revokeObjectURL(previewUrl);
		setSelectedFile(null);
		setPreviewUrl(null);
		setWidth("");
		setHeight("");
		setFormat(DEFAULT_FORMAT);
		setAspectRatio(DEFAULT_ASPECT_RATIO);
		setFormatTyped("");
		setAspectTyped("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleConvert = async () => {
		if (!selectedFile) return;
		setIsConverting(true);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			if (width) formData.append("width", width);
			if (height) formData.append("height", height);
			formData.append("format", format);
			formData.append("aspectRatio", aspectRatio);

			const { data, mimeType } = await convertImage(formData);

			// Decode base64 → Blob → trigger download
			const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
			const blob = new Blob([bytes], { type: mimeType });
			const blobUrl = URL.createObjectURL(blob);
			const ext = format === "jpeg" ? "jpg" : format;
			const baseName = selectedFile.name.replace(/\.[^.]+$/, "");
			const a = document.createElement("a");
			a.href = blobUrl;
			a.download = `${baseName}-converted.${ext}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(blobUrl);

			toast.success("Image converted and downloaded.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Conversion failed.");
		} finally {
			setIsConverting(false);
		}
	};

	const displayedFormatValue = formatTyped || formatLabel(format);
	const displayedAspectValue = aspectTyped || aspectLabel(aspectRatio);

	return (
		<div className="flex min-h-svh flex-col gap-6 p-6 pt-2 pb-16 w-full">
			{/* Header */}
			<div className="flex flex-col gap-1.5">
				<h1 className="font-heading text-2xl font-medium flex gap-1 mb-4">
					<Link href="/" className="flex items-center gap-1 text-muted-foreground mr-1 -ml-1.5">
						<ChevronLeft className="size-8" strokeWidth={2} /> Home |
					</Link>
					<span>Convert Image On The Fly</span>
				</h1>
				<p className="text-sm text-muted-foreground">
					Images are converted server-side and downloaded directly - nothing is stored in the cloud. Max file size: 10&nbsp;MB.
				</p>
			</div>

			<div className="flex flex-col gap-4 max-w-full">
				{/* Row 1: Controls */}
				<div className="flex flex-wrap items-center gap-3 w-full *:flex-1">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={handleFileChange}
					/>
					<Button
						variant="outline"
						onClick={() => fileInputRef.current?.click()}
						disabled={isConverting}
						className="min-w-52 overflow-hidden"
					>
						<ImageIcon />
						<span className="truncate">
							{selectedFile ? selectedFile.name : "Select image…"}
						</span>
					</Button>

					<Input
						type="number"
						placeholder="Width"
						className="w-24"
						min={1}
						value={width}
						onChange={(e) => setWidth(e.target.value)}
						disabled={isConverting}
					/>

					<Input
						type="number"
						placeholder="Height"
						className="w-24"
						min={1}
						value={height}
						onChange={(e) => setHeight(e.target.value)}
						disabled={isConverting}
					/>

					{/* Format combobox */}
					<Combobox
						value={format}
						onValueChange={(v) => {
							setFormat(v as string);
							setFormatTyped("");
						}}
						disabled={isConverting}
						itemToStringLabel={(v) => formatLabel(v as string)}
						filter={(v: string, query: string) => {
							if (!query) return true;
							return formatLabel(v).toLowerCase().includes(query.toLowerCase());
						}}
					>
						<ComboboxInput
							placeholder="Format…"
							showClear={false}
							disabled={isConverting}
							className="w-28"
							value={displayedFormatValue}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setFormatTyped(e.target.value)
							}
							onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
								e.target.select()
							}
						/>
						<ComboboxContent>
							<ComboboxList>
								{formatOptions.map((o) => (
									<ComboboxItem
										key={o.value}
										value={o.value}
										onClick={() => setFormatTyped("")}
									>
										{o.text}
									</ComboboxItem>
								))}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>

					{/* Aspect ratio combobox */}
					<Combobox
						value={aspectRatio}
						onValueChange={(v) => {
							setAspectRatio(v as string);
							setAspectTyped("");
						}}
						disabled={isConverting}
						itemToStringLabel={(v) => aspectLabel(v as string)}
						filter={(v: string, query: string) => {
							if (!query) return true;
							return aspectLabel(v).toLowerCase().includes(query.toLowerCase());
						}}
					>
						<ComboboxInput
							placeholder="Aspect ratio…"
							showClear={false}
							disabled={isConverting}
							className="w-36"
							value={displayedAspectValue}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
								setAspectTyped(e.target.value)
							}
							onFocus={(e: React.FocusEvent<HTMLInputElement>) =>
								e.target.select()
							}
						/>
						<ComboboxContent>
							<ComboboxList>
								{aspectRatioOptions.map((o) => (
									<ComboboxItem
										key={o.value}
										value={o.value}
										onClick={() => setAspectTyped("")}
									>
										{o.text}
									</ComboboxItem>
								))}
							</ComboboxList>
						</ComboboxContent>
					</Combobox>
				</div>

				{/* Row 2: Preview */}
				<div className="relative w-full h-96 overflow-hidden rounded-md border border-border bg-muted">
					{previewUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={previewUrl}
							alt="Selected image preview"
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="cursor-pointer relative w-full h-full" onClick={() => fileInputRef.current?.click()}>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-4xl text-orange-500 z-10 uppercase">Select image</div>
							<Image
								src={COVER_IMAGE_URL}
								alt="Placeholder"
								fill
								className="object-cover grayscale-90 opacity-50"
								unoptimized
							/>
						</div>
					)}
				</div>

				{/* Row 3: Actions */}
				<div className="flex items-center gap-3 justify-end">

					<Button
						className='cursor-pointer'
						variant="outline"
						onClick={handleReset}
						disabled={isConverting}
					>
						Reset
					</Button>
					<Button
						className='cursor-pointer'
						onClick={handleConvert}
						disabled={!selectedFile || isConverting}
					>
						{isConverting ? "Converting…" : "Convert & Download"}
					</Button>
				</div>
			</div>
		</div>
	);
}
