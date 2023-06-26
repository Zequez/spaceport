import { z } from "astro:content";
import { codes as languageCodes } from "./languages";

export const alsoSeeSchema = z.string().or(z.object({ src: z.string(), text: z.string() }));

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

export const siteSchema = z.object({
  slug: z.string(),
  title: z.string(),
  externalAuthor: z.string(),
  expandedTitle: z.optional(z.string()),
  url: z.string(),
  description: z.optional(z.string()),
  lang: z.enum(languageCodes as unknown as readonly [string, ...string[]]),
  alsoSee: z.array(alsoSeeSchema),
  replacedBy: z.optional(z.string()),
  translations: z.optional(z.array(z.string())),
  isPlaceholder: z.boolean(),
  categories: z.array(categoryTags),
});
