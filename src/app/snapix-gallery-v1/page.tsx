import { SnapixGalleryV1 } from "@/components/snapix-gallery-v1";
import { fetchGalleries } from "@/components/snapix-gallery-v1/actions";

export default async function Page() {
	const result = await fetchGalleries();
	if (!result.ok) throw new Error(result.error);
	return <SnapixGalleryV1 galleries={result.data} />;
}
