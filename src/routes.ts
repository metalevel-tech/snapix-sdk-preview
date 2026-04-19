
type RouteData = {
	title: string;
	shortDescription: string;
	description: string;
	coverImage: string;
	route: string;
	special: boolean;
};

export const routeData: RouteData[] = [
	{
		title: "Snapix Gallery V1",
		shortDescription: "SnapiX Gallery V1 Basic Demo Single Gallery Attachment",
		description: "Upload, list, and delete images. Single gallery attachment with image removal and gallery deletion.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/746a4952-10a8-4e1e-a076-3e37cbb6be80-1200x630.webp",
		route: "snapix-gallery-v1",
		special: false,
	},
	{
		title: "Snapix Gallery V2",
		shortDescription: "SnapiX Gallery V2 Full Demo: Upload, Generate, Multi Gallery",
		description: "Upload, generate, and manage images. Multi-gallery attachment with image removal and gallery deletion.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/37af2893-bfcc-476e-8239-7648b1a76800-1200x630.webp",
		route: "snapix-gallery-v2",
		special: true,
	},
	{
		title: "Snapix Gallery V3",
		shortDescription: "SnapiX Gallery V3 Client Side Data Fetch Demo",
		description: "Client-side gallery browsing with prefetching. Display-only mode with fast switching between galleries.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/b7a9c6a5-30d4-4976-a2bd-36ac17c5853c-1200x630.webp",
		route: "snapix-gallery-v3",
		special: false,
	},
	{
		title: "Snapix Convert On The Fly",
		shortDescription: "SnapiX Convert On The Fly Demo",
		description: "Convert images on-the-fly. Dynamic image transformations without storing results on the cloud.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/2afefe98-0255-455b-a146-ae48eb80dd88-1200x630.webp",
		route: "snapix-convert-on-the-fly",
		special: false,

	}
];


type PoweredByData = {
	name: string;
	logoUrl: string;
	url: string;
	logo?: string;
};

export const poweredByData: PoweredByData[] = [
	{
		name: "SnapiX",
		logoUrl: `/assets/snapix-logo-v1.svg`,
		url: "https://snapix.space",
	},
	{
		name: "SDK",
		logoUrl: `/assets/snapix-sdk-logo-v1.svg`,
		url: "https://www.npmjs.com/package/@metalevel/snapix-sdk-core",
	},
	{
		name: "MCP",
		logoUrl: `/assets/snapix-mcp-logo-v1.svg`,
		url: "https://www.npmjs.com/package/@metalevel/snapix-mcp-server",
	},
	{
		name: "Repo",
		logo: "githubLogo",
		logoUrl: `/assets/github-logo.svg`,
		url: "https://github.com/metalevel-tech/snapix-sdk-preview",
	}
];
