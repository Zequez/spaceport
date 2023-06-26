export default function Header() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <div className="blur-sm absolute z-10 inset-x-0 inset-y-0 top-0 rainbow-gradient rounded-b-[30px] opacity-25"></div>
        <div className="blur-md absolute z-10 inset-x-0 inset-y-0 top-0 rainbow-gradient rounded-b-[30px] opacity-25"></div>
        <div className="text-center mt-4 md:mt-8 md:-mb-4 relative z-20 opacity-90">
          <img
            src="/assets/sites-thumbnails/spaceport.webp"
            className="h-32 inline-block shadow-md"
          />
        </div>
        <header className="z-20 relative text-center font-black text-[40px] md:text-[100px] px-8 opacity-90">
          <h1 className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-gray-50 to-gray-300">
            SpacePort
          </h1>
          <div
            aria-hidden="true"
            style={{ textShadow: "2px 2px 4px #000, 1px 2px 0px #000" }}
            className="absolute z-0 inset-0"
          >
            SpacePort
          </div>
        </header>
      </div>
    </div>
  );
}
