import type { Site, SitesUtils } from "../lib/useSites";

export default function SiteCard({ site, s }: { site: Site; s: SitesUtils }) {
  return (
    <div
      key={site.id}
      className="border bg-white/90 overflow-hidden text-black/80 border-white/20 rounded-md shadow-md"
    >
      <div className="sm:flex sm:flex-row">
        {thumbnail()}
        <div className="contents sm:block">
          {title()}
          {replacedBy()}
          {categories()}
          <div className="clear-both sm:clear-none"></div>
          {description()}
          {alsoSee()}
        </div>
      </div>
    </div>
  );

  function thumbnail() {
    return (
      <a href={site.data.url} className="flex-shrink-0 float-left mr-2 sm:mr-0 sm:float-none">
        <img
          className="h-16 w-16 sm:h-40 sm:w-40"
          src={site.data.replacedBy ? "/assets/moved.webp" : s.imageBySlug(site.slug)}
          loading="lazy"
        />
      </a>
    );
  }

  function title() {
    return (
      <h3
        className="text-xl sm:text-3xl font-bold tracking-wider px-2 py-1 text-gray-600"
        style={{ textShadow: "0 1px #fff" }}
      >
        {site.data.title}
      </h3>
    );
  }

  function replacedBy() {
    return site.data.replacedBy ? (
      <div className="px-2 mb-4 markdown">
        <strong>NOTE:</strong> The website has been moved to {s.linkifySlug(site.data.replacedBy)}
      </div>
    ) : null;
  }

  function categories() {
    return site.data.categories.length ? (
      <div className="px-2 mb-4">
        {site.data.categories.map((cat) => (
          <span key={cat}>{cat}</span>
        ))}
      </div>
    ) : null;
  }

  function description() {
    return site.body ? (
      <div
        className="mx-2 p-2 mt-2 rounded-md shadow-inner border border-gray-300 mb-2 markdown bg-white/50"
        dangerouslySetInnerHTML={{ __html: s.linkifySlugsInText(site.body) }}
      ></div>
    ) : null;
  }

  function alsoSee() {
    return site.data.alsoSee.length ? (
      <div className="px-2">
        <div className="font-bold tracking-wider text-gray-600 mb-2">See also</div>
        <div className="flex flex-wrap">
          {site.data.alsoSee.map((otherSite) => (
            <div
              key={typeof otherSite === "string" ? otherSite : otherSite.text}
              className="bg-black/10 rounded-sm overflow-hidden border border-gray-400 mb-2 mr-2"
            >
              {typeof otherSite === "string" ? (
                s.linkifySlug(otherSite)
              ) : (
                <a href={otherSite.url}>{otherSite.text}</a>
              )}
            </div>
          ))}
        </div>
      </div>
    ) : null;
  }
}
