import { SnapixGalleryV2 } from "@/components/snapix-gallery-v2";
import { fetchGalleries } from "@/components/snapix-gallery-v2/actions";

export default async function Page() {
	const galleries = await fetchGalleries();
	return <SnapixGalleryV2 galleries={galleries} />;
}
