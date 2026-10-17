import { Fragment } from "react";
import type { StyleDesc } from "@gpuix/react";
import { Kbd as KbdBox, KbdGroup, KbdCombo } from "./Kbd";
import { type Kbd, type Shortcut } from "../lib/shortcuts";
import { useAdwaita, SPACE } from "../theme/adwaita";
import { T } from "./common";

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

export function KbdKey({ code }: { code: string }) {
  return <KbdBox>{kbdSymbol(code)}</KbdBox>;
}

function bindingCodes(binding: Kbd): string[] {
  return Array.isArray(binding) ? binding : [binding];
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
  return slots.map(({ prefix, tails }) => {
    const keys = tails.map(kbdSymbol).join("/");
    return prefix.length === 0 ? keys : [...prefix, keys];
  });
}

export function KbdBinding({ binding }: { binding: Kbd }) {
  const codes = Array.isArray(binding) ? binding : [binding];
  if (codes.length === 1) return <KbdKey code={codes[0]} />;
  return (
    <KbdCombo>
      {codes.map((c) => (
        <KbdKey key={c} code={c} />
      ))}
    </KbdCombo>
  );
}

export function KbdBindings({ kbds }: { kbds: Kbd[] }) {
  return (
    <KbdGroup>
      {kbds.map((b) => (
        <KbdBinding key={Array.isArray(b) ? b.join("-") : b} binding={b} />
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
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: SPACE.sm,
        minHeight: spacing.rowHeight,
        paddingLeft: SPACE.md,
        paddingRight: SPACE.md,
        ...style,
      }}
    >
      <T
        size="body"
        color={colors.fg}
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
  const { colors } = t;
  const groups = groupHints(shortcuts);
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {groups.map((g, i) => (
        <Fragment key={g.desc}>
          {i > 0 ? (
            <div
              style={{
                height: 1,
                backgroundColor: colors.border,
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
