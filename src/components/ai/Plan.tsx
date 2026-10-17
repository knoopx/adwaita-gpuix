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
import { RowChevron } from "./RowChevron";

export type PlanStepStatus = "done" | "running" | "pending";

interface PlanContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PlanCtx = createContext<PlanContextValue | null>(null);

function usePlanContext(): PlanContextValue | null {
  return useContext(PlanCtx);
}

export interface PlanProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Plan({
  open,
  defaultOpen,
  onOpenChange,
  children,
  style,
}: PlanProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  const value = useMemo<PlanContextValue>(
    () => ({ open: isOpen, onOpenChange: setOpen }),
    [isOpen],
  );
  return (
    <PlanCtx.Provider value={value}>
      <Collapsible open={isOpen} onOpenChange={setOpen} style={style}>
        {children}
      </Collapsible>
    </PlanCtx.Provider>
  );
}

export interface PlanHeaderProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PlanHeader({
  open,
  onOpenChange,
  children,
  style,
}: PlanHeaderProps) {
  const t = useAdwaita();
  const { colors } = t;
  const ctx = usePlanContext();
  const isOpen = open ?? ctx?.open ?? false;
  const toggle = onOpenChange ?? ctx?.onOpenChange;
  return (
    <div
      onClick={toggle ? () => toggle(!isOpen) : undefined}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        cursor: "pointer",
        ...style,
      }}
    >
      <Icon
        name="listOrdered"
        size={14}
        color={colors.dim_fg}
        style={{ flexShrink: 0 }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          minWidth: 0,
          flexGrow: 1,
          flexShrink: 1,
        }}
      >
        {children}
      </div>
      <RowChevron open={isOpen} />
    </div>
  );
}

export interface PlanTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PlanTitle({ children, style }: PlanTitleProps) {
  const t = useAdwaita();
  return (
    <T
      size="body"
      weight={400}
      color={t.colors.fg}
      style={{ flexShrink: 1, textOverflow: "ellipsis", ...style }}
    >
      {children}
    </T>
  );
}

export interface PlanDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PlanDescription({ children, style }: PlanDescriptionProps) {
  const t = useAdwaita();
  return (
    <T
      size="caption"
      color={t.colors.dim_fg}
      style={{ flexShrink: 0, ...style }}
    >
      {children}
    </T>
  );
}

export interface PlanContentProps {
  open?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function PlanContent({ open, children, style }: PlanContentProps) {
  const t = useAdwaita();
  const { colors } = t;
  const ctx = usePlanContext();
  const isOpen = open ?? ctx?.open ?? false;
  return (
    <CollapsibleContent open={isOpen} style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          paddingTop: 4,
          paddingLeft: 12,
          borderLeftWidth: 2,
          borderColor: colors.border,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

export interface PlanStepProps {
  title: ReactNode;
  status?: PlanStepStatus;
  style?: Partial<StyleDesc>;
}

export function PlanStep({
  title,
  status = "pending",
  style,
}: PlanStepProps) {
  const t = useAdwaita();
  const { colors } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        minWidth: 0,
        ...style,
      }}
    >
      {status === "done" ? (
        <Icon
          name="success"
          size={14}
          color={colors.success}
          style={{ flexShrink: 0 }}
        />
      ) : status === "running" ? (
        <Spinner size={16} label={false} style={{ flexShrink: 0 }} />
      ) : (
        <Icon
          name="circle"
          size={14}
          color={colors.dim_fg}
          style={{ flexShrink: 0 }}
        />
      )}
      <T
        size="body"
        color={status === "running" ? colors.fg : colors.dim_fg}
        style={{ flexShrink: 1, textOverflow: "ellipsis" }}
      >
        {title}
      </T>
    </div>
  );
}
