import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import {
  FloatingPanel,
  MenuRow,
  MenuIndicator,
  MenuShortcut,
  MenuLabel,
  MenuSeparator,
  MenuGroup,
  MenuRadioGroupShell,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  makeMenuRadioItem,
  MenuItemRow,
} from "./common";
import { type IconName } from "./icons";

export interface ContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export interface ContextMenuTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuContentProps {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  
  maxHeight?: number;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuItemProps {
  label: string;
  icon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "destructive";
  shortcut?: string;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuGroupProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuLabelProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuSeparatorProps {
  style?: Partial<StyleDesc>;
}

export interface ContextMenuShortcutProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuCheckboxItemProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuRadioItemProps {
  label: string;
  value?: string;
  selected?: boolean;
  onSelect?: () => void;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuSubProps {
  children?: ReactNode;
  defaultOpen?: boolean;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuSubTriggerProps {
  label: string;
  icon?: IconName;
  style?: Partial<StyleDesc>;
}

export interface ContextMenuSubContentProps {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface ContextMenuContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CtxMenuCtx = createContext<ContextMenuContext | null>(null);

function useContextMenu(): ContextMenuContext {
  const ctx = useContext(CtxMenuCtx);
  if (!ctx)
    throw new Error("ContextMenu components must be used within <ContextMenu>");
  return ctx;
}

export function ContextMenu({
  open,
  onOpenChange,
  children,
}: ContextMenuProps) {
  return (
    <CtxMenuCtx.Provider value={{ open, onOpenChange }}>
      {children}
    </CtxMenuCtx.Provider>
  );
}

export function ContextMenuTrigger({
  children,
  style,
}: ContextMenuTriggerProps) {
  const { onOpenChange } = useContextMenu();
  return (
    <div
      onAuxClick={(e: EventPayload) => {
        if (e.isRightClick) onOpenChange(true);
      }}
      style={{ cursor: "pointer", ...style }}
    >
      {children}
    </div>
  );
}

export function ContextMenuContent({
  children,
  side = "bottom",
  sideOffset = 4,
  style,
}: ContextMenuContentProps) {
  const { open } = useContextMenu();

  if (!open) return null;

  return (
    <FloatingPanel
      side={side}
      sideOffset={sideOffset}
      xOffset={4}
      minWidth={160}
      style={style}
    >
      {children}
    </FloatingPanel>
  );
}

export function ContextMenuItem({
  label,
  icon,
  onClick,
  disabled,
  variant,
  shortcut,
  style,
}: ContextMenuItemProps) {
  const { onOpenChange } = useContextMenu();
  return (
    <MenuItemRow
      label={label}
      icon={icon}
      onClick={onClick}
      onOpenChange={onOpenChange}
      disabled={disabled}
      variant={variant}
      shortcut={shortcut}
      style={style}
    />
  );
}

export function ContextMenuGroup({ children, style }: ContextMenuGroupProps) {
  return <MenuGroup style={style}>{children}</MenuGroup>;
}

export function ContextMenuLabel({ children, style }: ContextMenuLabelProps) {
  return <MenuLabel style={style}>{children}</MenuLabel>;
}

export function ContextMenuSeparator({ style }: ContextMenuSeparatorProps) {
  return <MenuSeparator style={style} />;
}

export function ContextMenuShortcut({
  children,
  style,
}: ContextMenuShortcutProps) {
  return <MenuShortcut style={style}>{children}</MenuShortcut>;
}

export function ContextMenuCheckboxItem({
  label,
  checked,
  onCheckedChange,
  style,
}: ContextMenuCheckboxItemProps) {
  const { onOpenChange } = useContextMenu();
  return (
    <MenuRow
      label={label}
      leading={<MenuIndicator kind="checkbox" active={checked} />}
      onClick={() => {
        onCheckedChange(!checked);
        onOpenChange(false);
      }}
      style={style}
    />
  );
}

export function ContextMenuRadioGroup({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}: ContextMenuRadioGroupProps) {
  return (
    <MenuRadioGroupShell
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      children={children}
      style={style}
    />
  );
}

const ContextMenuRadioItemBase = makeMenuRadioItem(useContextMenu);

export function ContextMenuRadioItem(props: ContextMenuRadioItemProps) {
  return <ContextMenuRadioItemBase {...props} />;
}

export function ContextMenuSub({
  children,
  defaultOpen,
  style,
}: ContextMenuSubProps) {
  return <MenuSub defaultOpen={defaultOpen} style={style}>{children}</MenuSub>;
}

export function ContextMenuSubTrigger({
  label,
  icon,
  style,
}: ContextMenuSubTriggerProps) {
  return <MenuSubTrigger label={label} icon={icon} style={style} />;
}

export function ContextMenuSubContent({
  children,
  style,
}: ContextMenuSubContentProps) {
  return <MenuSubContent style={style}>{children}</MenuSubContent>;
}


