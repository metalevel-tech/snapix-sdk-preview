import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const url = request.nextUrl.searchParams.get("url");
	const filename = request.nextUrl.searchParams.get("filename") ?? "image";

	if (!url) {
		return new NextResponse("Missing url parameter", { status: 400 });
	}

	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return new NextResponse("Invalid url", { status: 400 });
	}

	const allowed = process.env.SNAPIX_DOWNLOAD_ALLOWED_HOSTS
		? process.env.SNAPIX_DOWNLOAD_ALLOWED_HOSTS.split(",").map((h) => h.trim())
		: null;

	if (allowed && !allowed.includes(parsed.hostname)) {
		return new NextResponse("URL not allowed", { status: 403 });
	}

	const upstream = await fetch(url);
	if (!upstream.ok) {
		return new NextResponse("Failed to fetch image", { status: 502 });
	}

	const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
	const body = await upstream.arrayBuffer();

	return new NextResponse(body, {
status: 200,
headers: {
"Content-Type": contentType,
"Content-Disposition": `attachment; filename="${filename}"`,
"Cache-Control": "private, max-age=3600",
},
});
}
