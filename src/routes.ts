type RouteData = {
	title: string;
	shortDescription: string;
	description: string;
	coverImage: string;
	route: string;
};

export const routeData: RouteData[] = [
	{
		title: "Snapix Gallery V1",
		shortDescription: "SnapiX Gallery V1 Basic Demo Single Gallery Attachment",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) List and upload images; 2) Associate images to one gallery; 3) Remove images from the gallery; 4) Delete images; 5) Delete galleries, optionally with the associated images.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/746a4952-10a8-4e1e-a076-3e37cbb6be80-1424x748.webp",
		route: "/snapix-gallery-v1"
	},
	{
		title: "Snapix Gallery V2",
		shortDescription: "SnapiX Gallery V2 Full Demo: Upload, Generate, Multi Gallery",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) List and upload images; 2) Associate images to multiple galleries; 3) Remove images from galleries; 4) Delete images; 5) Delete galleries, optionally with the associated images.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/37af2893-bfcc-476e-8239-7648b1a76800-1408x736.webp",
		route: "/snapix-gallery-v2"
	},
	{
		title: "Snapix Gallery V3",
		shortDescription: "SnapiX Gallery V3 Client Side Data Fetch Demo",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) Only displaying images in galleries with client-side fetching; 2) Prefetch gallery content for fast switching between galleries.",
		coverImage: "https://images.snapix.space/32dcsv4hfaPFcWqPFSm7kougsC3/b7a9c6a5-30d4-4976-a2bd-36ac17c5853c-1200x630.webp",
		route: "/snapix-gallery-v3"
	},
];
