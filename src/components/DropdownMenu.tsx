import { type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
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

export interface DropdownMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
}

export interface DropdownMenuTriggerProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export type DropdownMenuContentProps = Omit<MenuContentPartProps, "maxHeight">;

export type DropdownMenuItemProps = MenuItemPartProps;

export type DropdownMenuLabelProps = MenuLabelPartProps;

export type DropdownMenuSeparatorProps = MenuSeparatorPartProps;

export type DropdownMenuGroupProps = MenuGroupProps;

export type DropdownMenuCheckboxItemProps = MenuCheckboxItemPartProps;

export type DropdownMenuRadioItemProps = MenuRadioItemPartProps;

export type DropdownMenuRadioGroupProps = MenuRadioGroupPartProps;

export type DropdownMenuShortcutProps = MenuShortcutPartProps;

export type DropdownMenuSubProps = MenuSubPartProps;

export type DropdownMenuSubTriggerProps = MenuSubTriggerPartProps;

export type DropdownMenuSubContentProps = MenuSubContentPartProps;

interface DropdownMenuContext {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DDMCtx = createContext<DropdownMenuContext | null>(null);

function useDropdownMenu(): DropdownMenuContext {
  const ctx = useContext(DDMCtx);
  if (!ctx)
    throw new Error(
      "DropdownMenu components must be used within <DropdownMenu>",
    );
  return ctx;
}

const menuParts = makeMenuParts(useDropdownMenu, { panelMinWidth: 180 });

export function DropdownMenu({
  open,
  onOpenChange,
  children,
}: DropdownMenuProps) {
  return (
    <DDMCtx.Provider value={{ open, onOpenChange }}>{children}</DDMCtx.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  style,
}: DropdownMenuTriggerProps) {
  const { open, onOpenChange } = useDropdownMenu();
  return (
    <div
      onClick={() => onOpenChange(!open)}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export const DropdownMenuContent = menuParts.Content;

export const DropdownMenuItem = menuParts.Item;

export const DropdownMenuLabel = menuParts.Label;

export const DropdownMenuSeparator = menuParts.Separator;

export const DropdownMenuGroup = menuParts.Group;

export const DropdownMenuCheckboxItem = menuParts.CheckboxItem;

export const DropdownMenuRadioItem = menuParts.RadioItem;

export const DropdownMenuRadioGroup = menuParts.RadioGroup;

export const DropdownMenuShortcut = menuParts.Shortcut;

export const DropdownMenuSub = menuParts.Sub;

export const DropdownMenuSubTrigger = menuParts.SubTrigger;

export const DropdownMenuSubContent = menuParts.SubContent;
