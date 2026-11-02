import { type ReactNode, createContext, useContext, useState } from "react";
import { AnimatePresence, type StyleDesc, motion } from "@gpuix/react";
import { rowHoverBg, useAdwaita } from "../theme/adwaita";
import { Icon, type IconName } from "./icons";
import { isActivateKey } from "../lib/roving";

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
      value={{
        open: isOpen,
        onOpenChange: setOpen,
        disabled: disabled ?? false,
      }}
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
  const isOpen = open ?? ctx.open;
  const isDisabled = disabled ?? ctx.disabled;
  return (
    <DisclosureTrigger
      iconSize={16}
      iconName={isOpen ? "chevronUp" : "chevronDown"}
      disabled={isDisabled}
      onToggle={
        isDisabled ? undefined : (onToggle ?? (() => ctx.onOpenChange(!isOpen)))
      }
      style={{
        minHeight: t.control.rowHeight,
        paddingLeft: t.control.groupRowInset,
        paddingRight: t.control.groupRowInset,
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
  const t = useAdwaita();
  return (
    <DisclosureContent
      open={open ?? ctx.open}
      style={{
        paddingLeft: t.control.groupRowInset,
        paddingRight: t.control.groupRowInset,
        paddingBottom: t.space.md,
        ...style,
      }}
    >
      {children}
    </DisclosureContent>
  );
}

export function DisclosureTrigger({
  children,
  onToggle,
  iconSize = 14,
  iconPosition = "end",
  iconName = "chevronDown",
  disabled,
  style,
}: {
  children: ReactNode;
  onToggle?: () => void;
  iconSize?: number;
  iconPosition?: "start" | "end";
  iconName?: IconName;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const chevron = (
    <Icon
      name={iconName}
      size={iconSize}
      color={t.color.text.dim}
      style={{ flexShrink: 0, pointerEvents: "none" }}
    />
  );
  return (
    <div
      onClick={disabled ? undefined : onToggle}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (disabled) return;
        if (isActivateKey(event.key, { space: true })) onToggle?.();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        minHeight: 36,
        borderRadius: t.radius.sm,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        hover: disabled ? undefined : { backgroundColor: rowHoverBg(t) },
        ...style,
      }}
    >
      {iconPosition === "start" ? chevron : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
      {iconPosition === "end" ? chevron : null}
    </div>
  );
}

export function DisclosureContent({
  open,
  children,
  style,
}: {
  open: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="disclosure-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            paddingLeft: 0,
            paddingRight: t.space.sm,
            paddingTop: 0,
            paddingBottom: t.space.sm,
            ...style,
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
