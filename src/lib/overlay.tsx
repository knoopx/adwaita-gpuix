import {
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { type StyleDesc, useWindowSize } from "@gpuix/react";
import { Frame } from "../components/Card";
import { ShortcutHints } from "../components/KeyHint";
import { type HintGroup } from "../components/KeyBindings";
import { rowHoverBg, selectionBg, useAdwaita } from "../theme/adwaita";
import { canonicalKey } from "./keybus";
import { matchShortcut, type Shortcut } from "./shortcuts";

const DIM_BG = "rgba(0,0,0,0.45)";




export function fieldSurfaceStyle(t: ReturnType<typeof useAdwaita>): StyleDesc {
  return {
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.window,
    fontSize: t.type.body,
    fontFamily: t.type.fontFamily,
    color: t.color.text.primary,
  };
}

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
          gap: t.space.sm,
          width,
          ...(height !== undefined ? { height } : {}),
          paddingLeft: t.space.lg,
          paddingRight: t.space.lg,
          paddingTop: t.space.md,
          paddingBottom: t.space.md,
          borderRadius: t.radius.sm,
          borderWidth: 1,
          borderColor: t.color.border.default,
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        paddingTop: t.space.sm,
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
        ...fieldSurfaceStyle(t),
      }}
    />
  );
}

export function candidateRowStyle(
  t: ReturnType<typeof useAdwaita>,
  active: boolean,
): Record<string, unknown> {
  return {
    display: "flex",
    alignItems: "center",
    gap: 8,
    height: 24,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: t.radius.sm,
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

export interface CandidatePicker {
  value: string;
  setValue: (next: string) => void;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  /** Typing a new query: the value changes and the cursor returns to the top. */
  onQuery: (next: string) => void;
  /** Wire this to `OverlayInput`'s `onKeyDown`. */
  onKeyDown: (event: { key?: string }) => void;
}

/**
 * The state of a picker dialog: a query, the cursor into the candidates, and
 * the keys that move it. Up and down are answered here; `apply`, `cancel` and
 * `forget` are answered by whatever ids the app's shortcut set gives them, and
 * any other id falls through to `onAction`.
 */
export function useCandidatePicker({
  shortcuts,
  count,
  onApply,
  onCancel,
  onForget,
  onAction,
}: {
  shortcuts: Shortcut[];
  /** How many candidates there are now — a getter while they are derived. */
  count: number | (() => number);
  onApply?: () => void;
  onCancel?: () => void;
  onForget?: () => void;
  onAction?: (id: string) => void;
}): CandidatePicker {
  const [value, setValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const countOf = typeof count === "function" ? count : () => count;
  return {
    value,
    setValue,
    activeIndex,
    setActiveIndex,
    onQuery: (next: string) => {
      setValue(next);
      setActiveIndex(0);
    },
    onKeyDown: (event: { key?: string }) => {
      const match = matchShortcut(shortcuts, canonicalKey(event.key ?? ""));
      if (match === null) return;
      if (match.id === "nav-up") {
        setActiveIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (match.id === "nav-down") {
        const rows = countOf();
        setActiveIndex((i) => Math.min(i + 1, Math.max(rows - 1, 0)));
        return;
      }
      if (match.id === "apply") onApply?.();
      else if (match.id === "cancel") onCancel?.();
      else if (match.id === "forget") onForget?.();
      else onAction?.(match.id);
    },
  };
}

/**
 * The candidates for a name being typed: the names that contain the query, and
 * the typed value itself when nothing answers it exactly. A name the user can
 * create is a candidate, never a miss.
 */
export function nameCandidates(
  names: readonly string[],
  query: string,
): string[] {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return [...names];
  const filtered = names.filter((n) => n.toLowerCase().includes(q));
  if (names.some((n) => n.toLowerCase() === q)) return filtered;
  return [...filtered, query.trim()];
}

/**
 * The candidates among labelled revsets: a query matches the human label or the
 * revset itself, and a revset is offered once however many times it is defined.
 */
export function labeledCandidates<T extends { label: string; revset: string }>(
  rows: readonly T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.revset)) return false;
    seen.add(row.revset);
    return (
      q.length === 0 ||
      row.label.toLowerCase().includes(q) ||
      row.revset.toLowerCase().includes(q)
    );
  });
}
