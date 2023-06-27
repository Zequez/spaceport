import { useState } from "react";
import cx from "classnames";

function calculateLetter(letters: string[], position: number) {}

export default function Navigation({
  letters,
  thumb,
  currentlyAt,
}: {
  letters: string[];
  thumb: string;
  currentlyAt: string;
  onPreview: (letter: string) => void;
  onPick: (letter: string) => void;
}) {
  const [lettersMousePos, setLettersMousePos] = useState<number | null>(null);

  function handleLettersMouseMove(ev: React.MouseEvent<HTMLDivElement>) {
    const rect = ev.currentTarget.getBoundingClientRect();
    const height = rect.height;
    const clamp = (n: number) => (n < 0 ? 0 : n > height ? height : n);
    const top = clamp(ev.clientY - rect.top);
    setLettersMousePos(top / height);
  }

  function handleLettersMouseLeave() {
    setLettersMousePos(null);
  }

  return (
    <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/30 flex flex-col">
      <a href="#">
        <img src={thumb} className="w-12 h-12 sm:w-20 sm:h-20" />
      </a>
      <div
        className="overflow-hidden relative flex-grow flex flex-col items-stretch"
        onMouseMove={handleLettersMouseMove}
        onMouseLeave={handleLettersMouseLeave}
      >
        {lettersMousePos !== null ? (
          <div
            className="absolute z-10 h-[1px] w-full bg-red-400 pointer-events-none"
            style={{ top: `${lettersMousePos * 100}%` }}
          ></div>
        ) : null}
        {letters.map((letter) => (
          <a
            href={`#${letter}`}
            key={letter}
            className={cx("hover:bg-white/20 text-center", {
              "bg-white/20": currentlyAt === letter,
            })}
            style={{ height: `${100 / letters.length}%` }}
          >
            {letter}
          </a>
        ))}
      </div>
      <a
        href="#footer"
        className={cx("leading-tight text-center py-2 hover:bg-white/20", {
          "bg-white/20": currentlyAt === "footer",
        })}
      >
        PM Directory
      </a>
    </nav>
  );
}
