import type { CollectionEntry } from "astro:content";
import { useMemo, useCallback, createContext } from "react";

export type Site = CollectionEntry<"sites">;

export type SitesUtils = ReturnType<typeof useSites>;

export const SitesContext = createContext<SitesUtils>(null as unknown as SitesUtils);

export function Provider({ value, children }: { value: Site[]; children: React.ReactNode }) {
  const s = useSites(value);
  return <SitesContext.Provider value={s}>{children}</SitesContext.Provider>;
}

export function imageBySlug(slug: string) {
  return "/assets/sites-thumbnails/" + slug + ".webp";
}

function numberAwareCompare(a: string, b: string) {
  if (a.match(/^[0-9]+/) && b.match(/^[0-9]+/)) {
    const val = parseInt(a) - parseInt(b);
    if (val === 0) {
      return a.replace(/^[0-9]+/, "").localeCompare(b.replace(/^[0-9]+/, ""));
    } else {
      return val;
    }
  } else {
    return a.localeCompare(b);
  }
}

export function useSites(sites: Site[]) {
  const sitesByLetter = useMemo(() => {
    const alphabeticalSites = sites.sort((a, b) => numberAwareCompare(a.slug, b.slug));
    return alphabeticalSites.reduce((all, val) => {
      const firstLetter = val.slug[0];
      const category = isNaN(parseInt(firstLetter)) ? firstLetter.toUpperCase() : "#'s";
      const arr = all.get(category) || [];
      arr.push(val);
      all.set(category, arr);

      return all;
    }, new Map<string, Site[]>());
  }, [sites]);

  const siteBySlug = useMemo(() => {
    return sites.reduce((all, val) => {
      all.set(val.slug, val);
      return all;
    }, new Map<string, Site>());
  }, [sites]);

  const siteToLink = useCallback(
    (siteSlug: string) => {
      const site = siteBySlug.get(siteSlug);
      if (!site) {
        return <span className="px-2 h-8 flex items-center">[[{siteSlug}]]</span>;
      } else {
        return (
          <a href={site.data.url} className="pr-2 flex items-center">
            <img
              src={imageBySlug(siteSlug)}
              alt={site.data.title}
              className="inline-block h-8 w-8 mr-2"
            />
            {site.data.title}
          </a>
        );
      }
    },
    [siteBySlug]
  );

  const replaceSlugsWithLink = useCallback(
    (text: string) => {
      return text.replace(/\[\[([^\[]+)\]\]/g, (_, slug) => {
        const site = siteBySlug.get(slug);
        if (!site) {
          return `[[${slug}]]`;
        }
        return `<a href="${site.data.url}">[[${site.data.title}]]</a>`;
      });
    },
    [siteBySlug]
  );

  const slugToTextLink = useCallback(
    (slug: string) => {
      const site = siteBySlug.get(slug);
      if (!site) {
        return `[[${slug}]]`;
      }
      return <a href={site.data.url}>[[{site.data.title}]]</a>;
    },
    [siteBySlug]
  );

  return {
    imageBySlug: imageBySlug,
    byLetter: sitesByLetter,
    bySlug: siteBySlug,
    toLink: siteToLink,
    linkifySlugsInText: replaceSlugsWithLink,
    linkifySlug: slugToTextLink,
  };
}
