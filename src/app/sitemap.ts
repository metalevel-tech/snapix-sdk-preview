import { type MetadataRoute } from "next";

import { BASE_URL } from "@/constants";
import { routeData } from "@/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const galleryPages: MetadataRoute.Sitemap = routeData.map((r) => ({
    url: `${BASE_URL}${r.route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...galleryPages,
  ];
}
