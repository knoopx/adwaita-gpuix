import { BASE_HUES } from "./tokens";
import { type AdwaitaTheme } from "./adwaita";
import type { DiffTokenKind } from "../lib/vcs/tokens";

/** The height of every row a diff draws, so a long one can virtualise. */
export const DIFF_ROW_HEIGHT = 21;

/** The size of a diff's mono text: code is read, not skimmed, so it stays small. */
export const DIFF_TEXT_SIZE = 12;

/** How far a diff row's ink stands in from the pane edge. */
export const DIFF_ROW_INSET = 12;

/**
 * The colours a line of source reads in, from this scheme's own hues.
 *
 * A keyword takes the accent, because it is the one hue the person using the
 * app chose and the mark that makes a line scan; the rest sit on the scheme's
 * hues so a green string stays green whatever the accent is. Comments are the
 * dim text role — they are the least of what is on screen.
 */
export function codePalette(
  t: AdwaitaTheme,
): Record<DiffTokenKind, string> {
  const scale = t.color.scale;
  return {
    plain: t.color.text.primary,
    keyword: t.color.accent.base,
    type: scale[BASE_HUES.teal],
    function: scale[BASE_HUES.blue],
    property: scale[BASE_HUES.purple],
    constant: scale[BASE_HUES.orange],
    number: scale[BASE_HUES.yellow],
    string: scale[BASE_HUES.green],
    comment: t.color.text.dim,
  };
}
