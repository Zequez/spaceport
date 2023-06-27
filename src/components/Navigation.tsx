import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";

function calculateLetter(letters: string[], position: number) {}

export default function Navigation({
  letters,
  thumb,
  currentlyAt,
  onPick,
  onPreview,
}: {
  letters: string[];
  thumb: string;
  currentlyAt: string;
  onPreview: (letter: string | null) => void;
  onPick: (letter: string) => void;
}) {
  const lettersRef = useRef<HTMLDivElement | null>(null);
  const [lettersMousePos, setLettersMousePos] = useState<number | null>(null);
  const [leftMousePos, setLeftMousePos] = useState<number | null>(null);
  const [isTouching, setIsTouching] = useState(false);

  const letterHeight = 100 / letters.length;

  function handleLettersPositioning(x: number, y: number) {
    if (lettersRef.current) {
      const rect = lettersRef.current.getBoundingClientRect();
      const height = rect.height;
      const clamp = (n: number) => (n < 0 ? 0 : n > height ? height : n);
      const top = clamp(y - rect.top);
      setLettersMousePos(top / height);

      const distX = document.body.clientWidth - x - rect.width / 2;
      if (distX > 150) {
        setLeftMousePos(null);
      } else {
        setLeftMousePos(distX);
      }
    }
  }

  function handleLettersMouseMove(ev: React.MouseEvent<HTMLDivElement>) {
    handleLettersPositioning(ev.clientX, ev.clientY);
  }

  const closestLetter = useMemo(
    () =>
      lettersMousePos
        ? letters
            .map((letter, i) => {
              const pos = (i * letterHeight + letterHeight / 2) / 100;
              const dist = Math.abs(pos - lettersMousePos);
              return [dist, letter] as [number, string];
            })
            .sort((a, b) => a[0] - b[0])[0][1]
        : null,
    [lettersMousePos]
  );

  const [highlightedLetter, setHighlightedLetter] = useState<null | string>(null);

  // useEffect(() => {
  //   if (closestLetter) setHighlightedLetter(closestLetter);
  // }, [closestLetter]);

  useEffect(() => {
    setHighlightedLetter(currentlyAt);
  }, [currentlyAt]);

  useEffect(() => {
    if (closestLetter) {
      if (isTouching) {
        onPick(closestLetter);
        setHighlightedLetter(closestLetter);
      } else {
        onPreview(closestLetter);
      }
    }
  }, [closestLetter]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    if (closestLetter) {
      onPick(closestLetter);
      setHighlightedLetter(closestLetter);
    }
    setLettersMousePos(null);
    setLeftMousePos(null);
  }, [closestLetter]);

  const handleMouseLeave = () => {
    setLettersMousePos(null);
    setLeftMousePos(null);
    onPreview(null);
  };

  const handleClick = useCallback(() => {
    if (closestLetter) onPick(closestLetter);
  }, [closestLetter]);

  useEffect(() => {
    if (lettersRef.current) {
      lettersRef.current.addEventListener(
        "touchstart",
        (ev) => {
          setIsTouching(true);
          ev.preventDefault();
          handleLettersPositioning(ev.touches[0].clientX, ev.touches[0].clientY);
        },
        { passive: false }
      );
    }
  }, []);

  const handleMouseDown = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      setIsTouching(true);
      ev.preventDefault();
      if (closestLetter) onPick(closestLetter);
      function handleMouseUp() {
        setIsTouching(false);
        // setLettersMousePos(null);
        // setLeftMousePos(null);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      window.addEventListener("mouseup", handleMouseUp);
    },
    [closestLetter]
  );

  function handleTouchMove(ev: React.TouchEvent<HTMLDivElement>) {
    handleLettersPositioning(ev.targetTouches[0].clientX, ev.targetTouches[0].clientY);
  }

  return (
    <nav className="fixed z-10 inset-y-0 right-0 w-12 sm:w-20 bg-black/20 flex flex-col">
      <a href="#">
        <img src={thumb} className="w-12 h-12 sm:w-20 sm:h-20" />
      </a>
      <div
        className="relative flex-grow flex flex-col items-stretch cursor-pointer"
        ref={lettersRef}
        onMouseMove={handleLettersMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      >
        {/* {lettersMousePos !== null ? (
          <div
            className="absolute z-10 h-[1px] w-full bg-white/25 pointer-events-none"
            style={{ top: `${lettersMousePos * 100}%` }}
          ></div>
        ) : null} */}
        {letters.map((letter, i) => {
          const pos = i * letterHeight + letterHeight / 2;
          const waveHeight =
            lettersMousePos && leftMousePos
              ? waveFunction(pos / 100, lettersMousePos, 0.5) * Math.max(30, leftMousePos)
              : 0;

          const style = {
            transition: leftMousePos ? "none" : "transform 0.5s",
            transform: `translateX(-${waveHeight}px)`,
            height: `${letterHeight}%`,
          };

          return (
            <a
              href={`#${letter}`}
              key={letter}
              className={cx("relative  text-center group", {
                "bg-black/20": highlightedLetter === letter || closestLetter === letter,
                "rounded-r-md": closestLetter === letter,
              })}
              style={style}
            >
              <span className="block absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                {letter}
              </span>
              {closestLetter === letter ? (
                <span
                  className={cx(
                    "flex absolute h-12 w-12 bg-black font-black text-xl rounded-full top-[50%] right-[100%] -mr-4 translate-y-[-50%] items-center justify-center"
                  )}
                >
                  {letter}
                </span>
              ) : null}
            </a>
          );
        })}
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

function waveFunction(value: number, crestPosition: number, waveLength: number): number {
  if (crestPosition < 0 || crestPosition > 1) {
    return 0; // Crest position should be between 0 and 1
  }

  if (waveLength <= 0 || waveLength > 1) {
    return 0; // Wave length should be between 0 and 1
  }

  const waveStart = crestPosition - waveLength / 2;
  const waveEnd = crestPosition + waveLength / 2;

  if (value >= waveStart && value <= waveEnd) {
    const halfWaveLength = waveLength / 2;
    const distanceToCrest = Math.abs(value - crestPosition);
    const t = distanceToCrest / halfWaveLength;
    const tSmoothed = smoothStep(t);
    const waveValue = 1 - tSmoothed;
    return Math.max(waveValue, 0); // Ensure wave value is between 0 and 1
  } else {
    return 0; // Outside the wave length, return 0
  }
}

function smoothStep(t: number): number {
  return t * t * (3 - 2 * t);
}
