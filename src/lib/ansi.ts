
/**
 * What a command's text says about how it should read.
 *
 * Only the **rendition** half of the terminal grammar is kept: colour, weight
 * and the dim/underline marks. A cursor move, an erase, a mode set, a title or
 * an italic or inverse flag changes a screen that is no longer here to change,
 * or asks for a mark there is no inline run to carry it on, so those sequences
 * are consumed and drawn as nothing — a scrollback row was already committed
 * when the command printed it. A background colour is read for its numbers and
 * dropped: between the runs of a line there are foregrounds, never fills.
 */
export interface AnsiStyle {
  fg?: string;
  bold?: boolean;
  dim?: boolean;
  underline?: boolean;
}

export interface AnsiSpan {
  text: string;
  style: AnsiStyle;
}

interface Rendition {
  fg?: string;
  bold: boolean;
  dim: boolean;
  underline: boolean;
}

const codeOf = (part: string): number => Number.parseInt(part, 10);
const numsOf = (parts: string[]): number[] =>
  parts.map(codeOf).filter((code) => !Number.isNaN(code));

/** The xterm cube (16-231) and its grey ramp (232-255), under a scheme's own 16. */
function color256(
  index: number | undefined,
  palette: readonly string[],
): string | undefined {
  if (index === undefined || Number.isNaN(index) || index < 0 || index > 255)
    return undefined;
  if (index < 16) return palette[index];
  if (index < 232) {
    const cube = index - 16;
    const channel = (n: number) => (n === 0 ? 0 : 55 + n * 40);
    const r = channel(Math.floor(cube / 36));
    const g = channel(Math.floor((cube % 36) / 6));
    const b = channel(cube % 6);
    return `rgb(${r},${g},${b})`;
  }
  const grey = 8 + (index - 232) * 10;
  return `rgb(${grey},${grey},${grey})`;
}

/** `38;5;n`, `38;2;r;g;b` and the colon sub-parameter spelling of either. */
function extendedColor(
  args: number[],
  palette: readonly string[],
): string | undefined {
  if (args[0] === 5) return color256(args[1], palette);
  if (args[0] === 2 && args.length >= 4)
    return `rgb(${args[1]},${args[2]},${args[3]})`;
  return undefined;
}

/** A code that turns a mark on or off, with no colour in it at all. */
const MARKS: Record<number, (r: Rendition) => void> = {
  0: (r) => {
    r.fg = undefined;
    r.bold = false;
    r.dim = false;
    r.underline = false;
  },
  1: (r) => {
    r.bold = true;
  },
  2: (r) => {
    r.dim = true;
  },
  4: (r) => {
    r.underline = true;
  },
  22: (r) => {
    r.bold = false;
    r.dim = false;
  },
  24: (r) => {
    r.underline = false;
  },
};

/**
 * One parameter of an SGR run.
 *
 * 3/23 (italic) and 7/27 (inverse), 21, and the background families 40-49 and
 * 100-107 are read and answered with nothing: there is no slant to write and no
 * inline fill to lay a background on, only the foregrounds of the runs.
 */
function applyCode(
  code: number,
  r: Rendition,
  palette: readonly string[],
): void {
  const mark = MARKS[code];
  if (mark !== undefined) return mark(r);
  if (code >= 30 && code <= 37) r.fg = palette[code - 30];
  else if (code >= 90 && code <= 97) r.fg = palette[code - 90 + 8];
  else if (code === 39) r.fg = undefined;
}

/**
 * The colour an extended `38`/`48` asks for, and how many further parameters it
 * ate. A `48` is still consumed — its numbers have to be taken whether or not
 * they can be painted, or they land in the loop below as codes of their own.
 */
function extendedArgs(
  group: string[],
  params: string[],
  at: number,
  palette: readonly string[],
): { color?: string; taken: number } {
  // A foreground 38 is painted; a background 48 is only eaten for its numbers.
  const paints = codeOf(group[0]) === 38;
  const answer = (args: number[], taken: number) => {
    const color = paints ? extendedColor(args, palette) : undefined;
    return color === undefined ? { taken } : { color, taken };
  };
  // A colon group (`38:2::200:60:60`) carries its sub-parameters in one entry.
  if (group.length > 1) return answer(numsOf(group.slice(1)), 0);
  const kind = codeOf(params[at + 1] ?? "");
  const taken = kind === 5 ? 2 : kind === 2 ? 4 : 1;
  return answer(numsOf(params.slice(at + 1, at + 1 + taken)), taken);
}

function applySgr(body: string, r: Rendition, palette: readonly string[]): void {
  const params = (body === "" ? "0" : body).split(";");
  for (let i = 0; i < params.length; i++) {
    const group = params[i].split(":");
    const code = codeOf(group[0]);
    if (Number.isNaN(code)) continue;

    if (code === 38 || code === 48) {
      const extended = extendedArgs(group, params, i, palette);
      i += extended.taken;
      if (extended.color !== undefined) r.fg = extended.color;
      continue;
    }
    applyCode(code, r, palette);
  }
}

const CSI_FIRST = 0x40;
const CSI_LAST = 0x7e;

const isFinal = (ch: string | undefined): boolean => {
  const at = ch === undefined ? -1 : ch.charCodeAt(0);
  return at >= CSI_FIRST && at <= CSI_LAST;
};

/**
 * A control sequence: parameters up to a byte in `@`–`~`, where only `m` (SGR)
 * paints and the rest — cursor moves, erases, mode sets — are stepped over.
 */
function skipCsi(
  text: string,
  start: number,
  r: Rendition,
  palette: readonly string[],
): number {
  let end = start + 2;
  while (end < text.length && !isFinal(text[end])) end++;
  if (text[end] === "m") applySgr(text.slice(start + 2, end), r, palette);
  return end < text.length ? end + 1 : text.length;
}

/**
 * An operating-system command — a window title, a colour query — ended by BEL
 * or ST.
 */
function skipOsc(text: string, start: number): number {
  let end = start + 2;
  while (end < text.length) {
    if (text[end] === "\x07") return end + 1;
    if (text[end] === "\x1b" && text[end + 1] === "\\") return end + 2;
    end++;
  }
  return text.length;
}

/**
 * Where the text after the escape at `start` begins. Only a final `m` leaves a
 * mark; an OSC, a cursor move, an erase and any other escape are stepped over.
 */
function skipSequence(
  text: string,
  start: number,
  r: Rendition,
  palette: readonly string[],
): number {
  const kind = text[start + 1];
  if (kind === undefined) return text.length;
  if (kind === "[") return skipCsi(text, start, r, palette);
  if (kind === "]") return skipOsc(text, start);

  // `ESC ( B` and friends designate a character set: three bytes, not two.
  if (kind === "(" || kind === ")" || kind === "#" || kind === "%")
    return Math.min(start + 3, text.length);
  return start + 2;
}

/**
 * Terminal text into the lines it paints, each one a run of styled spans.
 *
 * The rendition carries across a line break the way it does in a terminal: a
 * command that opens a colour and never closes it colours what it prints after,
 * not merely the rest of that line. The other control characters are dropped,
 * because a font answers them with a box.
 */
export function ansiLinesOf(
  text: string,
  palette: readonly string[],
): AnsiSpan[][] {
  const lines: AnsiSpan[][] = [];
  let line: AnsiSpan[] = [];
  const r: Rendition = { bold: false, dim: false, underline: false };

  const flush = (buffer: string) => {
    if (buffer === "") return;
    line.push({
      text: buffer,
      style: {
        ...(r.fg === undefined ? {} : { fg: r.fg }),
        ...(r.bold ? { bold: true } : {}),
        ...(r.dim ? { dim: true } : {}),
        ...(r.underline ? { underline: true } : {}),
      },
    });
  };

  const pushText = (chunk: string) => {
    let buffer = "";
    for (let i = 0; i < chunk.length; i++) {
      const ch = chunk[i];
      if (ch === "\n" || ch === "\r") {
        // A `\r` is a row break, not an overwrite: a scrollback cannot go back
        // over a row it has drawn, so a command that rewrote its progress line
        // leaves one row per frame, newest at the bottom where a tail keeps it.
        flush(buffer);
        buffer = "";
        lines.push(line);
        line = [];
        if (ch === "\r" && chunk[i + 1] === "\n") i++;
      } else if (ch.charCodeAt(0) < 0x20 && ch !== "\t") {
        continue;
      } else {
        buffer += ch;
      }
    }
    flush(buffer);
  };

  let i = 0;
  while (i < text.length) {
    const esc = text.indexOf("\x1b", i);
    if (esc === -1) {
      pushText(text.slice(i));
      break;
    }
    if (esc > i) pushText(text.slice(i, esc));
    i = skipSequence(text, esc, r, palette);
  }
  lines.push(line);
  return lines;
}
