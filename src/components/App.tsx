import type { CollectionEntry } from "astro:content";
import Header from "./Header";
import { useSites } from "../lib/useSites";
import SiteCard from "./SiteCard";

type Site = CollectionEntry<"sites">;

export default function App({ sites }: { sites: Site[] }) {
  const s = useSites(sites);

  return (
    <div className="relative h-screen w-screen bg-slate-600 overflow-y-scroll text-white">
      <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/30"></nav>
      {/* <div className="relative h-screen overflow-hidden pr-12 sm:pr-20">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-right bg-cover bg-[url(/assets/bg.avif)]"></div>
        <Header />
      </div> */}
      <div className="pr-12 sm:pr-20">
        {Array.from(s.byLetter).map(([letter, sites]) => (
          <div className="p-4" key={letter}>
            <h2
              className="text-5xl mb-4 text-center font-black"
              style={{ textShadow: "1px 1px 2px #000" }}
            >
              {letter}
            </h2>
            <div className="grid grid-cols-1 gap-4 max-w-screen-lg mx-auto ">
              {sites.map((site) => (
                <SiteCard key={site.slug} s={s} site={site} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
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
