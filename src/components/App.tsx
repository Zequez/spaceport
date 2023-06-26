import type { CollectionEntry } from "astro:content";
import { useMemo } from "react";
import Header from "./Header";

type Site = CollectionEntry<"sites">;

function imageBySlug(slug: string) {
  return "/assets/sites-thumbnails/" + slug + ".webp";
}

function numberAwareCompare(a: string, b: string) {
  console.log(a, a.match(/^[0-9]+/));
  if (a.match(/^[0-9]+/) && b.match(/^[0-9]+/)) {
    console.log("Number aware compar!", a, b);
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

export default function App({ sites }: { sites: Site[] }) {
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

  function siteToLink(siteSlug: string) {
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
  }

  function replaceSlugWithLink(text: string) {
    return text.replace(/\[\[([^\[]+)\]\]/g, (_, slug) => {
      const site = siteBySlug.get(slug);
      if (!site) {
        return `[[${slug}]]`;
      }
      return `<a href="${site.data.url}">[[${site.data.title}]]</a>`;
    });
  }

  function siteToTextLink(slug: string) {
    const site = siteBySlug.get(slug);
    if (!site) {
      return `[[${slug}]]`;
    }
    return <a href={site.data.url}>[[{site.data.title}]]</a>;
  }

  return (
    <div className="relative h-screen w-screen bg-slate-600 overflow-y-scroll text-white">
      <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/30"></nav>
      {/* <div className="relative h-screen overflow-hidden pr-12 sm:pr-20">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-right bg-cover bg-[url(/assets/bg.avif)]"></div>
        <Header />
      </div> */}
      <div className="pr-12 sm:pr-20">
        {Array.from(sitesByLetter).map(([letter, sites]) => (
          <div className="p-4">
            <h2
              className="text-5xl mb-4 text-center font-black"
              style={{ textShadow: "1px 1px 2px #000" }}
            >
              {letter}
            </h2>
            <div className="grid grid-cols-1 gap-4 max-w-screen-lg mx-auto ">
              {sites.map(renderSite)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function renderSite(site: Site) {
    return (
      <div
        key={site.id}
        className="border bg-white/90 overflow-hidden text-black/80 border-white/20 rounded-md flex shadow-md"
      >
        <a href={site.data.url} className="flex-shrink-0">
          <img
            className="h-40"
            src={site.data.replacedBy ? "/assets/moved.webp" : imageBySlug(site.slug)}
          />
        </a>
        <div>
          <h3
            className="text-3xl font-bold tracking-wider px-2 py-1 text-gray-600"
            style={{ textShadow: "0 1px #fff" }}
          >
            {site.data.title}
          </h3>
          {site.data.replacedBy ? (
            <div className="px-2 mb-4 markdown">
              <strong>NOTE:</strong> The website has been moved to{" "}
              {siteToTextLink(site.data.replacedBy)}
            </div>
          ) : null}
          {site.data.categories.length ? (
            <div className="px-2 mb-4">
              {site.data.categories.map((cat) => (
                <span>{cat}</span>
              ))}
            </div>
          ) : null}
          {site.body ? (
            <div
              className="mx-2 p-2 rounded-md shadow-inner border border-gray-300 mb-2 markdown bg-white/50"
              dangerouslySetInnerHTML={{ __html: replaceSlugWithLink(site.body) }}
            ></div>
          ) : null}
          {site.data.alsoSee.length ? (
            <div className="px-2">
              <div className="font-bold tracking-wider text-gray-600 mb-2">See also</div>
              <div className="flex flex-wrap">
                {site.data.alsoSee.map((otherSite) => (
                  <div className="bg-black/10 rounded-sm overflow-hidden border border-gray-400 mb-2 mr-2">
                    {typeof otherSite === "string" ? (
                      siteToLink(otherSite)
                    ) : (
                      <a href={otherSite.url}>otherSite.text</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function renderCategories(cat: string) {}
}

const categoriesMap = {
  pmprocess: "PM Process",
  pmtools: "PM Tools",
  declaring: "Declaring",
  "13tools": "13 Tools",
  torustech: "Torus Technology process",
  pmthoughtmap: "PM Thoughtmap",
  "7coreskills": "7 Core Skills",
  bridgehouse: "",
  otherlanguages: "",
  region: "",
};
