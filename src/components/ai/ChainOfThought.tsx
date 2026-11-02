import {
  Children,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../../components/icons";
import { Badge } from "../../components/Badge";
import {
  Collapsible,
  CollapsibleTrigger,
  useControllableOpen,
} from "../../components/Collapsible";
import { DisclosureBody } from "./DisclosureBody";
import { DisclosureRow } from "./DisclosureRow";
import { StatusGlyph } from "./StatusGlyph";

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
  const {
    open: isOpen,
    setOpen,
    setInternal,
  } = useControllableOpen(open, defaultOpen ?? false, onOpenChange);

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
      <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
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
  return (
    <StatusGlyph
      status={active ? "running" : "complete"}
      icon={icon}
      color={color}
    />
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
  icon = "autoAwesome",
  active,
  children,
  style,
}: ChainOfThoughtHeaderProps) {
  const t = useAdwaita();
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
      <DisclosureRow
        icon={
          <StepIndicator
            active={isActive}
            icon={icon}
            color={t.color.text.dim}
          />
        }
        label={text}
      />
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
  const items = Children.toArray(children);
  return (
    <DisclosureBody
      open={open}
      inset={{ paddingTop: 4, minWidth: 0 }}
      style={style}
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
                    borderColor: t.color.border.default,
                    paddingTop: 8,
                  }
                : {}),
            }}
          >
            {item}
          </div>
        ),
      )}
    </DisclosureBody>
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
      <DisclosureRow
        icon={
          <StepIndicator
            active={status === "running"}
            icon={icon}
            color={
              status === "complete" ? t.color.text.primary : t.color.text.dim
            }
          />
        }
        label={label}
      />
      {description !== undefined ? (
        <T size="caption" color={t.color.text.dim}>
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
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 96,
          borderRadius: t.radius.sm,
          borderWidth: 0,
          backgroundColor: t.color.surface.button,
          padding: t.space.lg,
        }}
      >
        {children}
      </div>
      {caption ? (
        <T size="caption" color={t.color.text.dim}>
          {caption}
        </T>
      ) : null}
    </div>
  );
}
