export type Kbd = string | string[];

export interface Shortcut {
  id: string;
  kbds: Kbd[];
  desc: string;
  hint?: boolean;
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

function bindingMatches(binding: Kbd, key: string, mods: KeyMods): boolean {
  const codes = Array.isArray(binding) ? binding : [binding];
  const code = codes[codes.length - 1];
  if (code !== key) return false;
  for (let i = 0; i < codes.length - 1; i++) {
    const m = MODIFIER_IDS[codes[i]];
    if (m && !mods[m]) return false;
  }
  return true;
}

export function matchShortcut(
  set: Shortcut[],
  key: string,
  mods: KeyMods = {},
): Shortcut | null {
  let best: Shortcut | null = null;
  let bestScore = -1;
  for (const s of set) {
    for (const b of s.kbds) {
      if (!bindingMatches(b, key, mods)) continue;
      const score = (Array.isArray(b) ? b : [b]).length - 1;
      if (score > bestScore) {
        best = s;
        bestScore = score;
      }
    }
  }
  return best;
}

export function hints(set: Shortcut[]): Shortcut[] {
  return set.filter((s) => s.hint !== false);
}

export const NAV: Shortcut[] = [
  { id: "up", kbds: ["up"], desc: "nav" },
  { id: "down", kbds: ["down"], desc: "nav" },
  { id: "home", kbds: ["home"], desc: "nav", hint: false },
  { id: "end", kbds: ["end"], desc: "nav", hint: false },
];

export const PAGED_NAV: Shortcut[] = [
  NAV[0],
  NAV[1],
  { id: "page-up", kbds: ["pageup"], desc: "nav", hint: false },
  { id: "page-down", kbds: ["pagedown"], desc: "nav", hint: false },
  NAV[2],
  NAV[3],
];
