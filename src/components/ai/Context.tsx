import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
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
  if (!ctx) throw new Error("Context parts must be used within <Context>");
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
  const { usedTokens, maxTokens } = useContextValue();
  const percent = Math.round(usagePercent(usedTokens, maxTokens));
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
            paddingLeft: t.space.md,
            paddingRight: t.space.md,
            borderRadius: t.radius.full,
            borderWidth: 0,
            backgroundColor: t.color.surface.button,
            cursor: "pointer",
            hover: { backgroundColor: t.color.surface.buttonHover },
            ...style,
          }}
        >
          <T
            size="caption"
            weight={600}
            color={t.color.text.dim}
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

function usagePercent(usedTokens: number, maxTokens: number): number {
  return maxTokens > 0 ? (usedTokens / maxTokens) * 100 : 0;
}

function UsageRow({ label, value }: { label: string; value: number }) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: t.space.sm,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {label}
      </T>
      <T size="caption">{value.toLocaleString("en-US")}</T>
    </div>
  );
}

const USAGE_ROWS: Array<{ label: string; token: keyof ContextUsage }> = [
  { label: "Input", token: "inputTokens" },
  { label: "Output", token: "outputTokens" },
];

function UsageRows({ usage }: { usage?: ContextUsage }) {
  if (!usage) return null;
  const rows = USAGE_ROWS.map((row) => ({
    label: row.label,
    value: usage[row.token] ?? 0,
  })).filter((row) => row.value > 0);
  return rows.map((row) => (
    <UsageRow key={row.label} label={row.label} value={row.value} />
  ));
}

function ContextContentBody({
  usedTokens,
  maxTokens,
  usage,
}: {
  usedTokens: number;
  maxTokens: number;
  usage?: ContextUsage;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: t.space.sm,
        }}
      >
        <T size="body" weight={600}>
          Context used
        </T>
        <T
          size="caption"
          color={t.color.text.dim}
          style={{ fontFamily: t.type.fontFamilyMono }}
        >
          {usedTokens.toLocaleString("en-US")} /{" "}
          {maxTokens.toLocaleString("en-US")} tokens
        </T>
      </div>
      <div aria-label="Context used">
        <ProgressBar value={usagePercent(usedTokens, maxTokens)} />
      </div>
      <UsageRows usage={usage} />
    </div>
  );
}

export function ContextContent({ children, side, style }: ContextContentProps) {
  const { usedTokens, maxTokens, usage } = useContextValue();
  return (
    <HoverCardContent side={side} style={{ minWidth: 240, ...style }}>
      {children ?? (
        <ContextContentBody
          usedTokens={usedTokens}
          maxTokens={maxTokens}
          usage={usage}
        />
      )}
    </HoverCardContent>
  );
}
