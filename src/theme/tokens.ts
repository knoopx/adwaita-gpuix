/**
 * Adwaita design token system.
 *
 * Single source of truth for every design value in the library, organised in
 * three layers (per the W3C Design Tokens Community Group model):
 *
 *   1. PRIMITIVE  — raw Adwaita palette / scale values. Scheme-agnostic names,
 *                   no meaning. (`color.accent.blue`, `radius.lg`, `space.md` …)
 *   2. SEMANTIC   — primitive → role mapping, resolved per `(scheme, accent)`.
 *                   What a value *means*: `color.surface.view`,
 *                   `color.functional.destructive`, `text.primary` …
 *   3. COMPONENT  — lives on the components themselves (not centralised here).
 *
 * `resolveTokens(scheme, accent)` returns the fully-resolved semantic token set
 * for one theme. `tokensToDtcg()` serialises it to a W3C DTCG JSON object for
 * Figma / Style-Dictionary / token-studio tooling.
 */

/** The colour schemes the library can resolve. */
export type ColorScheme = 'light' | 'dark' | 'nightsky'

/** Every scheme the library ships, in presentation order. */
export const SCHEMES: ColorScheme[] = ['light', 'dark', 'nightsky']

/** True for schemes whose surfaces are dark (drives dark-branch component styling). */
export function isDarkScheme(scheme: ColorScheme): boolean {
  return scheme === 'dark' || scheme === 'nightsky'
}

/** The 9 libadwaita accent colour keys. */
export type AccentKey =
  | 'blue'
  | 'teal'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'purple'
  | 'slate'

/* ─────────────────────────────────────────────────────────────────────────
 * 1. PRIMITIVE tokens — raw Adwaita values
 * ───────────────────────────────────────────────────────────────────────── */

/** The 9 Adwaita accent hues (hex). */
export const ACCENTS: Record<AccentKey, string> = {
  blue: '#3584e4',
  teal: '#00a19a',
  green: '#26a269',
  yellow: '#e5a50a',
  orange: '#e7772b',
  red: '#c01c28',
  pink: '#a51e67',
  purple: '#9141ac',
  slate: '#5e5c64',
}

/**
 * Nightsky — a dark indigo "night sky" palette extracted from the
 * `adw-gtk3` GTK4 theme (`~/.themes/adw-gtk3/gtk-4.0/`).
 *
 * Every value is traceable to a line in that reference:
 *   - `gtk.css`               — the theme's @define-color overrides (its identity)
 *   - `libadwaita-tweaks.css` — the 9 libadwaita accent-key values (:root vars)
 *   - `libadwaita.css`        — state formulas (currentColor mixes) + stock defines
 *
 * Values the reference cannot express (dim text, functional tints) use the
 * library's existing dark-scheme conventions and are marked `approximated`.
 */
export const NIGHTSKY = {
  /**
   * The theme's own default accent — starlight yellow.
   * gtk.css: @define-color accent_color #fad000; (accent_bg_color #fad000)
   */
  defaultAccent: '#fad000',
  /**
   * Foreground on the accent (default accent and all accent keys).
   * gtk.css: @define-color accent_fg_color #191033;
   * (libadwaita-tweaks.css `--accent-fg-color: @accent_fg_color` resolves to the same value)
   */
  accentFg: '#191033',
  /**
   * The 9 libadwaita accent-key values this theme ships.
   * libadwaita-tweaks.css :root — --accent-blue … --accent-slate.
   */
  accents: {
    blue: '#3584e4',
    teal: '#2190a4',
    green: '#3a944a',
    yellow: '#c88800',
    orange: '#ed5b00',
    red: '#e62d42',
    pink: '#d56199',
    purple: '#9141ac',
    slate: '#6f8396',
  },
  /** Neutral surface layering. */
  neutrals: {
    // gtk.css: @define-color window_bg_color #191033;
    window: '#191033',
    // gtk.css: @define-color view_bg_color #191033;
    view: '#191033',
    // gtk.css: @define-color headerbar_bg_color #211641;
    headerbar: '#211641',
    // gtk.css: @define-color sidebar_bg_color #211641;
    sidebar: '#211641',
    // gtk.css: @define-color card_bg_color #211641;
    card: '#211641',
    // libadwaita.css `button { background-color: color-mix(in srgb, currentColor 10%, transparent); }`
    // with currentColor = view_fg #f8f8f8 (gtk.css) → rgba(248,248,248,0.1)
    button: 'rgba(248,248,248,0.1)',
    // libadwaita.css `button:hover { … currentColor 15%, transparent }` → rgba(248,248,248,0.15)
    buttonHover: 'rgba(248,248,248,0.15)',
    // libadwaita.css `button:active, button:checked { … currentColor 30%, transparent }` → rgba(248,248,248,0.3)
    buttonActive: 'rgba(248,248,248,0.3)',
  },
  /** Text colours. */
  text: {
    // gtk.css: @define-color window_fg_color #f8f8f8; (also view_fg_color / headerbar_fg_color)
    primary: '#f8f8f8',
    // approximated — the reference defines no dim/secondary text token;
    // library dark-scheme convention: primary at 0.55 alpha
    dim: 'rgba(248,248,248,0.55)',
  },
  /**
   * Hairline border.
   * libadwaita.css: @define-color borders color-mix(in srgb, currentColor 15%, transparent);
   * with currentColor = #f8f8f8 → rgba(248,248,248,0.15).
   * (gtk.css headerbar_border_color rgba(0.128906,0.085938,0.253906,0.7) = #211641 @ 0.7
   * is the headerbar-specific border; the generic hairline follows `borders`.)
   */
  border: 'rgba(248,248,248,0.15)',
  /** Functional colours. */
  functional: {
    // gtk.css: @define-color destructive_color #ff628c; (destructive_bg_color #ff628c)
    destructive: '#ff628c',
    // gtk.css: @define-color destructive_fg_color #191033;
    destructiveFg: '#191033',
    // gtk.css: @define-color success_color #a5ff90; (success_bg_color #a5ff90)
    success: '#a5ff90',
    // gtk.css: @define-color warning_color #faefa5; (warning_bg_color #faefa5)
    warning: '#faefa5',
  },
  /**
   * Reference-only extras (not part of the flat theme API; kept for provenance):
   *   gtk.css scrollbar_outline_color #32245d;
   *   gtk.css orange_1..5 #ffb454;  brown_1..5 #fb94ff;  light_1..5 / dark_1..5 #f8f8f8
   */
  extras: {
    scrollbarOutline: '#32245d',
    orange: '#ffb454',
    magenta: '#fb94ff',
  },
} as const

/** Scheme-specific neutral surface primitives. */
const NEUTRALS: Record<ColorScheme, {
  window: string
  view: string
  headerbar: string
  sidebar: string
  card: string
  button: string
  buttonHover: string
  buttonActive: string
}> = {
  light: {
    window: '#fafafa',
    view: '#ffffff',
    headerbar: '#ffffff',
    sidebar: '#f0f0f0',
    // libadwaita.css:82 — @define-color card_bg_color #ffffff;
    card: '#ffffff',
    button: '#f6f6f6',
    buttonHover: '#ececec',
    buttonActive: '#e0e0e0',
  },
  dark: {
    window: '#242424',
    view: '#303030',
    headerbar: '#2a2a2a',
    sidebar: '#2e2e2e',
    // libadwaita.css:94 (prefers-color-scheme: dark) — card_bg_color RGB(255 255 255 / 8%);
    card: 'rgba(255,255,255,0.08)',
    button: '#3a3a3a',
    buttonHover: '#454545',
    buttonActive: '#515151',
  },
  nightsky: NIGHTSKY.neutrals,
}

/** Foreground / text primitives. */
const TEXT: Record<ColorScheme, { primary: string; dim: string }> = {
  light: { primary: '#2e2e2e', dim: 'rgba(0,0,0,0.55)' },
  dark: { primary: '#ffffff', dim: 'rgba(255,255,255,0.55)' },
  nightsky: {
    primary: NIGHTSKY.text.primary,
    dim: NIGHTSKY.text.dim, // approximated (see NIGHTSKY.text.dim)
  },
}

/** Hairline border primitives. */
const BORDER: Record<ColorScheme, string> = {
  light: 'rgba(0,0,0,0.15)',
  dark: 'rgba(255,255,255,0.15)',
  nightsky: NIGHTSKY.border,
}

/** Functional base colours (scheme-specific where they differ). */
const FUNCTIONAL: Record<ColorScheme, { destructive: string; success: string; warning: string; destructiveFg?: string }> = {
  light: { destructive: '#c01c28', success: '#26a269', warning: '#e5a50a' },
  dark: { destructive: '#ed333b', success: '#26a269', warning: '#e5a50a' },
  nightsky: {
    destructive: NIGHTSKY.functional.destructive,
    success: NIGHTSKY.functional.success,
    warning: NIGHTSKY.functional.warning,
    // gtk.css: destructive_fg_color / success_fg_color / warning_fg_color #191033
    destructiveFg: NIGHTSKY.accentFg,
  },
}

/** Primitive corner-radius scale (px). */
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  full: 999,
} as const

/** Primitive spacing scale (px). */
export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

/** Primitive type scale (px) + family. */
export const TYPE = {
  title1: 20,
  title2: 16,
  title3: 15,
  title4: 14,
  body: 14,
  caption: 12,
  /** UI sans family. */
  fontFamily: 'Inter',
  /**
   * Monospace family — the installed Nerd Fonts build of JetBrains Mono.
   * The plain "JetBrains Mono" family is not installed; "JetBrainsMono
   * Nerd Font Mono" is the strictly-monospaced variant (no icon glyphs),
   * per the Nerd Fonts docs.
   */
  fontFamilyMono: 'JetBrainsMono Nerd Font Mono',
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const

/* ─────────────────────────────────────────────────────────────────────────
 * Colour helpers
 * ───────────────────────────────────────────────────────────────────────── */

/** `#rrggbb` + alpha → `rgba(r,g,b,a)`. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

/** Lighten (`pct > 0`) or darken (`pct < 0`) a `#rrggbb` colour. */
export function shade(hex: string, pct: number): string {
  const h = hex.replace('#', '')
  let r = parseInt(h.slice(0, 2), 16)
  let g = parseInt(h.slice(2, 4), 16)
  let b = parseInt(h.slice(4, 6), 16)
  const target = pct < 0 ? 0 : 255
  const p = Math.abs(pct)
  r = Math.round((target - r) * p) + r
  g = Math.round((target - g) * p) + g
  b = Math.round((target - b) * p) + b
  return `rgb(${r},${g},${b})`
}

function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** A readable foreground colour for a given accent background. */
export function accentForeground(accent: string): string {
  return luminance(accent) > 0.5 ? '#2e2e2e' : '#ffffff'
}

/* ─────────────────────────────────────────────────────────────────────────
 * 2. SEMANTIC tokens — resolved per (scheme, accent)
 * ───────────────────────────────────────────────────────────────────────── */

export interface SemanticColors {
  /** Surface layering (window < view < card). */
  surface: {
    window: string
    view: string
    headerbar: string
    sidebar: string
    card: string
    button: string
    buttonHover: string
    buttonActive: string
  }
  /** Text. */
  text: {
    primary: string
    dim: string
    onAccent: string
  }
  /** Accent (accent-driven). */
  accent: {
    base: string
    tint: string
    fg: string
  }
  /** Functional colours. */
  functional: {
    destructive: string
    destructiveTint: string
    destructiveFg: string
    success: string
    successTint: string
    warning: string
    warningTint: string
  }
  /** Hairline borders. */
  border: {
    default: string
  }
}

export interface SemanticTokens {
  color: SemanticColors
  radius: {
    window: number
    card: number
    row: number
    button: number
    pill: number
  }
  space: {
    gap: number
    padding: number
    paddingTight: number
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
}

/**
 * Resolve the full semantic token set for one `(scheme, accent)` pair.
 *
 * `accent` may be omitted (`null`): the scheme then uses its own default
 * accent — `blue` for `light`/`dark`, the starlight `#fad000` for `nightsky`
 * (gtk.css `accent_color`).
 */
export function resolveTokens(scheme: ColorScheme, accent?: AccentKey | null): SemanticTokens {
  const n = NEUTRALS[scheme]
  const accentBase =
    scheme === 'nightsky'
      ? (accent ? NIGHTSKY.accents[accent] : NIGHTSKY.defaultAccent)
      : ACCENTS[accent ?? 'blue']
  const dark = isDarkScheme(scheme)
  const f = FUNCTIONAL[scheme]
  // Nightsky pins its on-accent foreground (gtk.css accent_fg_color #191033);
  // light/dark derive a readable foreground from the accent's luminance.
  const onAccent = scheme === 'nightsky' ? NIGHTSKY.accentFg : accentForeground(accentBase)

  return {
    color: {
      surface: {
        window: n.window,
        view: n.view,
        headerbar: n.headerbar,
        sidebar: n.sidebar,
        card: n.card,
        button: n.button,
        buttonHover: n.buttonHover,
        buttonActive: n.buttonActive,
      },
      text: {
        primary: TEXT[scheme].primary,
        dim: TEXT[scheme].dim,
        onAccent,
      },
      accent: {
        base: accentBase,
        tint: hexToRgba(accentBase, dark ? 0.22 : 0.12),
        fg: onAccent,
      },
      functional: {
        destructive: f.destructive,
        destructiveTint: hexToRgba(f.destructive, dark ? 0.28 : 0.12),
        // light/dark: white on destructive; nightsky: gtk.css destructive_fg_color #191033
        destructiveFg: f.destructiveFg ?? '#ffffff',
        success: f.success,
        successTint: hexToRgba(f.success, dark ? 0.24 : 0.14),
        warning: f.warning,
        warningTint: hexToRgba(f.warning, dark ? 0.24 : 0.16),
      },
      border: {
        default: BORDER[scheme],
      },
    },
    radius: {
      window: RADIUS.lg,
      card: RADIUS.lg,
      row: RADIUS.md,
      button: RADIUS.sm,
      pill: RADIUS.full,
    },
    space: {
      gap: SPACE.sm,
      padding: SPACE.lg,
      paddingTight: SPACE.md,
    },
    typography: {
      title1: TYPE.title1,
      title2: TYPE.title2,
      title3: TYPE.title3,
      title4: TYPE.title4,
      body: TYPE.body,
      caption: TYPE.caption,
      fontFamily: TYPE.fontFamily,
      fontFamilyMono: TYPE.fontFamilyMono,
    },
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Machine-readable export (W3C DTCG)
 * ───────────────────────────────────────────────────────────────────────── */

/** Wrap a leaf value in a DTCG node. */
function v(value: string | number): { value: string | number } {
  return { value }
}

/**
 * Serialise the primitive palette + a resolved semantic set to a W3C DTCG
 * JSON object (leaf nodes carry `{ value }`). Suitable for token-studio,
 * Style Dictionary, or Figma plugin import.
 */
export function tokensToDtcg(scheme: ColorScheme, accent?: AccentKey | null): Record<string, unknown> {
  const t = resolveTokens(scheme, accent)
  const c = t.color
  // Primitive accent map: the 9-key Adwaita palette, except nightsky ships its
  // own 9-key palette (libadwaita-tweaks.css) plus the theme default accent.
  const accentPrimitives =
    scheme === 'nightsky'
      ? Object.fromEntries([
          ...Object.entries(NIGHTSKY.accents).map(([k, val]) => [k, v(val)]),
          ['default', v(NIGHTSKY.defaultAccent)],
        ])
      : Object.fromEntries(Object.entries(ACCENTS).map(([k, val]) => [k, v(val)]))
  return {
    color: {
      primitive: {
        accent: accentPrimitives,
        neutral: {
          [scheme]: Object.fromEntries(Object.entries(NEUTRALS[scheme]).map(([k, val]) => [k, v(val)])),
        },
      },
      // semantic (resolved for this scheme + accent)
      surface: {
        window: v(c.surface.window),
        view: v(c.surface.view),
        headerbar: v(c.surface.headerbar),
        sidebar: v(c.surface.sidebar),
        card: v(c.surface.card),
        button: v(c.surface.button),
        'button-hover': v(c.surface.buttonHover),
        'button-active': v(c.surface.buttonActive),
      },
      text: {
        primary: v(c.text.primary),
        dim: v(c.text.dim),
        'on-accent': v(c.text.onAccent),
      },
      accent: {
        base: v(c.accent.base),
        tint: v(c.accent.tint),
        fg: v(c.accent.fg),
      },
      destructive: {
        base: v(c.functional.destructive),
        tint: v(c.functional.destructiveTint),
        fg: v(c.functional.destructiveFg),
      },
      success: {
        base: v(c.functional.success),
        tint: v(c.functional.successTint),
      },
      warning: {
        base: v(c.functional.warning),
        tint: v(c.functional.warningTint),
      },
      border: {
        default: v(c.border.default),
      },
    },
    radius: {
      window: v(t.radius.window),
      card: v(t.radius.card),
      row: v(t.radius.row),
      button: v(t.radius.button),
      pill: v(t.radius.pill),
    },
    space: {
      gap: v(t.space.gap),
      padding: v(t.space.padding),
      'padding-tight': v(t.space.paddingTight),
    },
    typography: {
      title1: v(t.typography.title1),
      title2: v(t.typography.title2),
      title3: v(t.typography.title3),
      title4: v(t.typography.title4),
      body: v(t.typography.body),
      caption: v(t.typography.caption),
      'font-family': v(t.typography.fontFamily),
      'font-family-mono': v(t.typography.fontFamilyMono),
    },
  }
}

/** Export every `(scheme, accent)` combination as a DTCG JSON document. */
export function tokensToDtcgAll(): Record<string, unknown> {
  const accents = Object.keys(ACCENTS) as AccentKey[]
  const out: Record<string, unknown> = {}
  for (const s of SCHEMES) {
    for (const a of accents) {
      out[`${s}-${a}`] = tokensToDtcg(s, a)
    }
  }
  // Nightsky's own default accent (gtk.css accent_color #fad000).
  out['nightsky-default'] = tokensToDtcg('nightsky', null)
  return out
}
