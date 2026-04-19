import pkgJson from "../package.json";

const rawName = pkgJson.name; // "@metalevel/snapix-sdk-preview"

const formatName = (name: string) =>
  name
    .replace(/^@[^/]+\//, "") // strip @scope/ prefix
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const APP_NAME = formatName(rawName) ?? "Snapix SDK Preview";
export const APP_DESCRIPTION =
  pkgJson.description ??
  "Interactive preview and test app for @metalevel/snapix-sdk-core and future Snapix SDK variants";
export const APP_AUTHOR = pkgJson.author?.name ?? "pa4080";
export const APP_AUTHOR_URL = pkgJson.author?.url ?? "https://github.com/metalevel-tech/snapix-sdk-preview";
export const BASE_URL = pkgJson.homepage ?? "https://sdk-preview.snapix.space";

export const OG_IMAGE = `/assets/snapix_og-image_1200x630.jpeg`;
export const OG_IMAGE_ALT = `${APP_NAME} - Interactive SDK Preview`;
export const META_TITLE = `${APP_NAME} - Interactive SDK Demo`;
export const META_DESCRIPTION = APP_DESCRIPTION;
