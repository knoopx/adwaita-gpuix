import { Fragment } from "react";
import { type StyleDesc } from "@gpuix/react";
import { Kbd as KbdBox, KbdCombo, KbdGroup, KBD_GLYPH, type KbdColors } from "./Kbd";
import {
  bindingCodes,
  isHidden,
  type Kbd,
  type Shortcut,
} from "../lib/shortcuts";
import { SPACE, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

/**
 * The keys a cap draws as the mark on the key rather than as its name.
 *
 * A cap is a picture of a key, and the keys whose *word* is what makes a line of
 * caps wide — the four arrows, the two page keys, Home and End, Enter, Tab,
 * Escape, the two delete keys, Space and the four modifiers — all carry that mark
 * on a real keyboard, and the active icon set has each one (`keyboard-return`,
 * `keyboard-double-arrow-up`, `keyboard-control-key`, `shift`, `space-bar`).
 * A hint line spelled out is three times the width it needs: the words are what
 * runs past the edge of a narrow window and gets cut, so the caps are marks.
 *
 * A key with no mark — a letter, a digit, a function key, `insert` — keeps the
 * text in `CODE_SYMBOLS` below.
 */
const KEY_ICONS: Record<string, IconName> = {
  up: "arrowUpward",
  down: "arrowDownward",
  left: "arrowBack",
  right: "arrowForward",
  pageup: "keyboardDoubleArrowUp",
  pgup: "keyboardDoubleArrowUp",
  pagedown: "keyboardDoubleArrowDown",
  pgdn: "keyboardDoubleArrowDown",
  pgdown: "keyboardDoubleArrowDown",
  home: "firstPage",
  end: "lastPage",
  enter: "keyboardReturn",
  return: "keyboardReturn",
  escape: "close",
  esc: "close",
  tab: "keyboardTab",
  delete: "backspace",
  backspace: "keyboardBackspace",
  space: "spaceBar",
  ctrl: "keyboardControlKey",
  control: "keyboardControlKey",
  shift: "shift",
  alt: "keyboardAlt",
  option: "keyboardAlt",
  cmd: "keyboardCommandKey",
  super: "keyboardCommandKey",
};

/** The mark a code is drawn with, or nothing when it is drawn as its name. */
export function keyIcon(code: string): IconName | undefined {
  return KEY_ICONS[code.toLowerCase()];
}

const CODE_SYMBOLS: Record<string, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  pageup: "PgUp",
  pagedown: "PgDn",
  home: "Home",
  end: "End",
  tab: "Tab",
  space: "Space",
  delete: "Del",
  escape: "Esc",
  enter: "Enter",
  insert: "Ins",
  ctrl: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  cmd: "Cmd",
};

export function kbdSymbol(code: string): string {
  return CODE_SYMBOLS[code] ?? code;
}

export function KbdKey({ code, colors }: { code: string; colors?: KbdColors }) {
  const t = useAdwaita();
  const icon = keyIcon(code);
  if (icon !== undefined)
    return (
      <KbdBox colors={colors}>
        <Icon
          name={icon}
          size={KBD_GLYPH}
          color={colors?.color ?? t.color.text.dim}
        />
      </KbdBox>
    );
  return <KbdBox colors={colors}>{kbdSymbol(code)}</KbdBox>;
}

export function compactBindings(kbds: Kbd[]): Kbd[] {
  interface Slot {
    prefix: string[];
    tails: string[];
  }
  const slots: Slot[] = [];
  const byPrefix = new Map<string, Slot>();
  for (const binding of kbds) {
    const codes = bindingCodes(binding);
    const prefix = codes.slice(0, -1);
    const tail = codes[codes.length - 1];
    const key = prefix.join("+");
    const slot = byPrefix.get(key);
    if (slot) {
      if (!slot.tails.includes(tail)) slot.tails.push(tail);
      continue;
    }
    const created: Slot = { prefix, tails: [tail] };
    byPrefix.set(key, created);
    slots.push(created);
  }
  return slots.flatMap(({ prefix, tails }) => {
    // Two keys that print as marks stay two caps: a cap cannot hold "⇈/⇊" the
    // way it can hold "PgUp/PgDn", and a shared prefix is only ever worth
    // folding when the thing folded is one word.
    if (tails.some((tail) => keyIcon(tail) !== undefined))
      return tails.map((tail) =>
        prefix.length === 0 ? tail : [...prefix, tail],
      );
    const keys = tails.map(kbdSymbol).join("/");
    return [prefix.length === 0 ? keys : [...prefix, keys]];
  });
}

export function KbdBinding({
  binding,
  colors,
}: {
  binding: Kbd;
  colors?: KbdColors;
}) {
  const codes = bindingCodes(binding);
  if (codes.length === 1) return <KbdKey code={codes[0]} colors={colors} />;
  return (
    <KbdCombo colors={colors}>
      {codes.map((c) => (
        <KbdKey key={c} code={c} colors={colors} />
      ))}
    </KbdCombo>
  );
}

export function KbdBindings({
  kbds,
  colors,
}: {
  kbds: Kbd[];
  colors?: KbdColors;
}) {
  return (
    <KbdGroup>
      {kbds.map((b) => (
        <KbdBinding
          key={Array.isArray(b) ? b.join("-") : b}
          binding={b}
          colors={colors}
        />
      ))}
    </KbdGroup>
  );
}

export interface HintGroup {
  desc: string;
  kbds: Kbd[];
}

export interface ShortcutRowProps {
  label: string;
  kbds: Kbd[];
  style?: Partial<StyleDesc>;
}

export function ShortcutRow({ label, kbds, style }: ShortcutRowProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: SPACE.sm,
        minHeight: t.control.rowHeight,
        paddingLeft: SPACE.md,
        paddingRight: SPACE.md,
        ...style,
      }}
    >
      <T
        size="body"
        color={t.color.text.primary}
        style={{
          flexGrow: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          pointerEvents: "none",
        }}
      >
        {label}
      </T>
      <div style={{ flexShrink: 0, pointerEvents: "none" }}>
        <KbdBindings kbds={compactBindings(kbds)} />
      </div>
    </div>
  );
}

export interface ShortcutListProps {
  shortcuts: Shortcut[];
  style?: Partial<StyleDesc>;
}

export function ShortcutList({ shortcuts, style }: ShortcutListProps) {
  const t = useAdwaita();
  const groups = groupHints(shortcuts);
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {groups.map((g, i) => (
        <Fragment key={g.desc}>
          {i > 0 ? (
            <div
              style={{
                height: 1,
                backgroundColor: t.color.border.default,
                margin: SPACE.xs,
              }}
            />
          ) : null}
          <ShortcutRow label={g.desc} kbds={g.kbds} />
        </Fragment>
      ))}
    </div>
  );
}

export function groupHints(shortcuts: Shortcut[]): HintGroup[] {
  const groups: HintGroup[] = [];
  const byDesc = new Map<string, HintGroup>();
  for (const s of shortcuts) {
    if (isHidden(s)) continue;
    const existing = byDesc.get(s.desc);
    if (existing) {
      existing.kbds.push(...s.kbds);
    } else {
      const g: HintGroup = { desc: s.desc, kbds: [...s.kbds] };
      byDesc.set(s.desc, g);
      groups.push(g);
    }
  }
  return groups.map((g) => ({ ...g, kbds: compactBindings(g.kbds) }));
}
