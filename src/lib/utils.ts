import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Browser MIME detection is extension-based; extension-less files get file.type = "".
// ?? won't catch empty string, so sniff magic bytes as fallback.
export function detectImageContentType(
  browserType: string,
  arrayBuffer: ArrayBuffer
): string {
  if (browserType) return browserType;
  const h = new Uint8Array(arrayBuffer.slice(0, 12));
  if (h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46) return "image/webp";
  if (h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47) return "image/png";
  if (h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff) return "image/jpeg";
  if (h[0] === 0x47 && h[1] === 0x49 && h[2] === 0x46) return "image/gif";
  if (h[4] === 0x66 && h[5] === 0x74 && h[6] === 0x79 && h[7] === 0x70) return "image/avif";
  return "application/octet-stream";
}
