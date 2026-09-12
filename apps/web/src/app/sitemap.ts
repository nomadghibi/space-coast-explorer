import type { MetadataRoute } from "next";
import { destinations, tours } from "../lib/content";

const baseUrl = "https://spacecoastexplorer.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const destinationUrls = destinations.map((destination) => ({
    url:
      destination.slug === "space-coast"
        ? `${baseUrl}/space-coast`
        : `${baseUrl}/space-coast/${destination.slug}`,
    lastModified: new Date("2026-09-12")
  }));

  const tourUrls = tours.map((tour) => ({
    url: `${baseUrl}/tours/${tour.slug}`,
    lastModified: new Date("2026-09-12")
  }));

  return [
    { url: baseUrl, lastModified: new Date("2026-09-12") },
    { url: `${baseUrl}/tours`, lastModified: new Date("2026-09-12") },
    { url: `${baseUrl}/about`, lastModified: new Date("2026-09-12") },
    { url: `${baseUrl}/privacy`, lastModified: new Date("2026-09-12") },
    ...destinationUrls,
    ...tourUrls
  ];
}
