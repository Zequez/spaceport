import type { CollectionEntry } from "astro:content";
import Header from "./Header";

export default function App({ sites }: { sites: CollectionEntry<"sites">[] }) {
  return (
    <div className="relative h-screen w-screen bg-slate-500 overflow-y-scroll">
      <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/30"></nav>
      <div className="relative h-screen overflow-hidden pr-12 sm:pr-20">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-right bg-cover bg-[url(/assets/bg.avif)]"></div>
        <Header />
      </div>
      Hello spaceport
    </div>
  );
}
