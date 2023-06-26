import { z } from "astro:content";
import { codes as languageCodes } from "./_languages";

export const alsoSeeSchema = z.string().or(z.object({ url: z.string(), text: z.string() }));

export const categoryTags = z.enum([
  "pmprocess",
  "pmtools",
  "declaring",
  "13tools",
  "torustech",
  "pmthoughtmap",
  "7coreskills",
  "bridgehouse",
  "otherlanguages",
  "region",
]);

export const site = z.object({
  title: z.string(),
  externalAuthor: z.optional(z.string()),
  expandedTitle: z.optional(z.string()),
  url: z.string(),
  description: z.optional(z.string()),
  lang: z.enum(languageCodes as unknown as readonly [string, ...string[]]).default("en"),
  alsoSee: z.array(alsoSeeSchema).default([]),
  replacedBy: z.optional(z.string()),
  translations: z.array(z.string()).default([]),
  isPlaceholder: z.boolean().default(false),
  categories: z.array(categoryTags).default([]),
});
