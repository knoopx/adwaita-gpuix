import { type AdwaitaTheme } from "./adwaita";
import { BASE_HUES, TINT_ALPHA, tintOnto } from "./tokens";

export type Tone = "accent" | "success" | "warning" | "destructive";

export type TextTone = "default" | "dim" | Tone;

const BASE_BY_TONE: Record<Tone, (t: AdwaitaTheme) => string> = {
  accent: (t) => t.color.accent.base,
  success: (t) => t.color.functional.success,
  warning: (t) => t.color.functional.warning,
  destructive: (t) => t.color.functional.destructive,
};

const TINT_BY_TONE: Record<Tone, (t: AdwaitaTheme) => string> = {
  accent: (t) => t.color.accent.tint,
  success: (t) => t.color.functional.successTint,
  warning: (t) => t.color.functional.warningTint,
  destructive: (t) => t.color.functional.destructiveTint,
};

const ALPHA_BY_TONE: Record<Tone, (t: AdwaitaTheme) => number> = {
  accent: (t) => TINT_ALPHA[t.scheme].accent,
  success: (t) => TINT_ALPHA[t.scheme].success,
  warning: (t) => TINT_ALPHA[t.scheme].warning,
  destructive: (t) => TINT_ALPHA[t.scheme].destructive,
};

export function toneColor(t: AdwaitaTheme, tone: Tone): string {
  return BASE_BY_TONE[tone](t);
}

export function toneTint(t: AdwaitaTheme, tone: Tone): string {
  return TINT_BY_TONE[tone](t);
}

/**
 * The tone a surface wears as its own fill. `toneTint` is translucent and sits
 * on a page surface you can see through; a surface that floats over content —
 * a toast, an OSD — answers with the same tone at the same weight, baked into
 * `over`, so nothing shows through it.
 */
export function toneFill(t: AdwaitaTheme, tone: Tone, over: string): string {
  return tintOnto(over, toneColor(t, tone), ALPHA_BY_TONE[tone](t));
}

/**
 * The sixteen colours an SGR index resolves to, in the scheme's own set: its
 * BASE16 hues for the six coloured slots and its text roles for the four
 * neutrals, so a command's red is this theme's red and its "black" is a grey
 * the box's own fill cannot swallow. The two halves of the list are the same
 * eight — a terminal's *bright* colour is the same hue asked to read louder,
 * and the box answers that with weight, which is what a scheme that ships one
 * shade per hue has to do anyway.
 *
 * A scheme with no blue says so: nightsky's blue slot is its yellow `#fad000`,
 * because that is the hue this theme paints with.
 */
export function ansiPalette(t: AdwaitaTheme): readonly string[] {
  const scale = t.color.scale;
  const hue = (name: keyof typeof BASE_HUES) => scale[BASE_HUES[name]];
  const eight = [
    t.color.text.dim,
    hue("red"),
    hue("green"),
    hue("yellow"),
    hue("blue"),
    hue("pink"),
    hue("teal"),
    t.color.text.primary,
  ];
  return [...eight, ...eight];
}

export function textToneColor(t: AdwaitaTheme, tone: TextTone): string {
  if (tone === "default") return t.color.text.primary;
  if (tone === "dim") return t.color.text.dim;
  return toneColor(t, tone);
}
