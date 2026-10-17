import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react'

import {
  type ColorScheme,
  type AccentKey,
  type SemanticTokens,
  SCHEMES,
  NIGHTSKY,
  isDarkScheme,
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

export {
  SCHEMES,
  NIGHTSKY,
  isDarkScheme,
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

export interface AdwaitaTheme {
  scheme: ColorScheme

  accent: AccentKey | null

  colors: AdwaitaColors

  radii: {
    window: number
    card: number
    row: number
    button: number
    pill: number
  }

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

  spacing: {
    gap: number
    padding: number
    paddingTight: number
    rowHeight: number
  }

  tokens: SemanticTokens
}

export function buildTheme(scheme: ColorScheme, accent?: AccentKey | null): AdwaitaTheme {
  const tokens = resolveTokens(scheme, accent ?? null)
  return {
    scheme,
    accent: accent ?? null,
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

export const AdwaitaContext = createContext<AdwaitaTheme | null>(null)

export interface AdwaitaProviderProps {
  scheme?: ColorScheme

  accent?: AccentKey | null
  children?: ReactNode
}

export function AdwaitaProvider({ scheme = 'light', accent = null, children }: AdwaitaProviderProps) {
  const theme = useMemo(() => buildTheme(scheme, accent), [scheme, accent])
  return createElement(AdwaitaContext.Provider, { value: theme }, children)
}

export function buildNightskyTheme(accent?: AccentKey): AdwaitaTheme {
  return buildTheme('nightsky', accent)
}

export function useAdwaita(): AdwaitaTheme {
  const ctx = useContext(AdwaitaContext)
  if (!ctx) throw new Error('useAdwaita() must be used within an <AdwaitaProvider>')
  return ctx
}
