import type { CollectionEntry } from "astro:content";
import Header from "./Header";
import { useRef, useEffect, useState } from "react";
import { useSites } from "../lib/useSites";
import SiteCard from "./SiteCard";

type Site = CollectionEntry<"sites">;

export default function App({ sites }: { sites: Site[] }) {
  const s = useSites(sites);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollLettersSpace = useRef<HTMLDivElement>(null);
  // const [letterHeight, setLetterHeight] = useState();

  // useEffect(() => {
  //   scr
  // }, [])

  function handleScroll() {
    console.log("Scrolling");
  }

  const lettersEntries = Array.from(s.byLetter);

  return (
    <div
      className="relative bg-slate-600 text-white"
      // ref={scrollerRef}
      // onScroll={handleScroll}
    >
      <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/30 flex flex-col pb-2">
        <a href="#">
          <img src={s.imageBySlug("spaceport")} className="w-12 h-12 sm:w-20 sm:h-20" />
        </a>
        <div className="overflow-hidden flex-grow flex flex-col items-center">
          {lettersEntries.map(([letter, _]) => (
            <a
              href={`#${letter}`}
              key={letter}
              style={{ height: `${100 / lettersEntries.length}%` }}
            >
              {letter}
            </a>
          ))}
        </div>
      </nav>
      <div className="relative h-screen overflow-hidden pr-12 sm:pr-20">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-right bg-cover bg-[url(/assets/bg.avif)]"></div>
        <Header />
      </div>
      <div className="pr-12 sm:pr-20">
        {lettersEntries.map(([letter, sites]) => (
          <div className="p-2 sm:p-4" key={letter} id={letter}>
            <h2
              className="text-5xl mb-4 text-center font-black"
              style={{ textShadow: "1px 1px 2px #000" }}
            >
              {letter}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:gap-4 max-w-screen-lg mx-auto ">
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
