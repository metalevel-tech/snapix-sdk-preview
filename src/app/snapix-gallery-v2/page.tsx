import { SnapixGalleryV2 } from "@/components/snapix-gallery-v2";
import { fetchGalleries } from "@/components/snapix-gallery-v2/actions";

export default async function Page() {
	const result = await fetchGalleries();
	if (!result.ok) throw new Error(result.error);
	return <SnapixGalleryV2 galleries={result.data} />;
}
