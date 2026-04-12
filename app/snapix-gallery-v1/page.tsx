import { fetchGalleries } from "@/components/snapix-gallery-v1/actions";
import { SnapixGalleryV1 } from "@/components/snapix-gallery-v1";

export default async function Page() {
	const galleries = await fetchGalleries();
	return <SnapixGalleryV1 galleries={galleries} />;
}
