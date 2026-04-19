"use server";

import { SnapixApiError, SnapixClientServer } from "@metalevel/snapix-sdk-core";
import { FORMAT_MIME } from "./constants";

const client = new SnapixClientServer();

type ActionResult<T> = { ok: true; data: T; } | { ok: false; error: string; };

export async function convertImage(
	formData: FormData
): Promise<ActionResult<{ data: string; mimeType: string; }>> {
	const file = formData.get("file") as File;
	const width = formData.get("width") as string | null;
	const height = formData.get("height") as string | null;
	const format = (formData.get("format") as string) || "webp";
	const aspectRatioStr = formData.get("aspectRatio") as string | null;

	const arrayBuffer = await file.arrayBuffer();
	const imageBase64 = Buffer.from(arrayBuffer).toString("base64");

	// Sniff content-type from magic bytes if the browser didn't provide one.
	let imageContentType = file.type;
	if (!imageContentType) {
		const h = new Uint8Array(arrayBuffer.slice(0, 12));
		if (h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46) {
			imageContentType = "image/webp";
		} else if (h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47) {
			imageContentType = "image/png";
		} else if (h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff) {
			imageContentType = "image/jpeg";
		} else if (h[0] === 0x47 && h[1] === 0x49 && h[2] === 0x46) {
			imageContentType = "image/gif";
		} else if (h[4] === 0x66 && h[5] === 0x74 && h[6] === 0x79 && h[7] === 0x70) {
			imageContentType = "image/avif";
		} else {
			imageContentType = "application/octet-stream";
		}
	}

	const resizeOptions: Record<string, unknown> | undefined =
		width || height
			? {
				...(width ? { width: parseInt(width, 10) } : {}),
				...(height ? { height: parseInt(height, 10) } : {}),
			}
			: undefined;

	const ratio =
		aspectRatioStr && aspectRatioStr !== "original"
			? parseFloat(aspectRatioStr)
			: undefined;

	try {
		console.log(format, resizeOptions, ratio);
		const buffer = await client.convertImage({
			imageBase64,
			imageContentType,
			formatOptions: { format },
			resizeOptions,
			ratio,
		});

		const mimeType = FORMAT_MIME[format] ?? "application/octet-stream";
		return {
			ok: true,
			data: { data: Buffer.from(buffer).toString("base64"), mimeType },
		};
	} catch (err) {
		if (err instanceof SnapixApiError) {
			return { ok: false, error: `Conversion failed: ${err.message}` };
		}
		return { ok: false, error: err instanceof Error ? err.message : "Conversion failed" };
	}
}
