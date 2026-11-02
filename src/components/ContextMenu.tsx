import { type ReactNode, createContext, useContext } from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import {
  makeMenuParts,
  type MenuContentPartProps,
  type MenuGroupProps,
  type MenuItemPartProps,
  type MenuLabelPartProps,
  type MenuRadioGroupPartProps,
  type MenuRadioItemPartProps,
  type MenuSeparatorPartProps,
  type MenuShortcutPartProps,
  type MenuSubContentPartProps,
  type MenuSubPartProps,
  type MenuSubTriggerPartProps,
  type MenuCheckboxItemPartProps,
} from "./menu-parts";
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

export type ContextMenuContentProps = MenuContentPartProps;

export type ContextMenuItemProps = Omit<MenuItemPartProps, "inset">;

export type ContextMenuGroupProps = MenuGroupProps;

export type ContextMenuLabelProps = MenuLabelPartProps;

export type ContextMenuSeparatorProps = MenuSeparatorPartProps;

export type ContextMenuShortcutProps = MenuShortcutPartProps;

export type ContextMenuCheckboxItemProps = MenuCheckboxItemPartProps;

export type ContextMenuRadioItemProps = MenuRadioItemPartProps;

export type ContextMenuRadioGroupProps = MenuRadioGroupPartProps;

export type ContextMenuSubProps = MenuSubPartProps;

export type ContextMenuSubTriggerProps = MenuSubTriggerPartProps;

export type ContextMenuSubContentProps = MenuSubContentPartProps;

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

const menuParts = makeMenuParts(useContextMenu, {
  panelMinWidth: 160,
  panelXOffset: 4,
});

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

export const ContextMenuContent = menuParts.Content;

export const ContextMenuItem = menuParts.Item;

export const ContextMenuGroup = menuParts.Group;

export const ContextMenuLabel = menuParts.Label;

export const ContextMenuSeparator = menuParts.Separator;

export const ContextMenuShortcut = menuParts.Shortcut;

export const ContextMenuCheckboxItem = menuParts.CheckboxItem;

export const ContextMenuRadioGroup = menuParts.RadioGroup;

export const ContextMenuRadioItem = menuParts.RadioItem;

export const ContextMenuSub = menuParts.Sub;

export const ContextMenuSubTrigger = menuParts.SubTrigger;

export const ContextMenuSubContent = menuParts.SubContent;
