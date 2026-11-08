import { canonicalKey } from "./keybus";

export type Kbd = string | string[];

export interface ShortcutBase {
  id: string;
  kbds: Kbd[];
}

export interface Shortcut extends ShortcutBase {
  desc: string;

  hidden?: boolean;

  hint?: boolean;
}

export interface HiddenCapable {
  hidden?: boolean;
  hint?: boolean;
}

export function isHidden(shortcut: HiddenCapable): boolean {
  return shortcut.hidden === true || shortcut.hint === false;
}

export interface KeyMods {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  cmd?: boolean;
}

const MODIFIER_IDS: Record<string, keyof KeyMods> = {
  ctrl: "ctrl",
  shift: "shift",
  alt: "alt",
  cmd: "cmd",
};

/**
 * A binding as the keys it is made of.
 *
 * A chord written as one string — `"ctrl+shift+r"` — is still three keys, and
 * everything downstream reads it as three: a matcher that took the string whole
 * would ask whether the key pressed was named `ctrl+shift+r`, and a cap given the
 * string whole prints the shortcut's *name* instead of drawing its keys. Only a
 * trailing `+` is the plus key itself rather than a divider.
 */
export function bindingCodes(binding: Kbd): string[] {
  if (Array.isArray(binding)) return binding;
  const codes = binding.split("+");
  if (binding.endsWith("+")) {
    codes.pop();
    codes.push("+");
  }
  return codes.filter((code) => code !== "");
}

export function bindingMatches(
  binding: Kbd,
  key: string,
  mods: KeyMods,
): boolean {
  const codes = bindingCodes(binding);
  const code = canonicalKey(codes[codes.length - 1]);
  if (code !== canonicalKey(key)) return false;
  for (let i = 0; i < codes.length - 1; i++) {
    const m = MODIFIER_IDS[canonicalKey(codes[i])];
    if (m && !mods[m]) return false;
  }
  return true;
}

export function matchShortcut<T extends ShortcutBase>(
  set: T[],
  key: string,
  mods: KeyMods = {},
): T | null {
  let best: T | null = null;
  let bestScore = -1;
  for (const s of set) {
    for (const b of s.kbds) {
      if (!bindingMatches(b, key, mods)) continue;
      const score = bindingCodes(b).length - 1;
      if (score > bestScore) {
        best = s;
        bestScore = score;
      }
    }
  }
  return best;
}

export function hints(set: Shortcut[]): Shortcut[] {
  return set.filter((s) => !isHidden(s));
}

export interface CommandBinding {
  id: string;
  keys: Kbd[];
}

export function findCommandBinding<T extends CommandBinding>(
  commands: T[],
  key: string,
  mods: KeyMods = {},
): T | null {
  let best: T | null = null;
  let bestScore = -1;
  for (const c of commands) {
    for (const b of c.keys) {
      if (!bindingMatches(b, key, mods)) continue;
      const score = bindingCodes(b).length - 1;
      if (score > bestScore) {
        best = c;
        bestScore = score;
      }
    }
  }
  return best;
}

export interface NavShortcutsOptions {
  select?: string;
  page?: string;
  hideArrows?: boolean;
  hidePage?: boolean;
  paged?: boolean;

  pageHint?: boolean;
}

export function navShortcuts(options: NavShortcutsOptions = {}): Shortcut[] {
  const { select = "select", page = "page", paged = true } = options;
  const hideArrows = options.hideArrows ?? true;
  const hidePage =
    options.hidePage ??
    (options.pageHint === undefined ? true : !options.pageHint);
  const rows: Shortcut[] = [
    { id: "up", kbds: ["up"], desc: select, hidden: hideArrows },
    { id: "down", kbds: ["down"], desc: select, hidden: hideArrows },
  ];
  if (paged) {
    rows.push(
      { id: "page-up", kbds: ["pageup"], desc: page, hidden: hidePage },
      { id: "page-down", kbds: ["pagedown"], desc: page, hidden: hidePage },
    );
  }
  rows.push(
    { id: "home", kbds: ["home"], desc: select, hidden: true },
    { id: "end", kbds: ["end"], desc: select, hidden: true },
  );
  return rows;
}

export const NAV: Shortcut[] = navShortcuts({ select: "nav", paged: false });

export const PAGED_NAV: Shortcut[] = navShortcuts({
  select: "nav",
  page: "nav",
});
