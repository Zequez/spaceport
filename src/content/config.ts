// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

import { site } from "./_schemas";

// 2. Define your collection(s)
export const sitesCollection = defineCollection({
  type: "content",
  schema: site,
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  sites: sitesCollection,
};
