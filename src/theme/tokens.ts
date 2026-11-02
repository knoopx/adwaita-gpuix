export type ColorScheme = "light" | "dark" | "nightsky";

export const SCHEMES: ColorScheme[] = ["light", "dark", "nightsky"];

export function isDarkScheme(scheme: ColorScheme): boolean {
  return scheme === "dark" || scheme === "nightsky";
}

export const BASE16: Record<ColorScheme, readonly string[]> = {
  light: [
    "#ffffff",
    "#fafafa",
    "#ebebed",
    "#d0d0d0",
    "#79787a",
    "#2e2e2e",
    "#4a4a4a",
    "#5e5c64",
    "#c01c28",
    "#e66100",
    "#e5a50a",
    "#26a269",
    "#00a19a",
    "#3584e4",
    "#9141ac",
    "#a51e67",
  ],

  dark: [
    "#242424",
    "#2a2a2a",
    "#303030",
    "#37373c",
    "#454545",
    "#ffffff",
    "#9a9a9a",
    "#565656",
    "#ed333b",
    "#e66100",
    "#e5a50a",
    "#26a269",
    "#00a19a",
    "#3584e4",
    "#9141ac",
    "#a51e67",
  ],

  nightsky: [
    "#191033",
    "#211641",
    "#32245d",
    "#4c3e76",
    "#6e6194",
    "#f8f8f8",
    "#f1f0f4",
    "#fad000",
    "#ff628c",
    "#ffb454",
    "#fad000",
    "#a5ff90",
    "#80fcff",
    "#fad000",
    "#faefa5",
    "#fb94ff",
  ],
};

export interface ColorRoleBindings {
  surfaceBase: number;
  surfaceRaised: number;
  surfaceSunken: number;
  surfaceOverlay: number;
  surfaceHover: number;
  surfaceActive: number;
  surfaceSelected: number;
  surfaceHeader: number;
  surfaceScrim: number;
  lineFaint: number;
  lineDefault: number;
  lineStrong: number;
  textPrimary: number;
  textDim: number;
}

export const COLOR_ROLES: Record<ColorScheme, ColorRoleBindings> = {
  light: {
    surfaceBase: 1,
    surfaceRaised: 0,
    surfaceSunken: 2,
    surfaceOverlay: 0,
    surfaceHover: 2,
    surfaceActive: 3,
    surfaceSelected: 2,
    surfaceHeader: 2,
    surfaceScrim: 3,
    lineFaint: 2,
    lineDefault: 3,
    lineStrong: 3,
    textPrimary: 5,
    textDim: 4,
  },
  dark: {
    surfaceBase: 2,
    surfaceRaised: 3,
    surfaceSunken: 1,
    surfaceOverlay: 7,
    surfaceHover: 3,
    surfaceActive: 4,
    surfaceSelected: 3,
    surfaceHeader: 4,
    surfaceScrim: 0,
    lineFaint: 3,
    lineDefault: 4,
    lineStrong: 7,
    textPrimary: 5,
    textDim: 6,
  },
  nightsky: {
    surfaceBase: 0,
    surfaceRaised: 1,
    surfaceSunken: 1,
    surfaceOverlay: 1,
    surfaceHover: 2,
    surfaceActive: 3,
    surfaceSelected: 2,
    surfaceHeader: 2,
    surfaceScrim: 0,
    lineFaint: 1,
    lineDefault: 2,
    lineStrong: 3,
    textPrimary: 5,
    textDim: 4,
  },
};

export type AccentKey =
  | "blue"
  | "teal"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "pink"
  | "purple"
  | "slate";

export const ACCENTS: Record<AccentKey, string> = {
  blue: "#3584e4",
  teal: "#00a19a",
  green: "#26a269",
  yellow: "#e5a50a",
  orange: "#e7772b",
  red: "#c01c28",
  pink: "#a51e67",
  purple: "#9141ac",
  slate: "#5e5c64",
};

export const NIGHTSKY = {
  defaultAccent: "#fad000",

  accentFg: "#191033",

  accents: {
    blue: "#3584e4",
    teal: "#2190a4",
    green: "#3a944a",
    yellow: "#c88800",
    orange: "#ed5b00",
    red: "#e62d42",
    pink: "#d56199",
    purple: "#9141ac",
    slate: "#6f8396",
  },

  neutrals: {
    window: "#191033",

    view: "#191033",

    headerbar: "#211641",

    sidebar: "#211641",

    card: "#211641",

    button: "#32245d",

    buttonHover: "#4c3e76",

    buttonActive: "#4c3e76",

    osd: "#211641",
  },

  text: {
    primary: "#f8f8f8",

    secondary: "#d9d7e2",

    dim: "#6e6194",
  },

  border: "#4c3e76",

  functional: {
    destructive: "#ff628c",

    destructiveFg: "#191033",

    success: "#a5ff90",

    warning: "#f43f5e",
  },

  extras: {
    scrollbarOutline: "#32245d",
    orange: "#ffb454",
    magenta: "#fb94ff",
  },
} as const;

const NEUTRALS: Record<
  ColorScheme,
  {
    window: string;
    view: string;
    headerbar: string;
    sidebar: string;
    card: string;
    button: string;
    buttonHover: string;
    buttonActive: string;
    osd: string;
  }
> = {
  light: {
    window: "#fafafa",

    view: "#fafafa",
    headerbar: "#fafafa",
    sidebar: "#ebebed",

    card: "#ffffff",
    button: "#f6f6f6",
    buttonHover: "#ececec",
    buttonActive: "#e0e0e0",
    osd: "#333333",
  },
  dark: {
    window: "#242424",
    view: "#303030",
    headerbar: "#2a2a2a",
    sidebar: "#2e2e2e",

    card: "#37373c",
    button: "#3a3a3a",
    buttonHover: "#454545",
    buttonActive: "#515151",
    osd: "#565656",
  },
  nightsky: NIGHTSKY.neutrals,
};

const TEXT: Record<
  ColorScheme,
  { primary: string; secondary: string; dim: string }
> = {
  light: { primary: "#2e2e2e", secondary: "#3f3f3f", dim: "#79787a" },
  dark: { primary: "#ffffff", secondary: "#e2e2e2", dim: "#9a9a9a" },
  nightsky: {
    primary: NIGHTSKY.text.primary,
    secondary: NIGHTSKY.text.secondary,
    dim: NIGHTSKY.text.dim,
  },
};

export const INPUT_FILL: Record<ColorScheme, string> = {
  light: "#ffffff",
  dark: "#2a2a2a",
  nightsky: "#211641",
};

export const OSD_FG: Record<ColorScheme, string> = {
  light: "#ffffff",
  dark: "#ffffff",
  nightsky: NIGHTSKY.text.primary,
};

export const FLAT = {
  card: "view" as const,

  border: "rgba(0,0,0,0)",
} as const;

const BORDER: Record<ColorScheme, string> = {
  light: "#d0d0d0",
  dark: "#454545",
  nightsky: NIGHTSKY.border,
};

const FUNCTIONAL: Record<
  ColorScheme,
  {
    destructive: string;
    success: string;
    warning: string;
    destructiveFg?: string;
  }
> = {
  light: { destructive: "#c01c28", success: "#26a269", warning: "#e5a50a" },
  dark: { destructive: "#ed333b", success: "#26a269", warning: "#e5a50a" },
  nightsky: {
    destructive: NIGHTSKY.functional.destructive,
    success: NIGHTSKY.functional.success,
    warning: NIGHTSKY.functional.warning,

    destructiveFg: NIGHTSKY.accentFg,
  },
};

export const ACCENT_SETS: Record<
  ColorScheme,
  {
    accents: Record<AccentKey, string>;
    defaultAccent: string;
    accentFg: string | null;
  }
> = {
  light: {
    accents: ACCENTS,
    defaultAccent: ACCENTS.blue,
    accentFg: null,
  },
  dark: {
    accents: ACCENTS,
    defaultAccent: ACCENTS.blue,
    accentFg: null,
  },
  nightsky: {
    accents: NIGHTSKY.accents,
    defaultAccent: NIGHTSKY.defaultAccent,
    accentFg: NIGHTSKY.accentFg,
  },
};

export const CHART_SERIES: Record<ColorScheme, string[]> = {
  light: [
    ACCENTS.blue,
    ACCENTS.pink,
    ACCENTS.red,
    ACCENTS.orange,
    ACCENTS.teal,
  ],
  dark: [
    ACCENTS.blue,
    NIGHTSKY.accents.pink,
    FUNCTIONAL.dark.destructive,
    NIGHTSKY.accents.orange,
    ACCENTS.teal,
  ],
  nightsky: [
    NIGHTSKY.accents.blue,
    NIGHTSKY.accents.pink,
    NIGHTSKY.functional.destructive,
    NIGHTSKY.accents.orange,
    NIGHTSKY.accents.teal,
  ],
};

export const CHART_SUN: Record<
  ColorScheme,
  { line: string; fillTop: number; fillBottom: number }
> = {
  light: { line: "#f6d32d", fillTop: 0.4, fillBottom: 0.34 },
  dark: { line: "#f6d32d", fillTop: 0.34, fillBottom: 0.26 },
  nightsky: { line: "#f4d03f", fillTop: 0.34, fillBottom: 0.26 },
};

export const CHART_FILL: Record<
  ColorScheme,
  { top: number; bottom: number; bandTint: number }
> = {
  light: { top: 0.38, bottom: 0.06, bandTint: 0.16 },
  dark: { top: 0.46, bottom: 0.1, bandTint: 0.24 },
  nightsky: { top: 0.46, bottom: 0.1, bandTint: 0.24 },
};

export const TINT_ALPHA: Record<
  ColorScheme,
  { accent: number; destructive: number; success: number; warning: number }
> = {
  light: { accent: 0.12, destructive: 0.12, success: 0.14, warning: 0.16 },
  dark: { accent: 0.22, destructive: 0.28, success: 0.24, warning: 0.24 },
  nightsky: { accent: 0.22, destructive: 0.28, success: 0.24, warning: 0.24 },
};

export const SELECTION: Record<ColorScheme, { muted: string; faint: string }> =
  {
    light: {
      muted: "#ebebed",
      faint: "#ffffff",
    },
    dark: {
      muted: "#37373c",
      faint: "#2a2a2a",
    },
    nightsky: {
      muted: "#32245d",
      faint: "#211641",
    },
  };

export const APPEARANCE: Record<ColorScheme, "dark" | "light"> = {
  light: "light",
  dark: "dark",
  nightsky: "dark",
};

export const DIVIDER: Record<
  ColorScheme,
  { faint: string; default: string; strong: string }
> = {
  light: { faint: "#ebebed", default: "#d0d0d0", strong: "#d0d0d0" },
  dark: { faint: "#37373c", default: "#454545", strong: "#565656" },
  nightsky: { faint: "#211641", default: "#32245d", strong: "#4c3e76" },
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 10,
  lg: 12,
  xl: 20,

  shell: 12,
  full: 999,
} as const;

export const SPACE = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const CONTROL = {
  headerBarHeight: 46,
  headerBarCompactHeight: 37,
  headerBarPaddingX: 12,
  headerGroupGap: 8,

  headerActionGap: 8,
  headerBarCenterMaxWidth: 460,
  toggleGroupPadding: 3,
  toggleSegmentPaddingX: 12,

  viewSwitcherHeight: 34,
  viewSwitcherPaddingX: 9,
  sliderTroughHeight: 4,
  sliderKnobWidth: 18,
  sliderKnobHeight: 14,
  sliderPadding: 6,
  sidebarRowPaddingY: 0,
  sidebarRowPaddingX: 12,
  sidebarRowInsetX: 5,
  sidebarGroupGap: 4,
  sidebarRowGap: 4,
  sidebarRowInsetEnd: 0,
  listRowHeight: 40,
  listRowInsetX: 35,
  listRowInsetEnd: 46,
  listIconSize: 21,
  listRowGap: 11,
  columnHeaderHeight: 42,
  columnHeaderInsetX: 36,
  columnHeaderPaddingTop: 19,
  locationEntryHeight: 36,
  locationEntryMinWidth: 240,

  filterEntryWidth: 225,
  locationEntryMaxWidth: 1200,
  caretIconSize: 10,
  navIconSize: 14,
  rowActionIconSize: 18,
  fileTileWidth: 158,
  fileTileIconSize: 96,
  fileTileGap: 10,
  gridPaddingX: 22,
  gridPaddingY: 21,
  rowHeight: 30,
  statusBarHeight: 32,
  viewSwitcherPadding: 2,
  toggleSegmentHeightSm: 22,
  toggleSegmentHeightLg: 28,
  progressWidth: 80,

  dataRowHeight: 48,
  dataIconSize: 24,
  dataHeaderHeight: 36,
  dataRowInsetX: 12,
  dataRowInsetEnd: 20,

  compactRowHeight: 24,
  compactIconSize: 12,
  compactHeaderHeight: 30,

  tabStripHeight: 45,
  tabStripInset: 6,
  tabStripPaddingX: 9,
  tabStripCloseHitSize: 20,

  sparklineHeight: 64,

  mediaTileWidth: 144,
  mediaTileHeight: 108,
  mediaTileGap: 19,
  mediaTilePadding: 20,
  mediaTileGroupWidth: 510,
  podcastTileSize: 167,
  podcastTileGap: 15,
  podcastTileInset: 26,

  emptyMediaSize: 132,
  emptyMediaIconSize: 120,
  weatherCellWidth: 76,

  weatherStripInsetX: 0,
  weatherHeadInsetX: 58,
  weatherHeadGap: 24,

  weatherPagerSize: 40,

  weatherPagerInset: 27,

  themePreviewWidth: 200,
  themePreviewHeight: 152,
  themePreviewInnerWidth: 136,
  themePreviewInnerHeight: 124,

  rowSliderWidth: 195,

  comboPillHeight: 26,

  comboPillPaddingX: 9,

  comboPillMaxWidth: 225,

  weatherGlyphSize: 88,
  hourlyCurveHeight: 120,

  waveformHeight: 224,

  waveformBars: 216,

  waveformBarWidth: 2,

  waveformBarGap: 2,

  transportArtSize: 32,
  seekRailWidth: 164,

  rowMinHeight: 45,

  groupRowPaddingY: 4,
  groupIconSize: 36,

  deviceBarHeight: 6,

  counterRowHeight: 39,

  actionRowHeight: 57,

  stepperSize: 27,

  deviceRowHeight: 56,

  settingsPageMaxWidth: 510,

  settingsPagePaddingX: 72,

  settingsPagePaddingY: 24,

  headingToGroupGap: 14,

  groupRowInset: 12,

  sidebarWidth: 220,
  sidebarMinWidth: 120,
  sidebarMaxWidth: 400,
  sidebarRailWidth: 56,
  dividerThickness: 1,
  dividerThicknessStrong: 2,
  dividerHandleWidth: 5,
  dividerInset: 6,
  dividerRuleLength: 24,
} as const;

export const TYPE = {
  display: 40,
  title1: 20,
  title2: 16,

  title3: 15,
  title4: 14,

  body: 15,

  list: 15,

  caption: 12,

  micro: 11,

  lineHeight: {
    display: 44,
    title1: 20,
    title2: 16,
    title3: 15,
    title4: 14,
    body: 15,
    list: 15,
    caption: 12,
    micro: 11,
    mono: 18,
  },

  fontFamily: "Inter",

  fontFamilyMono: "JetBrainsMono Nerd Font Mono",
  weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
} as const;

export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function shade(hex: string, pct: number): string {
  const h = hex.replace("#", "");
  let r = parseInt(h.slice(0, 2), 16);
  let g = parseInt(h.slice(2, 4), 16);
  let b = parseInt(h.slice(4, 6), 16);
  const target = pct < 0 ? 0 : 255;
  const p = Math.abs(pct);
  r = Math.round((target - r) * p) + r;
  g = Math.round((target - g) * p) + g;
  b = Math.round((target - b) * p) + b;
  return `rgb(${r},${g},${b})`;
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function accentForeground(accent: string): string {
  return luminance(accent) > 0.5 ? "#2e2e2e" : "#ffffff";
}

export interface SemanticColors {
  scale: string[];

  surface: {
    window: string;
    view: string;
    headerbar: string;
    sidebar: string;
    card: string;
    button: string;
    buttonHover: string;
    buttonActive: string;
    osd: string;

    input: string;

    raised: string;
    sunken: string;
    overlay: string;
    hover: string;
    active: string;
    selected: string;
    header: string;
    scrim: string;
  };

  text: {
    primary: string;

    secondary: string;
    dim: string;
    onAccent: string;

    onOsd: string;
  };

  accent: {
    base: string;
    tint: string;
    fg: string;
  };

  functional: {
    destructive: string;
    destructiveTint: string;
    destructiveFg: string;
    success: string;
    successTint: string;
    warning: string;
    warningTint: string;
  };

  selection: {
    muted: string;
    faint: string;

    accent: string;
  };

  chart: {
    series: string[];
    fillTop: number;
    fillBottom: number;
    bandTint: number;

    sun: { line: string; fillTop: number; fillBottom: number };
  };

  divider: {
    faint: string;
    default: string;
    strong: string;
  };

  border: {
    default: string;
  };
}

export interface SemanticTokens {
  color: SemanticColors;
  space: typeof SPACE;
  radius: typeof RADIUS;
  control: typeof CONTROL;
  type: typeof TYPE;
}

export function resolveTokens(
  scheme: ColorScheme,
  accent?: AccentKey | null,
): SemanticTokens {
  const n = NEUTRALS[scheme];
  const set = ACCENT_SETS[scheme];
  const alpha = TINT_ALPHA[scheme];
  const f = FUNCTIONAL[scheme];

  const scale = BASE16[scheme];
  const r = COLOR_ROLES[scheme];

  const accentBase = accent ? set.accents[accent] : set.defaultAccent;
  const onAccent = set.accentFg ?? accentForeground(accentBase);

  return {
    color: {
      surface: {
        window: n.window,
        view: n.view,
        headerbar: n.headerbar,
        sidebar: n.sidebar,

        card: n[FLAT.card],
        button: n.button,
        buttonHover: n.buttonHover,
        buttonActive: n.buttonActive,
        osd: n.osd,
        input: INPUT_FILL[scheme],

        raised: scale[r.surfaceRaised],
        sunken: scale[r.surfaceSunken],
        overlay: scale[r.surfaceOverlay],
        hover: scale[r.surfaceHover],
        active: scale[r.surfaceActive],
        selected: scale[r.surfaceSelected],
        header: scale[r.surfaceHeader],
        scrim: scale[r.surfaceScrim],
      },
      scale: [...scale],
      text: {
        primary: TEXT[scheme].primary,
        secondary: TEXT[scheme].secondary,
        dim: TEXT[scheme].dim,
        onAccent,
        onOsd: OSD_FG[scheme],
      },
      accent: {
        base: accentBase,
        tint: hexToRgba(accentBase, alpha.accent),
        fg: onAccent,
      },
      functional: {
        destructive: f.destructive,
        destructiveTint: hexToRgba(f.destructive, alpha.destructive),

        destructiveFg: f.destructiveFg ?? "#ffffff",
        success: f.success,
        successTint: hexToRgba(f.success, alpha.success),
        warning: f.warning,
        warningTint: hexToRgba(f.warning, alpha.warning),
      },
      selection: {
        muted: SELECTION[scheme].muted,
        faint: SELECTION[scheme].faint,
        accent: hexToRgba(accentBase, TINT_ALPHA[scheme].accent),
      },
      chart: {
        series: CHART_SERIES[scheme],
        fillTop: CHART_FILL[scheme].top,
        fillBottom: CHART_FILL[scheme].bottom,
        bandTint: CHART_FILL[scheme].bandTint,
        sun: CHART_SUN[scheme],
      },
      divider: {
        faint: DIVIDER[scheme].faint,
        default: DIVIDER[scheme].default,
        strong: DIVIDER[scheme].strong,
      },
      border: {
        default: BORDER[scheme],
      },
    },
    space: SPACE,
    radius: RADIUS,
    control: CONTROL,
    type: TYPE,
  };
}

function dtcgGroup(group: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(group).map(([key, value]) => {
      const name = key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      if (typeof value === "object" && value !== null) {
        return [name, dtcgGroup(value as Record<string, unknown>)];
      }
      return [name, { value: value as string | number }];
    }),
  );
}

function dtcgNamespace(
  tokens: SemanticTokens,
  namespace: keyof SemanticTokens,
): Record<string, unknown> {
  return dtcgGroup(tokens[namespace] as Record<string, unknown>);
}

export function tokensToDtcg(
  scheme: ColorScheme,
  accent?: AccentKey | null,
): Record<string, unknown> {
  const tokens = resolveTokens(scheme, accent);
  return {
    color: dtcgNamespace(tokens, "color"),
    space: dtcgNamespace(tokens, "space"),
    radius: dtcgNamespace(tokens, "radius"),
    control: dtcgNamespace(tokens, "control"),
    type: dtcgNamespace(tokens, "type"),
  };
}

export function tokensToDtcgAll(): Record<string, unknown> {
  const accents = Object.keys(ACCENTS) as AccentKey[];
  const out: Record<string, unknown> = {};
  for (const s of SCHEMES) {
    for (const a of accents) {
      out[`${s}-${a}`] = tokensToDtcg(s, a);
    }
  }

  out["nightsky-default"] = tokensToDtcg("nightsky", null);
  return out;
}
