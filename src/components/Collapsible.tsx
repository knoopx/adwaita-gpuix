import { createContext, useContext, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { DisclosureTrigger, DisclosureContent } from "./common";

export interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  defaultOpen?: boolean;
  disabled?: boolean;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

interface CollapsibleContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
}

const CollapsibleCtx = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(): CollapsibleContextValue {
  const ctx = useContext(CollapsibleCtx);
  return ctx ?? { open: false, onOpenChange: () => {}, disabled: false };
}

export interface ControllableOpenState {
  open: boolean;
  setOpen: (open: boolean) => void;
  setInternal: (open: boolean) => void;
}

export function useControllableOpen(
  open: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
): ControllableOpenState {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  return { open: isOpen, setOpen, setInternal };
}

export function Collapsible({
  open,
  onOpenChange,
  defaultOpen,
  disabled,
  children,
  style,
}: CollapsibleProps) {
  const { open: isOpen, setOpen } = useControllableOpen(
    open,
    defaultOpen ?? false,
    onOpenChange,
  );
  return (
    <CollapsibleCtx.Provider
      value={{ open: isOpen, onOpenChange: setOpen, disabled: disabled ?? false }}
    >
      <div style={{ display: "flex", flexDirection: "column", ...style }}>
        {children}
      </div>
    </CollapsibleCtx.Provider>
  );
}

export interface CollapsibleTriggerProps {
  children: ReactNode;
  open?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function CollapsibleTrigger({
  children,
  open,
  onToggle,
  disabled,
  style,
}: CollapsibleTriggerProps) {
  const ctx = useCollapsible();
  const t = useAdwaita();
  const { spacing } = t;
  const isOpen = open ?? ctx.open;
  const isDisabled = disabled ?? ctx.disabled;
  return (
    <DisclosureTrigger
      iconSize={16}
      iconName={isOpen ? "chevronUp" : "chevronDown"}
      disabled={isDisabled}
      onToggle={isDisabled ? undefined : onToggle ?? (() => ctx.onOpenChange(!isOpen))}
      style={{
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.gap,
        ...style,
      }}
    >
      {children}
    </DisclosureTrigger>
  );
}

export interface CollapsibleContentProps {
  children: ReactNode;
  open?: boolean;
  style?: Partial<StyleDesc>;
}

export function CollapsibleContent({
  children,
  open,
  style,
}: CollapsibleContentProps) {
  const ctx = useCollapsible();
  return (
    <DisclosureContent open={open ?? ctx.open} style={style}>
      {children}
    </DisclosureContent>
  );
}


