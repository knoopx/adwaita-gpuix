import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon } from "../../components/icons";
import { Spinner } from "../../components/Spinner";
import {
  Collapsible,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";
import { Glyph } from "./Glyph";
import { OutputBox } from "./OutputBox";
import { RowChevron } from "./RowChevron";

export type ToolState =
  | "running"
  | "output-available"
  | "output-error"
  | "output-denied";

const TOOL_STATE_PREFIX: Record<ToolState, string> = {
  running: "Running",
  "output-available": "Ran",
  "output-error": "Failed to run",
  "output-denied": "Denied",
};

interface ToolContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ToolCtx = createContext<ToolContextValue | null>(null);

function useToolContext(): ToolContextValue | null {
  return useContext(ToolCtx);
}

export interface ToolProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Tool({
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: ToolProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const value = useMemo<ToolContextValue>(
    () => ({ open: isOpen, onOpenChange: setOpen }),
    [isOpen],
  );
  return (
    <ToolCtx.Provider value={value}>
      <Collapsible
        open={isOpen}
        onOpenChange={setOpen}
        style={{
          backgroundColor: colors.view_bg,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radii.card,
          overflow: "hidden",
          ...style,
        }}
      >
        {children}
      </Collapsible>
    </ToolCtx.Provider>
  );
}

export interface ToolHeaderProps {
  state: ToolState;
  title?: string;
  toolName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ToolHeader({
  state,
  title,
  toolName,
  open,
  onOpenChange,
  children,
  style,
}: ToolHeaderProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const ctx = useToolContext();
  const isOpen = open ?? ctx?.open ?? false;
  const toggle = onOpenChange ?? ctx?.onOpenChange;
  const prefix = TOOL_STATE_PREFIX[state];
  const text =
    children ?? title ?? (toolName ? `${prefix} ${toolName}` : prefix);
  const statusColor =
    state === "output-available"
      ? colors.success
      : state === "output-error"
        ? colors.destructive
        : colors.dim_fg;
  return (
    <div
      onClick={toggle ? () => toggle(!isOpen) : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        padding: spacing.gap,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      <Glyph name="terminal" size={16} color={colors.fg} />
      <T
        size="body"
        color={colors.fg}
        style={{
          flexShrink: 1,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {text}
      </T>
      <div style={{ flexGrow: 1 }} />
      {state === "running" ? (
        <div style={{ flexShrink: 0 }}>
          <Spinner size={16} label={false} />
        </div>
      ) : (
        <Icon
          name={state === "output-available" ? "check" : "close"}
          size={14}
          color={statusColor}
          style={{ flexShrink: 0 }}
        />
      )}
      <RowChevron open={isOpen} />
    </div>
  );
}

function formatValue(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export interface ToolContentProps {
  open?: boolean;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ToolContent({
  open,
  input,
  output,
  errorText,
  children,
  style,
}: ToolContentProps) {
  const t = useAdwaita();
  const { colors, typography, spacing } = t;
  const ctx = useToolContext();
  const isOpen = open ?? ctx?.open ?? false;
  const hasOutput = output !== undefined || errorText !== undefined;
  const inputLines =
    input !== undefined ? formatValue(input).split("\n") : [];
  return (
    <CollapsibleContent open={isOpen} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          paddingLeft: spacing.paddingTight,
          borderLeftWidth: 2,
          borderColor: colors.border,
          minWidth: 0,
        }}
      >
        {inputLines.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              minWidth: 0,
            }}
          >
            {inputLines.map((line, i) => (
              <T
                key={i}
                size="caption"
                color={colors.dim_fg}
                style={{
                  flexShrink: 1,
                  fontFamily: typography.fontFamilyMono,
                }}
              >
                {line.length > 0 ? line : " "}
              </T>
            ))}
          </div>
        ) : null}
        {children}
        {hasOutput ? (
          <OutputBox
            text={errorText ?? formatValue(output)}
            tone={errorText ? "error" : "default"}
          />
        ) : null}
      </div>
    </CollapsibleContent>
  );
}
