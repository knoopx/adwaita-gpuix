import { type StyleDesc } from "@gpuix/react";
import { icons as MATERIAL_SYMBOLS } from "@iconify-json/material-symbols";
import { type IconifyIcon, type IconifyJSON } from "@iconify/types";
import { useAdwaita } from "../theme/adwaita";

export const DEFAULT_ICON_SET = "material-symbols";

const SETS = new Map<string, IconifyJSON>();
const CACHE = new Map<string, string>();
let active = DEFAULT_ICON_SET;

export function registerIconSet(data: IconifyJSON): string {
  const prefix = data.prefix ?? DEFAULT_ICON_SET;
  SETS.set(prefix, data);
  return prefix;
}

export function setIconSet(prefix: string): string {
  if (!SETS.has(prefix)) return "";
  active = prefix;
  return active;
}

export function activeIconSet(): string {
  return active;
}

export function iconSetNames(): string[] {
  return [...SETS.keys()];
}

export function iconNames(prefix: string = active): string[] {
  const data = SETS.get(prefix);
  if (!data) return [];
  return [...Object.keys(data.icons), ...Object.keys(data.aliases ?? {})];
}

function kebabOf(name: string): string {
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

/**
 * Names this library says that the icon set spells differently.
 *
 * An unknown name falls back to a dot, which is invisible in the wrong way: an
 * open disclosure's `chevronDown` became a filled bullet, so every expanded row
 * of a file tree and every open section read as a bullet point. The names the
 * components read are kept, and this is where they meet the set's spelling.
 */
const SET_SPELLING: Record<string, string> = {
  chevronDown: "expand-more",
  chevronUp: "expand-less",
};

function iconEntry(data: IconifyJSON, name: string): IconifyIcon | undefined {
  for (const spelling of [name, kebabOf(name), SET_SPELLING[name] ?? ""]) {
    if (spelling === "") continue;
    const icon = data.icons[spelling];
    if (icon) return icon;
    const alias = data.aliases?.[spelling];
    if (alias) return data.icons[alias.parent];
  }
  return undefined;
}

function svgOf(data: IconifyJSON, icon: IconifyIcon): string {
  const width = icon.width ?? data.width ?? 16;
  const height = icon.height ?? data.height ?? 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="currentColor">${icon.body}</svg>`;
}

export function iconSvg(name: string, prefix: string = active): string {
  const [setName = prefix, iconName = ""] = name.includes(":")
    ? name.split(":")
    : [prefix, name];
  const key = `${setName}:${iconName}`;
  const cached = CACHE.get(key);
  if (cached !== undefined) return cached;

  const data = SETS.get(setName);
  const icon = data ? iconEntry(data, iconName) : undefined;
  const svg = data && icon ? svgOf(data, icon) : "";
  CACHE.set(key, svg);
  return svg;
}

export const ICONS: Record<string, string> = new Proxy(
  {} as Record<string, string>,
  {
    get: (_target, prop) =>
      typeof prop === "string" ? iconSvg(prop) : undefined,
    has: (_target, prop) => typeof prop === "string" && iconSvg(prop) !== "",
    ownKeys: () => iconNames(),
    getOwnPropertyDescriptor: () => ({
      enumerable: true,
      configurable: true,
    }),
    deleteProperty: () => false,
  },
);

export type IconName = keyof typeof ICONS | (string & {});

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: Partial<StyleDesc>;
}

export function renderIconSvg(
  svg: string,
  color: string,
  size: number,
  style?: Partial<StyleDesc>,
) {
  const src = `data:image/svg+xml,${encodeURIComponent(
    svg.replace(/currentColor/g, color),
  )}`;
  return (
    <img
      src={src}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export function Icon({ name, size = 16, color, style }: IconProps) {
  const t = useAdwaita();

  const svg = iconSvg(name) || iconSvg("circle");
  return renderIconSvg(svg, color ?? t.color.text.primary, size, style);
}

registerIconSet(MATERIAL_SYMBOLS);
