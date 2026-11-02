import { type StyleDesc } from "@gpuix/react";
import { SPACE, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { type HintGroup, KbdBindings } from "./KeyBindings";
import { type KbdColors } from "./Kbd";

const HINT_LABEL_GAP = SPACE.xs;

const HINT_GROUP_GAP = SPACE.md;

export interface ShortcutHintProps {
  group: HintGroup;
  style?: Partial<StyleDesc>;

  colors?: KbdColors;

  labelColor?: string;
}

export function ShortcutHint({
  group,
  style,
  colors,
  labelColor,
}: ShortcutHintProps) {
  const t = useAdwaita();
  const label = group.desc.charAt(0).toUpperCase() + group.desc.slice(1);
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
      <KbdBindings kbds={group.kbds} colors={colors} />
      <T size="caption" color={labelColor ?? t.color.text.dim}>
        {label}
      </T>
    </div>
  );
}

export interface ShortcutHintsProps {
  groups: HintGroup[];
  style?: Partial<StyleDesc>;

  colors?: KbdColors;

  labelColor?: string;
}

export function ShortcutHints({
  groups,
  style,
  colors,
  labelColor,
}: ShortcutHintsProps) {
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
        <ShortcutHint
          key={g.desc}
          group={g}
          colors={colors}
          labelColor={labelColor}
        />
      ))}
    </div>
  );
}
