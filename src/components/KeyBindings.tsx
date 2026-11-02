import { Fragment } from "react";
import { type StyleDesc } from "@gpuix/react";
import { Kbd as KbdBox, KbdCombo, KbdGroup, type KbdColors } from "./Kbd";
import { isHidden, type Kbd, type Shortcut } from "../lib/shortcuts";
import { SPACE, useAdwaita } from "../theme/adwaita";
import { T } from "./text";

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
  return <KbdBox colors={colors}>{kbdSymbol(code)}</KbdBox>;
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

export function KbdBinding({
  binding,
  colors,
}: {
  binding: Kbd;
  colors?: KbdColors;
}) {
  const codes = Array.isArray(binding) ? binding : [binding];
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
