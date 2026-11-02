import {
  APPEARANCE,
  type AdwaitaTheme,
  buildNightskyTheme,
} from "../theme/adwaita";
import { type GpuixTheme } from "@gpuix/react";

export const MONO = buildNightskyTheme().type.fontFamilyMono;

export const FILE_HEADER_ROW_HEIGHT = 36;

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
    diffHunkBg: t.color.surface.headerbar,
    fontSans: t.type.fontFamily,
    fontMono: t.type.fontFamilyMono,
    ...(fileHeaderHeight === undefined
      ? {}
      : { metrics: { diffFileHeaderHeight: fileHeaderHeight } }),
  };
}
