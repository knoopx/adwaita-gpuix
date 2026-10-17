export type ColorScheme = 'light' | 'dark' | 'nightsky'

export const SCHEMES: ColorScheme[] = ['light', 'dark', 'nightsky']

export function isDarkScheme(scheme: ColorScheme): boolean {
  return scheme === 'dark' || scheme === 'nightsky'
}

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

export const NIGHTSKY = {

  defaultAccent: '#fad000',

  accentFg: '#191033',

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

  neutrals: {

    window: '#191033',

    view: '#191033',

    headerbar: '#211641',

    sidebar: '#211641',

    card: '#211641',


    button: 'rgba(248,248,248,0.1)',

    buttonHover: 'rgba(248,248,248,0.15)',

    buttonActive: 'rgba(248,248,248,0.3)',
  },

  text: {

    primary: '#f8f8f8',


    dim: 'rgba(248,248,248,0.55)',
  },

  border: 'rgba(248,248,248,0.15)',

  functional: {

    destructive: '#ff628c',

    destructiveFg: '#191033',

    success: '#a5ff90',

    warning: '#faefa5',
  },

  extras: {
    scrollbarOutline: '#32245d',
    orange: '#ffb454',
    magenta: '#fb94ff',
  },
} as const

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

    card: 'rgba(255,255,255,0.08)',
    button: '#3a3a3a',
    buttonHover: '#454545',
    buttonActive: '#515151',
  },
  nightsky: NIGHTSKY.neutrals,
}

const TEXT: Record<ColorScheme, { primary: string; dim: string }> = {
  light: { primary: '#2e2e2e', dim: 'rgba(0,0,0,0.55)' },
  dark: { primary: '#ffffff', dim: 'rgba(255,255,255,0.55)' },
  nightsky: {
    primary: NIGHTSKY.text.primary,
    dim: NIGHTSKY.text.dim,
  },
}

const BORDER: Record<ColorScheme, string> = {
  light: 'rgba(0,0,0,0.15)',
  dark: 'rgba(255,255,255,0.15)',
  nightsky: NIGHTSKY.border,
}

const FUNCTIONAL: Record<ColorScheme, { destructive: string; success: string; warning: string; destructiveFg?: string }> = {
  light: { destructive: '#c01c28', success: '#26a269', warning: '#e5a50a' },
  dark: { destructive: '#ed333b', success: '#26a269', warning: '#e5a50a' },
  nightsky: {
    destructive: NIGHTSKY.functional.destructive,
    success: NIGHTSKY.functional.success,
    warning: NIGHTSKY.functional.warning,

    destructiveFg: NIGHTSKY.accentFg,
  },
}

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  full: 999,
} as const

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const

export const TYPE = {
  title1: 20,
  title2: 16,
  title3: 15,
  title4: 14,
  body: 14,
  caption: 12,

  fontFamily: 'Inter',

  fontFamilyMono: 'JetBrainsMono Nerd Font Mono',
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

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

export function accentForeground(accent: string): string {
  return luminance(accent) > 0.5 ? '#2e2e2e' : '#ffffff'
}

export interface SemanticColors {

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

  text: {
    primary: string
    dim: string
    onAccent: string
  }

  accent: {
    base: string
    tint: string
    fg: string
  }

  functional: {
    destructive: string
    destructiveTint: string
    destructiveFg: string
    success: string
    successTint: string
    warning: string
    warningTint: string
  }

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

export function resolveTokens(scheme: ColorScheme, accent?: AccentKey | null): SemanticTokens {
  const n = NEUTRALS[scheme]
  const accentBase =
    scheme === 'nightsky'
      ? (accent ? NIGHTSKY.accents[accent] : NIGHTSKY.defaultAccent)
      : ACCENTS[accent ?? 'blue']
  const dark = isDarkScheme(scheme)
  const f = FUNCTIONAL[scheme]


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

function v(value: string | number): { value: string | number } {
  return { value }
}

export function tokensToDtcg(scheme: ColorScheme, accent?: AccentKey | null): Record<string, unknown> {
  const t = resolveTokens(scheme, accent)
  const c = t.color


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

export function tokensToDtcgAll(): Record<string, unknown> {
  const accents = Object.keys(ACCENTS) as AccentKey[]
  const out: Record<string, unknown> = {}
  for (const s of SCHEMES) {
    for (const a of accents) {
      out[`${s}-${a}`] = tokensToDtcg(s, a)
    }
  }

  out['nightsky-default'] = tokensToDtcg('nightsky', null)
  return out
}
