import { type AdwaitaTheme } from "./adwaita";

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

export function toneColor(t: AdwaitaTheme, tone: Tone): string {
  return BASE_BY_TONE[tone](t);
}

export function toneTint(t: AdwaitaTheme, tone: Tone): string {
  return TINT_BY_TONE[tone](t);
}

export function textToneColor(t: AdwaitaTheme, tone: TextTone): string {
  if (tone === "default") return t.color.text.primary;
  if (tone === "dim") return t.color.text.dim;
  return toneColor(t, tone);
}
