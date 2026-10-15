import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react'

/**
 * Adwaita theme — the React-facing layer.
 *
 * The design *values* live in {@link ./tokens} (the token system). This module
 * turns a resolved semantic token set into the flat `AdwaitaTheme` shape the
 * component library consumes, and provides the `<AdwaitaProvider>` React
 * context (an `AdwStyleManager` analogue).
 */
import {
  type ColorScheme,
  type AccentKey,
  type SemanticTokens,
  ACCENTS,
  RADIUS,
  SPACE,
  TYPE,
  resolveTokens,
  tokensToDtcg,
  tokensToDtcgAll,
  hexToRgba,
  shade,
  accentForeground,
} from './tokens'

// Re-export the token system so consumers can reach the primitives + DTCG
// export through the theme entrypoint.
export {
  ACCENTS,
  RADIUS,
  SPACE,
  TYPE,
  resolveTokens,
  tokensToDtcg,
  tokensToDtcgAll,
  hexToRgba,
  shade,
  accentForeground,
}
export type { ColorScheme, AccentKey, SemanticTokens }

/**
 * Flat colour field names the component library reads (`theme.colors.*`).
 * A projection of the semantic colour tokens onto the legacy flat shape.
 */
export interface AdwaitaColors {
  window_bg: string
  view_bg: string
  headerbar_bg: string
  sidebar_bg: string
  fg: string
  dim_fg: string
  accent: string
  destructive: string
  success: string
  warning: string
  border: string
  button_bg: string
  button_hover: string
  button_active: string
  accent_fg: string
  destructive_fg: string
  accentTint: string
  destructiveTint: string
  successTint: string
  warningTint: string
}

/** Project a resolved semantic token set onto the legacy flat `colors` shape. */
function toFlatColors(t: SemanticTokens): AdwaitaColors {
  const c = t.color
  return {
    window_bg: c.surface.window,
    view_bg: c.surface.view,
    headerbar_bg: c.surface.headerbar,
    sidebar_bg: c.surface.sidebar,
    fg: c.text.primary,
    dim_fg: c.text.dim,
    accent: c.accent.base,
    destructive: c.functional.destructive,
    success: c.functional.success,
    warning: c.functional.warning,
    border: c.border.default,
    button_bg: c.surface.button,
    button_hover: c.surface.buttonHover,
    button_active: c.surface.buttonActive,
    accent_fg: c.text.onAccent,
    destructive_fg: c.functional.destructiveFg,
    accentTint: c.accent.tint,
    destructiveTint: c.functional.destructiveTint,
    successTint: c.functional.successTint,
    warningTint: c.functional.warningTint,
  }
}

/** A fully-resolved theme for one `(scheme, accent)` pair. */
export interface AdwaitaTheme {
  scheme: ColorScheme
  accent: AccentKey
  /** Legacy flat colour fields (what components read). */
  colors: AdwaitaColors
  /** Corner radii (px). */
  radii: {
    window: number
    card: number
    row: number
    button: number
    pill: number
  }
  /** Type scale (px). */
  typography: {
    title1: number
    title2: number
    title3: number
    title4: number
    body: number
    caption: number
    fontFamily: string
    fontFamilyMono: string
  }
  /** Spacing scale (px). */
  spacing: {
    gap: number
    padding: number
    paddingTight: number
    rowHeight: number
  }
  /** The full semantic token set (structured). */
  tokens: SemanticTokens
}

/** Build a fully-resolved theme from a scheme + accent key. */
export function buildTheme(scheme: ColorScheme, accent: AccentKey): AdwaitaTheme {
  const tokens = resolveTokens(scheme, accent)
  return {
    scheme,
    accent,
    colors: toFlatColors(tokens),
    radii: tokens.radius,
    typography: tokens.typography,
    spacing: {
      gap: tokens.space.gap,
      padding: tokens.space.padding,
      paddingTight: tokens.space.paddingTight,
      rowHeight: 40,
    },
    tokens,
  }
}

/** React context holding the resolved theme (an `AdwStyleManager` analogue). */
export const AdwaitaContext = createContext<AdwaitaTheme | null>(null)

export interface AdwaitaProviderProps {
  scheme?: ColorScheme
  accent?: AccentKey
  children?: ReactNode
}

/** Provide a light/dark + accent theme to the subtree. */
export function AdwaitaProvider({ scheme = 'light', accent = 'blue', children }: AdwaitaProviderProps) {
  const theme = useMemo(() => buildTheme(scheme, accent), [scheme, accent])
  return createElement(AdwaitaContext.Provider, { value: theme }, children)
}

/** Resolved Adwaita tokens for the current `<AdwaitaProvider>`. */
export function useAdwaita(): AdwaitaTheme {
  const ctx = useContext(AdwaitaContext)
  if (!ctx) throw new Error('useAdwaita() must be used within an <AdwaitaProvider>')
  return ctx
}
