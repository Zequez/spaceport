import type { CollectionEntry } from "astro:content";
import Header from "./Header";
import { useRef, useEffect, useState, useMemo } from "react";
import { useSites } from "../lib/useSites";
import SiteCard from "./SiteCard";
import Navigation from "./Navigation";
import { throttle } from "../lib/utils";

type Site = CollectionEntry<"sites">;

export default function App({ sites }: { sites: Site[] }) {
  const s = useSites(sites);
  const [scrollSection, setScrollSection] = useState(
    () => "header"
    // typeof document !== "undefined" ? document.location.hash.replace(/#/, "") : "header"
  );
  const scrollSectionRef = useRef(scrollSection);

  useEffect(() => {
    const handleScroll = throttle(() => {
      const halfHeight = window.innerHeight / 2;
      const elements = Array.from(document.querySelectorAll("[id]"));
      const index = elements
        .map((el) => {
          const { top } = el.getBoundingClientRect();
          return [top, el.id] as [number, string];
        })
        .sort((a, b) => a[0] - b[0])
        .find(([num, id], i, arr) => {
          return num < halfHeight && (i < arr.length - 1 ? arr[i + 1][0] > halfHeight : true);
        });

      if (index) {
        if (scrollSectionRef.current !== index[1]) {
          setScrollSection(index[1]);
          scrollSectionRef.current = index[1];
        }
      }
    }, 100);

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handlePickLetter(letter: string) {
    setScrollSection(letter);
    document.location.hash = `#${letter}`;
  }

  function handlePreviewLetter(letter: string | null) {
    console.log("Previewing letter", letter);
  }

  const lettersEntries = useMemo(() => Array.from(s.byLetter), [s.byLetter]);
  const letters = useMemo(() => Array.from(s.byLetter.keys()), [s.byLetter]);

  return (
    <div className="relative bg-slate-600 text-white">
      <Navigation
        letters={letters}
        thumb={s.imageBySlug("spaceport")}
        currentlyAt={scrollSection}
        onPick={handlePickLetter}
        onPreview={handlePreviewLetter}
      />
      <div className="relative h-screen overflow-hidden pr-12 sm:pr-20" id="header">
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
      <div id="footer" className="h-screen pr-12 sm:pr-20 pl-4 py-4">
        <div>
          <h2>DIRECTORY OF POSSIBILITY MANAGEMENT (PM) WEBSITES</h2>
        </div>
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
