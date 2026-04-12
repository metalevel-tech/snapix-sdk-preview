import { fetchGalleries } from "@/components/test-upload-01/actions";
import { SnapixGalleryV1 } from "@/components/test-upload-01";

export default async function Page() {
	const galleries = await fetchGalleries();
	return <SnapixGalleryV1 galleries={galleries} />;
}
