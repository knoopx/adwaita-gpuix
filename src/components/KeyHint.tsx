import type { StyleDesc } from "@gpuix/react";
import { SPACE } from "../theme/adwaita";
import { T } from "./common";
import { useAdwaita } from "../theme/adwaita";
import { type HintGroup, KbdBindings } from "./KeyBindings";


const HINT_LABEL_GAP = SPACE.xs;

const HINT_GROUP_GAP = SPACE.md;

export interface ShortcutHintProps {
  group: HintGroup;
  style?: Partial<StyleDesc>;
}

export function ShortcutHint({ group, style }: ShortcutHintProps) {
  const t = useAdwaita();
  const label =
    group.desc.charAt(0).toUpperCase() + group.desc.slice(1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: HINT_LABEL_GAP,
        flexShrink: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <KbdBindings kbds={group.kbds} />
      <T size="caption" color={t.colors.dim_fg}>
        {label}
      </T>
    </div>
  );
}

export interface ShortcutHintsProps {
  groups: HintGroup[];
  style?: Partial<StyleDesc>;
}


export function ShortcutHints({ groups, style }: ShortcutHintsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: HINT_GROUP_GAP,
        minWidth: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      {groups.map((g) => (
        <ShortcutHint key={g.desc} group={g} />
      ))}
    </div>
  );
}
