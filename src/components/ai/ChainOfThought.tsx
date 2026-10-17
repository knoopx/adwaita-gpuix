import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../../components/common";
import { Icon, type IconName } from "../../components/icons";
import { Badge } from "../../components/Badge";
import { Spinner } from "../../components/Spinner";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  useControllableOpen,
} from "../../components/Collapsible";

export type ChainOfThoughtStepStatus = "pending" | "running" | "complete";

interface ChainOfThoughtContextValue {
  active: boolean;
}

const ChainOfThoughtCtx = createContext<ChainOfThoughtContextValue | null>(
  null,
);

function useChainOfThought(): ChainOfThoughtContextValue {
  return useContext(ChainOfThoughtCtx) ?? { active: false };
}

export interface ChainOfThoughtProps {
  
  active?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThought({
  active = false,
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: ChainOfThoughtProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const { open: isOpen, setOpen, setInternal } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );

  useEffect(() => {
    if (active && open === undefined && defaultOpen !== false) {
      setInternal(true);
    }
  }, [active, open, defaultOpen]);

  const value = useMemo<ChainOfThoughtContextValue>(
    () => ({ active }),
    [active],
  );

  return (
    <ChainOfThoughtCtx.Provider value={value}>
      <Collapsible
        open={isOpen}
        onOpenChange={setOpen}
        style={{
          borderRadius: radii.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.view_bg,
          ...style,
        }}
      >
        {children}
      </Collapsible>
    </ChainOfThoughtCtx.Provider>
  );
}

function StepIndicator({
  active,
  icon,
  color,
}: {
  active: boolean;
  icon: IconName;
  color: string;
}) {
  return active ? (
    <div style={{ flexShrink: 0 }}>
      <Spinner size={16} label={false} />
    </div>
  ) : (
    <Icon name={icon} size={14} color={color} style={{ flexShrink: 0 }} />
  );
}

export interface ChainOfThoughtHeaderProps {
  title?: ReactNode;
  steps?: number;
  icon?: IconName;
  
  active?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtHeader({
  title,
  steps,
  icon = "sparkles",
  active,
  children,
  style,
}: ChainOfThoughtHeaderProps) {
  const t = useAdwaita();
  const { colors } = t;
  const ctx = useChainOfThought();
  const isActive = active ?? ctx.active;
  const text =
    children ??
    title ??
    (isActive
      ? "Thinking…"
      : steps !== undefined
        ? `Researched in ${steps} steps`
        : "Researched");
  return (
    <CollapsibleTrigger style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
        }}
      >
        <StepIndicator active={isActive} icon={icon} color={colors.dim_fg} />
        <T
          size="body"
          color={isActive ? colors.fg : colors.dim_fg}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {text}
        </T>
      </div>
    </CollapsibleTrigger>
  );
}

export interface ChainOfThoughtContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtContent({
  open,
  children,
  style,
}: ChainOfThoughtContentProps) {
  const t = useAdwaita();
  const { colors } = t;
  const items = Children.toArray(children);
  return (
    <CollapsibleContent open={open} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingTop: 4,
          minWidth: 0,
        }}
      >
        {items.map((item, index) =>
          item == null ? null : (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                ...(index > 0
                  ? {
                      borderTopWidth: 1,
                      borderColor: colors.border,
                      paddingTop: 8,
                    }
                  : {}),
              }}
            >
              {item}
            </div>
          ),
        )}
      </div>
    </CollapsibleContent>
  );
}

export interface ChainOfThoughtStepProps {
  icon?: IconName;
  label: ReactNode;
  description?: ReactNode;
  status?: ChainOfThoughtStepStatus;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtStep({
  icon = "circle",
  label,
  description,
  status = "complete",
  children,
  style,
}: ChainOfThoughtStepProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        opacity: status === "pending" ? 0.6 : 1,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.gap,
          minWidth: 0,
        }}
      >
        <StepIndicator
          active={status === "running"}
          icon={icon}
          color={status === "complete" ? colors.fg : colors.dim_fg}
        />
        <T
          size="body"
          color={status === "pending" ? colors.dim_fg : colors.fg}
          style={{ flexShrink: 1, textOverflow: "ellipsis" }}
        >
          {label}
        </T>
      </div>
      {description !== undefined ? (
        <T size="caption" color={colors.dim_fg}>
          {description}
        </T>
      ) : null}
      {children}
    </div>
  );
}

export interface ChainOfThoughtSearchResultsProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtSearchResults({
  children,
  style,
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface ChainOfThoughtSearchResultProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtSearchResult({
  children,
  style,
}: ChainOfThoughtSearchResultProps) {
  return (
    <Badge variant="secondary" style={style}>
      {children}
    </Badge>
  );
}

export interface ChainOfThoughtImageProps {
  caption?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ChainOfThoughtImage({
  caption,
  children,
  style,
}: ChainOfThoughtImageProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 96,
          borderRadius: radii.row,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.button_bg,
          padding: spacing.padding,
        }}
      >
        {children}
      </div>
      {caption ? (
        <T size="caption" color={colors.dim_fg}>
          {caption}
        </T>
      ) : null}
    </div>
  );
}
