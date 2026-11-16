import {
  APPEARANCE,
  type AdwaitaTheme,
  buildNightskyTheme,
} from "../theme/adwaita";
import { type GpuixTheme } from "@gpuix/react";

export const MONO = buildNightskyTheme().type.fontFamilyMono;

export const FILE_HEADER_ROW_HEIGHT = 36;

/** Blend one hex toward another by a share of the distance. The library's only colour
 * arithmetic, kept for the one question a palette cannot answer: how far a band stands
 * from the surface it is drawn on. */
function toward(from: string, to: string, share: number): string {
  const chan = (hex: string, at: number) => parseInt(hex.replace("#", "").slice(at, at + 2), 16);
  const w = Math.max(0, Math.min(1, share));
  const mix = (at: number) =>
    Math.round(chan(from, at) + (chan(to, at) - chan(from, at)) * w)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

/** How far a patch's own header rows stand from the surface the patch is drawn on, as a
 * share of the way to the scheme's ink. */
export const DIFF_HEADER_RAISE = 0.12;

/** The band a patch's `@@` and per-file rows wear, for a patch drawn on the app's page.
 *
 * A patch's rows are told apart by colour — green for what was added, red for what was
 * taken — so its header must not be the loudest band on the card. It must not be the
 * colour of the page *around* the card either: an app that draws the patch on a wash of
 * its own then gets a strip of the page running across the middle of the diff.
 *
 * Measured toward the scheme's own ink, the step is *up* in a dark scheme and *down* in
 * a light one, so this answers the one case it is measured for: a patch standing on the
 * page itself, in a pane the library frames. An app that sinks the patch into a plate of
 * its own — a well under the page — cannot be served by measuring the page at all: the
 * header lands on the plate it is drawn on and says nothing, or stands over the rows it
 * labels and outshouts them. Such an app names its own surface through
 * `DiffTextProps.headerFill`. */
export function diffHeaderFill(t: AdwaitaTheme): string {
  return toward(
    t.color.surface.headerbar,
    t.color.text.primary,
    DIFF_HEADER_RAISE,
  );
}

export function nativeDiffTheme(
  t: AdwaitaTheme,
  opts?: { fileHeaderHeight?: number },
): GpuixTheme {
  const fileHeaderHeight = opts?.fileHeaderHeight;
  return {
    appearance: APPEARANCE[t.scheme],
    bg: t.color.surface.view,
    border: t.color.border.default,
    text: t.color.text.primary,
    textMuted: t.color.text.dim,
    textDim: t.color.text.dim,
    textFaint: t.color.text.dim,
    accent: t.color.accent.base,
    diffAdd: t.color.functional.successTint,
    diffDel: t.color.functional.destructiveTint,
    diffHunkBg: diffHeaderFill(t),
    fontSans: t.type.fontFamily,
    fontMono: t.type.fontFamilyMono,
    ...(fileHeaderHeight === undefined
      ? {}
      : { metrics: { diffFileHeaderHeight: fileHeaderHeight } }),
  };
}
