import {
  APPEARANCE,
  buildNightskyTheme,
  type AdwaitaTheme,
} from "../theme/adwaita";
import type { GpuixTheme } from "@gpuix/react";


export const MONO = buildNightskyTheme().typography.fontFamilyMono;


export function nativeDiffTheme(t: AdwaitaTheme): GpuixTheme {
  return {
    appearance: APPEARANCE[t.scheme],
    bg: t.colors.view_bg,
    border: t.colors.border,
    text: t.colors.fg,
    textMuted: t.colors.dim_fg,
    textDim: t.colors.dim_fg,
    textFaint: t.colors.dim_fg,
    accent: t.colors.accent,
    diffAdd: t.colors.successTint,
    diffDel: t.colors.destructiveTint,
    diffHunkBg: t.colors.headerbar_bg,
    fontSans: t.typography.fontFamily,
    fontMono: t.typography.fontFamilyMono,
  };
}
