import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../../components/HoverCard";
import { ProgressBar } from "../../components/ProgressBar";

export interface ContextUsage {
  inputTokens?: number;
  outputTokens?: number;
}

interface ContextSchema {
  usedTokens: number;
  maxTokens: number;
  usage?: ContextUsage;
}

const ContextCtx = createContext<ContextSchema | null>(null);

function useContextValue(): ContextSchema {
  const ctx = useContext(ContextCtx);
  if (!ctx)
    throw new Error("Context parts must be used within <Context>");
  return ctx;
}

export interface ContextProps {
  usedTokens: number;
  maxTokens: number;
  usage?: ContextUsage;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Context({
  usedTokens,
  maxTokens,
  usage,
  open,
  onOpenChange,
  children,
  style,
}: ContextProps) {
  const [internal, setInternal] = useState(false);
  const isOpen = open ?? internal;
  const schema = useMemo<ContextSchema>(
    () => ({ usedTokens, maxTokens, usage }),
    [usedTokens, maxTokens, usage],
  );
  const handleOpenChange = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return (
    <ContextCtx.Provider value={schema}>
      <HoverCard open={isOpen} onOpenChange={handleOpenChange}>
        {children}
      </HoverCard>
    </ContextCtx.Provider>
  );
}

export interface ContextTriggerProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ContextTrigger({ children, style }: ContextTriggerProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const { usedTokens, maxTokens } = useContextValue();
  const percent =
    maxTokens > 0 ? Math.round((usedTokens / maxTokens) * 100) : 0;
  return (
    <HoverCardTrigger>
      {children ?? (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            minHeight: 28,
            minWidth: 110,
            paddingLeft: spacing.paddingTight,
            paddingRight: spacing.paddingTight,
            borderRadius: radii.pill,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.button_bg,
            cursor: "pointer",
            hover: { backgroundColor: colors.button_hover },
            ...style,
          }}
        >
          <T
            size="caption"
            weight={600}
            color={colors.dim_fg}
            style={{ flexShrink: 1, whiteSpace: "nowrap" }}
          >
            {percent}% context
          </T>
        </div>
      )}
    </HoverCardTrigger>
  );
}

export interface ContextContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  style?: Partial<StyleDesc>;
}

function UsageRow({ label, value }: { label: string; value: number }) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.gap,
      }}
    >
      <T size="caption" color={colors.dim_fg}>
        {label}
      </T>
      <T size="caption">{value.toLocaleString("en-US")}</T>
    </div>
  );
}

export function ContextContent({
  children,
  side,
  style,
}: ContextContentProps) {
  const t = useAdwaita();
  const { colors, typography, spacing } = t;
  const { usedTokens, maxTokens, usage } = useContextValue();
  const percent = maxTokens > 0 ? (usedTokens / maxTokens) * 100 : 0;
  return (
    <HoverCardContent side={side} style={{ minWidth: 240, ...style }}>
      {children ?? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: spacing.gap,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: spacing.gap,
            }}
          >
            <T size="body" weight={600}>
              Context used
            </T>
            <T
              size="caption"
              color={colors.dim_fg}
              style={{ fontFamily: typography.fontFamilyMono }}
            >
              {usedTokens.toLocaleString("en-US")} /{" "}
              {maxTokens.toLocaleString("en-US")} tokens
            </T>
          </div>
          <div aria-label="Context used">
            <ProgressBar value={percent} />
          </div>
          {usage && (usage.inputTokens ?? 0) > 0 ? (
            <UsageRow label="Input" value={usage.inputTokens ?? 0} />
          ) : null}
          {usage && (usage.outputTokens ?? 0) > 0 ? (
            <UsageRow label="Output" value={usage.outputTokens ?? 0} />
          ) : null}
        </div>
      )}
    </HoverCardContent>
  );
}

