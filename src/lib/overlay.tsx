import type { ReactNode } from "react";
import { useWindowSize, type StyleDesc } from "@gpuix/react";
import { Frame } from "../components/Card";
import { ShortcutHints } from "../components/KeyHint";
import { type HintGroup } from "../components/KeyBindings";
import {
  rowHoverBg,
  selectionBg,
  useAdwaita,
} from "../theme/adwaita";

const DIM_BG = "rgba(0,0,0,0.45)";

export function DialogFrame({
  width,
  height,
  dim = false,
  children,
}: {
  width: number;
  height?: number;
  dim?: boolean;
  children: ReactNode;
}) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;

  const { width: winW, height: winH } = useWindowSize();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: winW,
        height: winH,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(dim ? { backgroundColor: DIM_BG } : {}),
        pointerEvents: "auto",
      }}
    >
      <Frame
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          width,
          ...(height !== undefined ? { height } : {}),
          paddingLeft: spacing.padding,
          paddingRight: spacing.padding,
          paddingTop: spacing.paddingTight,
          paddingBottom: spacing.paddingTight,
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          boxShadow: {
            offsetX: 0,
            offsetY: 4,
            blurRadius: 16,
            spreadRadius: 0,
            color: "rgba(0,0,0,0.35)",
          },
        }}
      >
        {children}
      </Frame>
    </div>
  );
}

export function DialogHintBar({
  groups,
  style,
}: {
  groups: HintGroup[];
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingTop: spacing.gap,
        ...style,
      }}
    >
      <ShortcutHints groups={groups} />
    </div>
  );
}

export function candidateListHeight(
  shown: number,
  rowHeight: number,
  gap = 2,
): number {
  const rows = Math.max(0, shown);
  if (rows === 0) return 0;
  return rows * rowHeight + (rows - 1) * gap;
}

export function OverlayInput({
  value,
  placeholder,
  onChange,
  onSubmit,
  onKeyDown,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onKeyDown: (e: { key?: string }) => void;
}) {
  const t = useAdwaita();
  const { colors, radii, typography } = t;
  return (
    <input
      autoFocus
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.value ?? "")}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      style={{
        display: "flex",
        alignItems: "center",
        minHeight: 34,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.window_bg,
        fontSize: typography.body,
        fontFamily: typography.fontFamily,
        color: colors.fg,
      }}
    />
  );
}

export function candidateRowStyle(
  t: ReturnType<typeof useAdwaita>,
  active: boolean,
): Record<string, unknown> {
  const { colors, radii } = t;
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 24,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: radii.row,
    backgroundColor: active ? selectionBg(t) : "transparent",
    cursor: "pointer",
    hover: { backgroundColor: active ? selectionBg(t) : rowHoverBg(t) },
  };
}

export function windowCandidates(
  candidates: unknown[],
  activeIndex: number,
  maxVisible: number,
): { activeIdx: number; start: number; end: number } {
  const activeIdx = Math.min(activeIndex, Math.max(candidates.length - 1, 0));
  let start = Math.max(activeIdx - (maxVisible - 1), 0);
  const end = Math.min(start + maxVisible, candidates.length);
  start = Math.max(end - maxVisible, 0);
  return { activeIdx, start, end };
}
