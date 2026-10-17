import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Spinner } from "../../components/Spinner";
import {
  Collapsible,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";
import { RowChevron } from "./RowChevron";

interface ReasoningContextValue {
  isStreaming: boolean;
  duration?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReasoningCtx = createContext<ReasoningContextValue | null>(null);

function useReasoning(): ReasoningContextValue {
  const ctx = useContext(ReasoningCtx);
  if (!ctx)
    throw new Error("Reasoning components must be used within <Reasoning>");
  return ctx;
}

export interface ReasoningProps {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Reasoning({
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  duration,
  children,
  style,
}: ReasoningProps) {
  const { open: isOpen, setOpen, setInternal } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );

  useEffect(() => {
    if (isStreaming && open === undefined && defaultOpen !== false) {
      setInternal(true);
    }
  }, [isStreaming, open, defaultOpen]);

  const value = useMemo<ReasoningContextValue>(
    () => ({ isStreaming, duration, open: isOpen, onOpenChange: setOpen }),
    [isStreaming, duration, isOpen],
  );

  return (
    <ReasoningCtx.Provider value={value}>
      <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
        {children}
      </Collapsible>
    </ReasoningCtx.Provider>
  );
}

export interface ReasoningHeaderProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: Partial<StyleDesc>;
}

export function ReasoningHeader({
  children,
  open,
  onOpenChange,
  style,
}: ReasoningHeaderProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  const ctx = useReasoning();
  const isOpen = open ?? ctx.open;
  const toggle = onOpenChange ?? ctx.onOpenChange;
  const title =
    children ??
    (ctx.isStreaming
      ? "Thinking…"
      : ctx.duration !== undefined
        ? `Thought for ${ctx.duration}s`
        : "Thought");
  return (
    <div
      onClick={() => toggle(!isOpen)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.gap,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      {ctx.isStreaming ? (
        <div style={{ flexShrink: 0, pointerEvents: "none" }}>
          <Spinner size={16} label={false} />
        </div>
      ) : null}
      <T
        size="body"
        weight={400}
        color={ctx.isStreaming ? colors.fg : colors.dim_fg}
        style={{
          flexShrink: 1,
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </T>
      <div style={{ flexGrow: 1 }} />
      <RowChevron open={isOpen} />
    </div>
  );
}

export interface ReasoningContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ReasoningContent({
  open,
  children,
  style,
}: ReasoningContentProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const ctx = useReasoning();
  const isOpen = open ?? ctx.open;
  const paragraphs = Array.isArray(children) ? children : [children];
  return (
    <CollapsibleContent open={isOpen} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.gap,
          padding: spacing.paddingTight,
          borderLeftWidth: 2,
          borderColor: colors.accent,
          backgroundColor: colors.accentTint,
          borderRadius: radii.row,
          minWidth: 0,
        }}
      >
        {paragraphs.map((paragraph, i) =>
          paragraph === undefined || paragraph === null ? null : (
            <T key={i} size="body" color={colors.dim_fg}>
              {paragraph}
            </T>
          ),
        )}
      </div>
    </CollapsibleContent>
  );
}
