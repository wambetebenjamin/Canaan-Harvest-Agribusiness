'use client';

import { Fragment, useEffect, useState } from 'react';

/**
 * EFFECT-04 — per-letter stagger reveal.
 *
 * The split glyphs are aria-hidden; a single sr-only element carries the
 * clean, complete sentence so screen readers never hear the text spelled
 * out letter by letter. The keyword "Fresh" additionally receives a glitch
 * pass (single iteration).
 */

interface HeroTitleProps {
  text: string;
  /** Word that receives the glitch treatment. Case-sensitive. */
  glitchWord?: string;
}

export default function HeroTitle({ text, glitchWord = 'Fresh' }: HeroTitleProps) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // One frame after mount so the animation reliably triggers.
    const id = requestAnimationFrame(() => setRun(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const words = text.split(' ');
  let charIndex = 0;

  return (
    <>
      {/* The clean sentence, exactly as authored. */}
      <span className="sr-only">{text}</span>

      <span
        className="hero__title-text"
        aria-hidden="true"
        data-split={run ? 'run' : 'idle'}
      >
        {words.map((word, wi) => {
          const isGlitch = word.replace(/[^A-Za-z]/g, '') === glitchWord;
          return (
            <Fragment key={`${word}-${wi}`}>
              <span className={`hero__word${isGlitch ? ' hero__word--glitch' : ''}`}>
                {Array.from(word).map((char, ci) => (
                  <span
                    key={`${char}-${ci}`}
                    className="hero__char"
                    style={{ ['--char-index' as string]: charIndex++ }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 ? ' ' : null}
            </Fragment>
          );
        })}
      </span>
    </>
  );
}
