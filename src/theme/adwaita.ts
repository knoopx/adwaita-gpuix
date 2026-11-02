import {
  type ReactNode,
  createContext,
  createElement,
  useContext,
  useMemo,
} from "react";
import {
  ACCENTS,
  ACCENT_SETS,
  APPEARANCE,
  type AccentKey,
  CHART_FILL,
  CHART_SERIES,
  CHART_SUN,
  CONTROL,
  type ColorScheme,
  DIVIDER,
  INPUT_FILL,
  NIGHTSKY,
  OSD_FG,
  RADIUS,
  SCHEMES,
  SELECTION,
  SPACE,
  type SemanticColors,
  type SemanticTokens,
  TINT_ALPHA,
  TYPE,
  accentForeground,
  hexToRgba,
  isDarkScheme,
  resolveTokens,
  shade,
  tokensToDtcg,
  tokensToDtcgAll,
} from "./tokens";

export {
  SCHEMES,
  NIGHTSKY,
  isDarkScheme,
  ACCENTS,
  ACCENT_SETS,
  TINT_ALPHA,
  SELECTION,
  DIVIDER,
  APPEARANCE,
  INPUT_FILL,
  OSD_FG,
  CHART_SERIES,
  CHART_FILL,
  CHART_SUN,
  RADIUS,
  CONTROL,
  SPACE,
  TYPE,
  resolveTokens,
  tokensToDtcg,
  tokensToDtcgAll,
  hexToRgba,
  shade,
  accentForeground,
};
export type { ColorScheme, AccentKey, SemanticColors, SemanticTokens };

export interface AdwaitaTheme extends SemanticTokens {
  scheme: ColorScheme;
  accent: AccentKey | null;
}

export function buildTheme(
  scheme: ColorScheme,
  accent?: AccentKey | null,
): AdwaitaTheme {
  return {
    scheme,
    accent: accent ?? null,
    ...resolveTokens(scheme, accent ?? null),
  };
}

export function selectionBg(t: AdwaitaTheme, focused = true): string {
  return focused ? t.color.accent.tint : t.color.selection.muted;
}

export function rowHoverBg(t: AdwaitaTheme): string {
  return t.color.surface.hover;
}

export function headerStripBg(t: AdwaitaTheme): string {
  return t.color.surface.header;
}

export const AdwaitaContext = createContext<AdwaitaTheme | null>(null);

export interface AdwaitaProviderProps {
  scheme?: ColorScheme;

  accent?: AccentKey | null;
  children?: ReactNode;
}

export function AdwaitaProvider({
  scheme = "light",
  accent = null,
  children,
}: AdwaitaProviderProps) {
  const theme = useMemo(() => buildTheme(scheme, accent), [scheme, accent]);
  return createElement(AdwaitaContext.Provider, { value: theme }, children);
}

export function buildNightskyTheme(accent?: AccentKey): AdwaitaTheme {
  return buildTheme("nightsky", accent);
}

export function useAdwaita(): AdwaitaTheme {
  const ctx = useContext(AdwaitaContext);
  if (!ctx)
    throw new Error("useAdwaita() must be used within an <AdwaitaProvider>");
  return ctx;
}
