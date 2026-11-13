import React, {type ReactNode, useEffect, useState} from 'react';
import useBaseUrl, {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

/*
 * Display parts for follow-along guides, such as the OMX Quick Start Guide.
 *
 * Each page of a guide is wrapped in `GuidePage`. The guide's title and the links to its pages
 * are kept in one `_*.ts` file next to the pages (for OMX: quick_start_guide/_quick_start.ts).
 * The other parts go inside a page: terminals, pictures, numbered clicks, checks, fixes and cautions.
 */

/** A picture or a short silent looping clip. Leave `src` out until it is made. */
export type TutorialMediaItem = {
  /** What it shows. Read by screen readers, and shown in the empty slot until `src` is set. */
  label: string;
  /** Path under /static. A .mp4 or .webm file plays as a loop, anything else is a picture. */
  src?: string;
  /** Still picture shown before a clip loads. */
  poster?: string;
  /** Names written on top, for example the name of each arm. x and y run from 0 to 1 across the picture. */
  names?: {text: string; x: number; y: number}[];
  /** One name in a rounded label at the top left, for what the whole picture shows. For example "Leader". */
  tag?: string;
  /** Numbered points where the reader clicks. Use the same numbers as the list next to the picture. x and y run from 0 to 1. */
  marks?: {n: number; x: number; y: number}[];
  /** Outlines around what the reader should look at. x, y, w and h run from 0 to 1. */
  boxes?: {x: number; y: number; w: number; h: number}[];
  /**
   * `wide` is 16:9 (default). `square` is 1:1, for close-ups shown side by side.
   * `free` keeps the picture's own shape and adds a thin border, for screenshots.
   * A `free` picture opens larger when clicked, with its marks and outlines.
   */
  shape?: 'wide' | 'square' | 'free';
  /** The widest it may be shown, in pixels. For small pictures that would look blurry when stretched. */
  width?: number;
};

/** Shows a picture or a looping clip. Without `src` it shows a slot that says what is still to be made. */
export function TutorialMedia({label, src, poster, names, tag, marks, boxes, shape = 'wide', width}: TutorialMediaItem) {
  const square = shape === 'square' ? styles.mediaSquare : shape === 'free' ? styles.mediaFree : '';
  const limit = width ? {maxWidth: width} : undefined;
  const url = useBaseUrl(src ?? '');
  const posterUrl = useBaseUrl(poster ?? '');
  // People who ask their system for less motion get a still picture with a play button.
  const [lessMotion, setLessMotion] = useState(false);
  useEffect(() => {
    setLessMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  // The larger view of a screenshot: null while closed, else the picture's shape and its own width in pixels.
  const [zoom, setZoom] = useState<{aspect: number; width: number} | null>(null);
  useEffect(() => {
    if (zoom === null) {
      return undefined;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setZoom(null);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [zoom]);

  if (!src) {
    return (
      <div className={`${styles.mediaEmpty} ${square}`} style={limit} role="img" aria-label={`To be made: ${label}`}>
        <span>To be made</span>
        <strong>{label}</strong>
      </div>
    );
  }

  const isClip = /\.(mp4|webm)$/i.test(src);

  // Drawn over the picture, and again over its larger view.
  const overlays = (
    <>
      {tag ? <span className={styles.mediaTag}>{tag}</span> : null}
      {boxes?.map((box, index) => (
        <span
          key={`box-${index}`}
          className={styles.mediaBox}
          style={{left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%`}}
        />
      ))}
      {marks?.map(mark => (
        <span key={`mark-${mark.n}`} className={styles.mediaMark} style={{left: `${mark.x * 100}%`, top: `${mark.y * 100}%`}}>
          {mark.n}
        </span>
      ))}
      {names?.map(name => (
        <span key={name.text} className={styles.mediaName} style={{left: `${name.x * 100}%`, top: `${name.y * 100}%`}}>
          {name.text}
        </span>
      ))}
    </>
  );

  if (isClip) {
    return (
      <div className={styles.mediaFrame} style={limit}>
        <video
          key={lessMotion ? 'still' : 'loop'}
          className={`${styles.mediaItem} ${square}`}
          src={url}
          poster={poster ? posterUrl : undefined}
          aria-label={label}
          autoPlay={!lessMotion}
          controls={lessMotion}
          loop
          muted
          playsInline
        />
        {overlays}
      </div>
    );
  }

  const picture = <img className={`${styles.mediaItem} ${square}`} src={url} alt={label} loading="lazy" />;

  if (shape !== 'free') {
    return (
      <div className={styles.mediaFrame} style={limit}>
        {picture}
        {overlays}
      </div>
    );
  }

  // A screenshot opens larger when clicked: as wide as the window allows, but never past its own size.
  const open = (frame: HTMLElement) => {
    const shown = frame.querySelector('img');
    const loaded = shown !== null && shown.naturalWidth > 0;
    setZoom({aspect: loaded ? shown.naturalWidth / shown.naturalHeight : 16 / 9, width: loaded ? shown.naturalWidth : 0});
  };

  return (
    <>
      <div
        className={`${styles.mediaFrame} ${styles.mediaZoomable}`}
        style={limit}
        role="button"
        tabIndex={0}
        title="Click to see it larger"
        onClick={event => open(event.currentTarget)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open(event.currentTarget);
          }
        }}
      >
        {picture}
        {overlays}
        <span className={styles.mediaZoomHint} aria-hidden="true">
          Click to enlarge
        </span>
      </div>
      {/* Outside the frame on purpose: the frame's container-type would keep a fixed view inside it. */}
      {zoom !== null ? (
        <div className={styles.mediaZoom} role="dialog" aria-modal="true" aria-label={label} onClick={() => setZoom(null)}>
          <div
            className={`${styles.mediaFrame} ${styles.mediaZoomFrame}`}
            style={{
              width: `min(96vw, calc((100vh - var(--ifm-navbar-height, 3.75rem)) * 0.94 * ${zoom.aspect})${zoom.width ? `, ${zoom.width}px` : ''})`,
            }}
          >
            <img src={url} alt={label} />
            {overlays}
          </div>
        </div>
      ) : null}
    </>
  );
}

/** A guide that is read in order, such as the OMX Quick Start Guide. Keep it in one `_*.ts` file next to its pages. */
export type Guide = {
  /** For example "OMX Quick Start Guide". */
  title: string;
  /** Its pages in reading order. "Help me, AI!" gives the AI these links. */
  pages: {title: string; to: string}[];
};

/**
 * "Help me, AI!" for a guide: opens ChatGPT or Claude with a prompt already typed in.
 * The prompt gives the AI the links to the pages of the guide and asks it to help the reader through them.
 * It is only typed in, not sent, so the reader can change it first.
 * The links use the address the site is published at, so the AI can only read the pages once they are online.
 */
function GuideAsk({guide}: {guide: Guide}) {
  const {siteConfig} = useDocusaurusContext();
  const {withBaseUrl} = useBaseUrlUtils();
  const [copied, setCopied] = useState(false);

  const prompt = [
    `I am following the ROBOTIS "${guide.title}". Its pages, in order:`,
    ...guide.pages.map(page => `- ${page.title}: ${siteConfig.url}${withBaseUrl(page.to)}`),
    'Read those pages.',
    'Then be my helper, so I can get through the guide without getting stuck.',
    'Use simple words. If something goes wrong, ask me to paste what my terminal shows.',
  ].join('\n');
  const query = encodeURIComponent(prompt);
  const copy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <details className={styles.ask}>
      <summary>Help me, AI!</summary>
      <div className={styles.askMenu}>
        {/* `prompt` only fills the box. With `q`, ChatGPT sends it at once and the reader cannot change it. */}
        <a href={`https://chatgpt.com/?prompt=${query}`} target="_blank" rel="noopener noreferrer">
          Ask ChatGPT
        </a>
        <a href={`https://claude.ai/new?q=${query}`} target="_blank" rel="noopener noreferrer">
          Ask Claude
        </a>
        <button type="button" onClick={copy} aria-live="polite">
          {copied ? 'Copied' : 'Copy the prompt for another AI'}
        </button>
        <p>The AI gets the links to this guide and is asked to help you through it.</p>
      </div>
    </details>
  );
}

/**
 * Wraps one page of a guide, such as "Move OMX" in the Quick Start Guide:
 * the title with "Help me, AI!" at its right end, then the page.
 * Put `hide_title: true` in the page's front matter, because this part writes the title.
 * The big headings (##) of the page are its steps. They make the list at the right of the page,
 * so put `toc_max_heading_level: 2` in the front matter too.
 */
export function GuidePage({guide, title, children}: {guide: Guide; title: string; children: ReactNode}) {
  return (
    <div className={styles.page}>
      <div className={styles.titleRow}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <GuideAsk guide={guide} />
      </div>
      {children}
    </div>
  );
}

/** Whether this line is text for a command above it: inside a here-document, from `<<EOF` down to `EOF`. */
function inHereDocument(lines: string[], index: number) {
  let end: string | null = null;
  for (let i = 0; i < index; i += 1) {
    if (end === null) {
      end = /<<-?\s*['"]?(\w+)['"]?\s*$/.exec(lines[i].trimEnd())?.[1] ?? null;
    } else if (lines[i].trim() === end) {
      end = null;
    }
  }
  return end !== null;
}

/** How one line of a commands window is drawn. See Terminal. */
function commandParts(lines: string[], index: number) {
  const line = lines[index];
  // An empty line only spaces the commands out, so it is drawn like a note, with no `$`.
  const note = line.trimStart().startsWith('#') || line.trim() === '';
  // This line goes on from the line above, which ended with a backslash, or it is text inside a here-document.
  const goesOn =
    (index > 0 && lines[index - 1].trimEnd().endsWith('\\')) || inHereDocument(lines, index);
  // Find the line where this command started, to know whether it runs inside a container.
  let start = index;
  while (start > 0 && lines[start - 1].trimEnd().endsWith('\\')) {
    start -= 1;
  }
  const wrapper = /^docker exec -it \S+ bash -ic "/.exec(lines[start]);
  const before = wrapper && start === index ? wrapper[0] : '';
  const rest = line.slice(before.length);
  // The closing quote of a container command, on its last line.
  const after = wrapper && !rest.trimEnd().endsWith('\\') && rest.endsWith('"') ? '"' : '';
  const main = after ? rest.slice(0, -1) : rest;
  return {note, goesOn, before, main, after};
}

/** The text of a fenced code block that was written inside a component. */
function codeText(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(codeText).join('');
  }
  if (React.isValidElement<{children?: ReactNode}>(node)) {
    return codeText(node.props.children);
  }
  return '';
}

/**
 * A terminal window. Put one fenced code block inside it.
 *
 * - `commands` (default): lines to paste. Each line gets a `$` in front, and a Copy button copies them without it.
 * - `output`: what the terminal answers. No `$`, and the word "Output" where the Copy button would be.
 *
 * In `commands`, three kinds of lines are drawn differently. Copy still copies every line exactly as written.
 * - A line that starts with `#` is a note for the reader. It is dim and has no `$`. Pasted, it does nothing.
 * - A command can go over several lines: end each line but the last with a backslash. The next lines get no `$`.
 *   The lines of a here-document, from `<<EOF` down to `EOF`, get no `$` either, and neither does an empty line.
 * - The part `docker exec -it <container> bash -ic "…"` only runs the command inside a container. It is dim,
 *   so the command itself stands out.
 *
 * `where` names the terminal in the window bar. When a step keeps several terminals open, number them: "Terminal 1".
 * `checks` marks the lines of an output that matter: `{1: 'Ubuntu 24.04'}` puts a green check and those words
 * next to line 1. The other lines turn grey. Use it instead of a sentence that says what to look for.
 * `hint` adds a line under the commands that says how to paste. Use it on the first terminal of a guide.
 * `note` adds one quiet line under an answer, for what may be different on the reader's PC and is still fine.
 */
export function Terminal({
  kind = 'commands',
  where = 'PC terminal',
  checks,
  hint = false,
  note,
  children,
}: {
  kind?: 'commands' | 'output';
  where?: string;
  checks?: Record<number, string>;
  hint?: boolean;
  note?: string;
  children: ReactNode;
}) {
  const lines = codeText(children).replace(/\n+$/, '').split('\n');
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={`${styles.terminal} ${kind === 'commands' ? styles.terminalCommands : ''}`}>
      <div className={styles.terminalBar}>
        <span className={styles.terminalDots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.terminalWhere}>{where}</span>
        {kind === 'commands' ? (
          <button type="button" className={styles.terminalCopy} onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy'}
          </button>
        ) : (
          <span className={styles.terminalKind}>Output</span>
        )}
      </div>
      <pre className={styles.terminalBody}>
        <code>
          {lines.map((line, index) => {
            const check = checks?.[index + 1];
            const parts = kind === 'commands' ? commandParts(lines, index) : null;

            return (
              <span
                key={index}
                className={[
                  styles.terminalLine,
                  check ? styles.terminalChecked : checks ? styles.terminalDim : '',
                  parts?.note ? styles.terminalNote : '',
                  parts?.goesOn ? styles.terminalGoesOn : '',
                ].join(' ')}
              >
                <span>
                  {parts?.before ? <span className={styles.terminalWrapper}>{parts.before}</span> : null}
                  {parts ? parts.main : line}
                  {parts?.after ? <span className={styles.terminalWrapper}>{parts.after}</span> : null}
                  {'\n'}
                </span>
                {check ? <span className={styles.terminalCheck}>{check}</span> : null}
              </span>
            );
          })}
        </code>
      </pre>
      {kind === 'commands' && hint ? (
        <p className={styles.terminalHint}>
          Copy, paste into the terminal with <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>, then press{' '}
          <kbd>Enter</kbd>.
        </p>
      ) : null}
      {note ? <p className={styles.terminalHint}>{note}</p> : null}
    </div>
  );
}

/**
 * A map of the terminals that a step keeps open, drawn as one window split into panes.
 * Each pane shows its number, what runs there, and the sign that it is running.
 * The numbers are the same as in `<Terminal where="Terminal 1">`.
 */
export function TerminalMap({panes}: {panes: {name: string; shows?: string}[]}) {
  return (
    <ol className={styles.terminalMap} aria-label="The terminals of this step">
      {panes.map((pane, index) => (
        <li key={pane.name}>
          <span className={styles.terminalMapWhere}>Terminal {index + 1}</span>
          <strong>{pane.name}</strong>
          {pane.shows ? <span className={styles.terminalMapShows}>{pane.shows}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/**
 * What a good result looks like when it is not in a terminal: the robot, or a web page.
 * Put a markdown list inside. Each line gets a green check mark. Keep each line to a few words.
 */
export function Checks({children}: {children: ReactNode}) {
  return <div className={styles.checks}>{children}</div>;
}

/**
 * Things to click, in order. Put a markdown numbered list inside.
 * Each number is drawn as the same coloured point as the `marks` on the screenshot next to it,
 * so the reader sees that line 2 of the list and point 2 on the picture are the same thing.
 */
export function Clicks({start = 1, children}: {start?: number; children: ReactNode}) {
  // `start` lets a second list go on where the first one stopped, so the numbers still match one picture.
  return (
    <div className={styles.clicks} style={{'--clicks-from': start - 1} as React.CSSProperties}>
      {children}
    </div>
  );
}

/**
 * A screenshot and the short text that points at it, in one rounded box as wide as the reading column:
 * the text on top, the screenshot below it at the full width of the box, so the text inside the screenshot
 * stays readable. The numbers in the text are the same as the numbers on the picture.
 * Put the text inside, and give the picture with the same props as TutorialMedia.
 * Give `width` the picture's own width in pixels, so a small screenshot is not stretched.
 */
export function ScreenshotBox({children, ...media}: TutorialMediaItem & {children: ReactNode}) {
  return (
    <div className={styles.screenshotBox}>
      <div className={styles.screenshotBoxText}>{children}</div>
      <div className={styles.screenshotBoxPicture}>
        <TutorialMedia shape="free" {...media} />
      </div>
    </div>
  );
}

/** One numbered point inside a sentence, for pointing back at a mark: "Click <Point n={4} /> Start again." */
export function Point({n}: {n: number}) {
  return <span className={styles.point}>{n}</span>;
}

/**
 * What to do when the result is different. It stays closed until the reader opens it,
 * so a reader for whom everything works never has to read it.
 * Put a markdown table inside with two columns: what the reader sees, and what to do.
 */
export function NotGood({title = 'Something different?', children}: {title?: string; children: ReactNode}) {
  return (
    <details className={styles.fix}>
      <summary>{title}</summary>
      <div className={styles.fixBody}>{children}</div>
    </details>
  );
}

/**
 * An amber box for safety: what to know before the robot moves, or before it goes limp.
 * Every safety note of a guide goes in one of these, and nothing else does.
 */
export function Caution({title = 'Caution', children}: {title?: string; children: ReactNode}) {
  return (
    <div className={styles.caution}>
      <p className={styles.cautionTitle}>{title}</p>
      {children}
    </div>
  );
}

/**
 * Small actions shown side by side, each as a short clip with one sentence under it.
 * Put `<Shot>` items inside. They are numbered in order.
 */
export function Shots({children}: {children: ReactNode}) {
  return <ol className={styles.shots}>{children}</ol>;
}

/** One action: a square clip or picture, and one sentence. `tag` names the part it is about, at the top left. */
export function Shot({children, ...media}: TutorialMediaItem & {children: ReactNode}) {
  return (
    <li className={styles.shot}>
      <TutorialMedia {...media} shape="square" />
      <div className={styles.shotText}>{children}</div>
    </li>
  );
}
