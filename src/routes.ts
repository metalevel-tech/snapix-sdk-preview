type RouteData = {
	title: string;
	description: string;
	coverImage: string;
	route: string;
};

export const routeData: RouteData[] = [
	{
		title: "Snapix Gallery V1",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) List and upload images; 2) Associate images to one gallery; 3) Remove images from the gallery; 4) Delete images; 5) Delete galleries, optionally with the associated images.",
		coverImage: "/gallery-v1-cover.png",
		route: "/snapix-gallery-v1"
	},
	{
		title: "Snapix Gallery V2",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) List and upload images; 2) Associate images to multiple galleries; 3) Remove images from galleries; 4) Delete images; 5) Delete galleries, optionally with the associated images.",
		coverImage: "/gallery-v2-cover.png",
		route: "/snapix-gallery-v2"
	},
	{
		title: "Snapix Gallery V2C",
		description: "A demo implementation of the Snapix Gallery SDK showcasing: 1) Only displaying images in galleries with client-side fetching; 2) Prefetch gallery content for fast switching between galleries.",
		coverImage: "/gallery-v2c-cover.png",
		route: "/snapix-gallery-v2c"
	},
];
