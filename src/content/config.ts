// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// 2. Define your collection(s)
export const creationsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    link: z.optional(z.string()),
    sourceLink: z.optional(z.string()),
    images: z.array(z.string()),
    tags: z.array(z.string()),
    isPublished: z.boolean(),
    isOnline: z.boolean(),
    date: z.optional(z.date()),
    dateStart: z.optional(z.date()),
    dateEnd: z.optional(z.date()),
    description: z.string(),
    language: z.array(z.string()),
    creationType: z.enum(["video", "collaboration", "software", "writing"]),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  creations: creationsCollection,
};
