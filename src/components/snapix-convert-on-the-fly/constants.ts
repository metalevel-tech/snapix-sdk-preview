export const UPLOAD_LIMIT_BROWSER = 10 * 1024 * 1024; // 10 MB

export const COVER_IMAGE_URL =
	"https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/2afefe98-0255-455b-a146-ae48eb80dd88-1200x630.webp";

export type AspectRatioOption = { value: string; text: string; };
export type FormatOption = { value: string; text: string; };

export const aspectRatioOptions: AspectRatioOption[] = [
	{ value: "original", text: "Original" },
	{ value: String(21 / 9), text: "21:9" },
	{ value: String(16 / 9), text: "16:9" },
	{ value: String(4 / 3), text: "4:3" },
	{ value: "1", text: "1:1" },
];

export const formatOptions: FormatOption[] = [
	{ value: "webp", text: "WebP" },
	{ value: "png", text: "PNG" },
	{ value: "jpeg", text: "JPEG" },
	{ value: "avif", text: "AVIF" },
];

export const FORMAT_MIME: Record<string, string> = {
	webp: "image/webp",
	png: "image/png",
	jpeg: "image/jpeg",
	avif: "image/avif",
	ico: "image/x-icon",
};
