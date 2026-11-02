import { type ReactNode, createContext, useContext, useMemo } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon } from "../../components/icons";
import { Collapsible, useControllableOpen } from "../../components/Collapsible";
import { DisclosureBody } from "./DisclosureBody";
import { DisclosureRow } from "./DisclosureRow";
import { RowChevron } from "./RowChevron";
import { RowLabel } from "./RowLabel";
import { StatusGlyph } from "./StatusGlyph";

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
        name="formatListNumbered"
        size={14}
        color={t.color.text.dim}
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
  return (
    <RowLabel weight={400} style={style}>
      {children}
    </RowLabel>
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
      color={t.color.text.dim}
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
  const ctx = usePlanContext();
  const isOpen = open ?? ctx?.open ?? false;
  return (
    <DisclosureBody open={isOpen} indent style={style}>
      {children}
    </DisclosureBody>
  );
}

export interface PlanStepProps {
  title: ReactNode;
  status?: PlanStepStatus;
  style?: Partial<StyleDesc>;
}

export function PlanStep({ title, status = "pending", style }: PlanStepProps) {
  return (
    <DisclosureRow
      icon={<StatusGlyph status={status === "done" ? "complete" : status} />}
      label={title}
      style={style}
    />
  );
}
